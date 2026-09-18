package dev.tradr.backend.auth.web.dto;

import jakarta.validation.constraints.NotBlank;

// Используется и для /auth/refresh, и для /auth/logout — в обоих случаях
// на вход приходит один и тот же refresh-токен.
public record RefreshRequest(
        @NotBlank String refreshToken
) {}
