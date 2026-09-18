package dev.tradr.backend.trading.exception;

public class InsufficientPositionException extends RuntimeException {
    public InsufficientPositionException() {
        super("Not enough shares for this order");
    }
}
