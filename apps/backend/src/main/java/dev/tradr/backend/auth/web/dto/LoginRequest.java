package dev.tradr.backend.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Тело запроса POST /api/v1/auth/login. Пароль тут — сырой текст с
// формы, в базу как есть никогда не попадает — сверяется через
// passwordEncoder.matches() в AuthService.
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {}
