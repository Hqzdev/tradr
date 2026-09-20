package dev.tradr.backend.agents.web.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record AgentPerformanceResponse(UUID agentId, BigDecimal initialCapital, BigDecimal cashBalance,
                                       BigDecimal holdingsValue, BigDecimal totalValue, BigDecimal profit,
                                       BigDecimal profitPercent, List<AgentHoldingResponse> positions,
                                       List<EquityPointResponse> equityCurve) {}
