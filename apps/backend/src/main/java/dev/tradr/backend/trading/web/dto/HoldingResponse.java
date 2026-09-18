package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;

public record HoldingResponse(
        String ticker,
        String name,
        BigDecimal quantity,
        BigDecimal averagePrice,
        BigDecimal currentPrice,
        BigDecimal marketValue,
        BigDecimal profit,
        BigDecimal profitPercent,
        BigDecimal portfolioSharePercent
) {
}
