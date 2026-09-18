package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PositionResponse(
        HoldingResponse holding,
        Instant updatedAt,
        List<TradeResponse> history
) {
}
