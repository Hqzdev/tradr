package dev.tradr.backend.auth.web.dto;

import java.util.UUID;

// То, что безопасно вернуть клиенту о пользователе — без passwordHash и
// прочих внутренних полей. Используется и внутри AuthResponse, и в /auth/me.
public record UserResponse(
        UUID id,
        String email,
        String displayName
) {}
