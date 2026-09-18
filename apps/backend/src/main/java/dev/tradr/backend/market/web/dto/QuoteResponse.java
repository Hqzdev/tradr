package dev.tradr.backend.market.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record QuoteResponse(
        String ticker,
        BigDecimal price,
        BigDecimal changePercent,
        long volume,
        Instant timestamp
) {
}
