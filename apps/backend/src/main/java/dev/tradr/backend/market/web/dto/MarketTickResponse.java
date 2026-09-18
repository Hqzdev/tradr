package dev.tradr.backend.market.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MarketTickResponse(
        String ticker,
        BigDecimal price,
        BigDecimal changePercent,
        Instant ts
) {
}
