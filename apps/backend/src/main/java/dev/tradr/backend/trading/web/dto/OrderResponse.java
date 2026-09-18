package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String ticker,
        String side,
        String orderType,
        BigDecimal quantity,
        BigDecimal limitPrice,
        String status,
        String source,
        Instant createdAt,
        Instant filledAt
) {
}
