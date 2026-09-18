package dev.tradr.backend.auth.web;

import dev.tradr.backend.auth.application.AuthService;
import dev.tradr.backend.auth.web.dto.AuthResponse;
import dev.tradr.backend.auth.web.dto.LoginRequest;
import dev.tradr.backend.auth.web.dto.RefreshRequest;
import dev.tradr.backend.auth.web.dto.RegisterRequest;
import dev.tradr.backend.auth.web.dto.UserResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

// Пути даны без /health — он открыт напрямую (common/HealthController) и
// был проверен ещё в Phase 0, трогать не стал, чтобы не сломать уже
// рабочую команду `curl localhost:8080/health` из README.
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshRequest request) {
        return authService.refresh(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest request) {
        authService.logout(request);
        return ResponseEntity.noContent().build();
    }

    // Principal — UUID пользователя, его туда кладёт JwtAuthenticationFilter
    // после проверки подписи access-токена. Путь защищённый (см.
    // SecurityConfig: всё, кроме /health и /api/v1/auth/**, требует токен),
    // так что здесь Authentication гарантированно не null.
    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        return authService.me(userId);
    }
}
