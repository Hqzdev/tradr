package dev.tradr.backend.market.exception;

public class InvalidTimeframeException extends RuntimeException {

    public InvalidTimeframeException(String timeframe) {
        super("Неподдерживаемый таймфрейм: " + timeframe);
    }
}
