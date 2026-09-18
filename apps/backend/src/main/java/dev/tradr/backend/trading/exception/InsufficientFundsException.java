package dev.tradr.backend.trading.exception;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException() {
        super("Not enough cash for this order");
    }
}
