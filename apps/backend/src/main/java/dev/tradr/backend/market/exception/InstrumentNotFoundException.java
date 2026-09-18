package dev.tradr.backend.market.exception;

public class InstrumentNotFoundException extends RuntimeException {

    public InstrumentNotFoundException(String ticker) {
        super("Инструмент не найден: " + ticker);
    }
}
