package dev.tradr.backend.auth.exception;

// Бросается, когда refresh-токен не найден, уже отозван или истёк
// (AuthService.refresh()). GlobalExceptionHandler превращает её в HTTP 401.
public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException() {
        super("Недействительный refresh-токен");
    }
}
