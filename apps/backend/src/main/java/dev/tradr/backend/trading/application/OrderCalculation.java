package dev.tradr.backend.trading.application;

import java.math.BigDecimal;

public record OrderCalculation(
        BigDecimal quantity,
        BigDecimal gross,
        BigDecimal commission,
        BigDecimal total,
        boolean valid
) {
}
