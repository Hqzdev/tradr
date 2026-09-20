package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TradeResponse(
        UUID id,
        UUID orderId,
        String ticker,
        String side,
        BigDecimal quantity,
        BigDecimal price,
        BigDecimal gross,
        BigDecimal commission,
        BigDecimal total,
        UUID agentId,
        String agentName,
        Instant executedAt
) {
}
