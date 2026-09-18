package dev.tradr.backend.trading.web.dto;

import java.math.BigDecimal;
import java.util.List;

public record PortfolioResponse(
        BigDecimal cashBalance,
        BigDecimal holdingsValue,
        BigDecimal totalValue,
        List<HoldingResponse> holdings
) {
}
