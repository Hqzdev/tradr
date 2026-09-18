package dev.tradr.backend.market.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record IndexQuoteResponse(
        String name,
        String value,
        BigDecimal changePercent,
        Instant updatedAt
) {
}
