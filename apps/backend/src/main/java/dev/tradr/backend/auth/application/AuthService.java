package dev.tradr.backend.auth.application;

import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.domain.RefreshToken;
import dev.tradr.backend.auth.domain.User;
import dev.tradr.backend.auth.exception.EmailAlreadyExistsException;
import dev.tradr.backend.auth.exception.InvalidCredentialsException;
import dev.tradr.backend.auth.exception.InvalidRefreshTokenException;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.auth.repository.RefreshTokenRepository;
import dev.tradr.backend.auth.repository.UserRepository;
import dev.tradr.backend.auth.security.JwtProperties;
import dev.tradr.backend.auth.security.JwtService;
import dev.tradr.backend.auth.web.dto.AuthResponse;
import dev.tradr.backend.auth.web.dto.LoginRequest;
import dev.tradr.backend.auth.web.dto.RefreshRequest;
import dev.tradr.backend.auth.web.dto.RegisterRequest;
import dev.tradr.backend.auth.web.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

@Service
public class AuthService {

    private static final BigDecimal INITIAL_BALANCE = BigDecimal.ZERO.setScale(2);
    private static final String DEFAULT_CURRENCY = "USD";

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            JwtProperties jwtProperties
    ) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException(request.email());
        }

        User user = new User(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.displayName()
        );
        user = userRepository.save(user);

        Account account = new Account(user.getId(), INITIAL_BALANCE, DEFAULT_CURRENCY);
        accountRepository.save(account);

        return issueTokens(user);
    }

    // Логин: ищем пользователя по email и сверяем пароль через BCrypt.
    // Оба варианта неудачи (нет такого email / неверный пароль) кидают
    // один и тот же InvalidCredentialsException — см. его комментарий,
    // почему тексты одинаковые.
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return issueTokens(user);
    }

    // Ротация: старый refresh-токен гасится, выдаётся новый — так что
    // украденный refresh-токен годится только на одно обновление, дальше
    // и вор, и легитимный владелец получат InvalidRefreshTokenException,
    // и это будет заметно (стоит логировать отдельно, когда появится
    // логирование в Phase 9).
    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash(request.refreshToken()))
                .orElseThrow(InvalidRefreshTokenException::new);

        if (stored.getRevokedAt() != null || stored.getExpiresAt().isBefore(Instant.now())) {
            throw new InvalidRefreshTokenException();
        }

        stored.revoke();
        refreshTokenRepository.save(stored);

        User user = userRepository.findById(stored.getUserId())
                .orElseThrow(InvalidRefreshTokenException::new);

        return issueTokens(user);
    }

    @Transactional
    public void logout(RefreshRequest request) {
        refreshTokenRepository.findByTokenHash(hash(request.refreshToken()))
                .ifPresent(token -> {
                    token.revoke();
                    refreshTokenRepository.save(token);
                });
        // Если токена нет в базе (уже отозван/чужой/мусор) — тихо ничего не
        // делаем. Logout идемпотентен: повторный вызов не должен быть ошибкой.
    }

    // Отдаёт данные текущего пользователя для GET /auth/me. userId сюда
    // приходит уже проверенным — его положил JwtAuthenticationFilter после
    // валидации подписи токена, тут просто достаём запись из базы.
    public UserResponse me(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(InvalidCredentialsException::new);
        return toUserResponse(user);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());

        String rawRefreshToken = generateOpaqueToken();
        RefreshToken refreshToken = new RefreshToken(
                user.getId(),
                hash(rawRefreshToken),
                Instant.now().plus(jwtProperties.refreshTtlDays(), ChronoUnit.DAYS)
        );
        refreshTokenRepository.save(refreshToken);

        return new AuthResponse(accessToken, rawRefreshToken, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getDisplayName());
    }

    // 256 бит случайности, base64url без паддинга — не JWT, просто
    // непредсказуемая строка, которую клиент хранит и присылает обратно.
    private String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // В базе хранится только хэш refresh-токена, не сам токен — утечка БД
    // не должна означать утечку рабочих сессий.
    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hashed);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 есть в любой JVM, эта ветка недостижима — но сигнатура
            // MessageDigest.getInstance() всё равно объявляет checked-исключение.
            throw new IllegalStateException(e);
        }
    }
}
