package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;

public record OrderCalculationResponse(
        BigDecimal quantity,
        BigDecimal gross,
        BigDecimal commission,
        BigDecimal total,
        boolean valid
) {
}
