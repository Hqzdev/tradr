package dev.tradr.backend.auth.web.dto;

// accessToken — короткоживущий JWT, кладётся в заголовок Authorization на
// каждый запрос. refreshToken — долгоживущий opaque-токен (не JWT),
// хранится только у клиента; на сервере лежит лишь его SHA-256-хэш
// (см. AuthService).
public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}
