package dev.tradr.backend.common.api;

import dev.tradr.backend.auth.exception.EmailAlreadyExistsException;
import dev.tradr.backend.auth.exception.InvalidCredentialsException;
import dev.tradr.backend.auth.exception.InvalidRefreshTokenException;
import dev.tradr.backend.market.exception.InstrumentNotFoundException;
import dev.tradr.backend.market.exception.InvalidTimeframeException;
import dev.tradr.backend.trading.exception.InvalidOrderException;
import dev.tradr.backend.trading.exception.InsufficientFundsException;
import dev.tradr.backend.trading.exception.InsufficientPositionException;
import dev.tradr.backend.agents.exception.AgentAllocationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

// Один обработчик на всё приложение — контроллеры бросают понятные
// исключения (EmailAlreadyExistsException и т.д.), а превращение их в
// HTTP-статус и { "message": "..." } живёт в одном месте, а не размазано
// по try/catch в каждом методе контроллера.
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailExists(EmailAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler({InvalidCredentialsException.class, InvalidRefreshTokenException.class})
    public ResponseEntity<ErrorResponse> handleUnauthorized(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(InstrumentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(InstrumentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(InvalidTimeframeException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTimeframe(InvalidTimeframeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler({InvalidOrderException.class})
    public ResponseEntity<ErrorResponse> handleInvalidOrder(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler({InsufficientFundsException.class, InsufficientPositionException.class, AgentAllocationException.class})
    public ResponseEntity<ErrorResponse> handleOrderConflict(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ErrorResponse(ex.getMessage()));
    }

    // Срабатывает, когда @Valid на DTO находит нарушение (@NotBlank, @Email,
    // @Size и т.п.) — собираем все ошибки полей в одну строку, а не отдаём
    // только первую попавшуюся.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(message));
    }
}
