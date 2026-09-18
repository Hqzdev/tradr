package dev.tradr.backend.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// record — компактный неизменяемый DTO: поля объявляются один раз в
// заголовке, конструктор/геттеры/equals/hashCode генерируются сами.
// Для сущностей (User, Account...) используем обычный class — там нужен
// protected-конструктор без аргументов для JPA, у record так не сделать.
public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Минимум 8 символов") String password,
        @NotBlank String displayName
) {}
