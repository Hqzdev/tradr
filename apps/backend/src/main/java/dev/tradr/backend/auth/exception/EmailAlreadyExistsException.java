package dev.tradr.backend.auth.exception;

// Бросается в AuthService.register(), когда email уже занят.
// GlobalExceptionHandler ловит её и превращает в HTTP 409 Conflict.
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Пользователь с email " + email + " уже существует");
    }
}
