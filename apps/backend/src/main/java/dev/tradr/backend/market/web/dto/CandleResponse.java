package dev.tradr.backend.market.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CandleResponse(
        Instant timestamp,
        BigDecimal open,
        BigDecimal high,
        BigDecimal low,
        BigDecimal close,
        long volume
) {
}
