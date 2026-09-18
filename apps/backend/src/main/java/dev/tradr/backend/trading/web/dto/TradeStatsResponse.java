package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;

public record TradeStatsResponse(
        long tradesToday,
        long buyCount,
        long sellCount,
        BigDecimal turnover,
        BigDecimal commission,
        long openOrders
) {
}
