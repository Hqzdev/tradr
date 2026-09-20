package dev.tradr.backend.agents.web.dto;

import java.math.BigDecimal;

public record AgentHoldingResponse(String ticker, String name, BigDecimal quantity, BigDecimal averagePrice,
                                   BigDecimal currentPrice, BigDecimal marketValue, BigDecimal profit,
                                   BigDecimal profitPercent) {}
