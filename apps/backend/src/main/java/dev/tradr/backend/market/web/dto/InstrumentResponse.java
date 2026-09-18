package dev.tradr.backend.market.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record InstrumentResponse(
        String ticker,
        String name,
        String exchange,
        String type,
        String currency,
        BigDecimal price,
        BigDecimal changePercent,
        long volume,
        Instant updatedAt
) {
}
