package dev.tradr.backend.auth.exception;

// Намеренно один и тот же текст для "нет такого email" и "неверный
// пароль" — не даём атакующему через ответ понять, зарегистрирован ли
// email в системе.
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Неверный e-mail или пароль");
    }
}
