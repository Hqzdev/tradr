package dev.tradr.backend.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

// Отвечает только за короткоживущий access-токен (JWT). Refresh-токен —
// не JWT, это случайная строка, которая хранится в БД как хэш (см.
// RefreshToken.java, AuthService) — так его можно отозвать до истечения
// срока, чего с самодостаточным JWT сделать нельзя без чёрного списка.
@Service
public class JwtService {

    private final SecretKey key;
    private final Duration accessTtl;

    public JwtService(JwtProperties properties) {
        // HS256 требует ключ не короче 256 бит (32 байта) — секрет в
        // .env.example длиннее, но перед проды подставь свой случайный,
        // не оставляй плейсхолдер "change_me_...".
        this.key = Keys.hmacShaKeyFor(properties.secret().getBytes(StandardCharsets.UTF_8));
        this.accessTtl = Duration.ofMinutes(properties.accessTtlMinutes());
    }

    public String generateAccessToken(UUID userId, String email) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(accessTtl)))
                .signWith(key)
                .compact();
    }

    /** Бросает JwtException, если подпись неверна или токен истёк — ловится в JwtAuthenticationFilter. */
    public UUID validateAndGetUserId(String token) throws JwtException {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return UUID.fromString(claims.getSubject());
    }
}
