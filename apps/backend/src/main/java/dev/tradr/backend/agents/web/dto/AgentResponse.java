package dev.tradr.backend.agents.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AgentResponse(UUID id, String name, String strategy, String status, String riskLevel,
                            BigDecimal triggerPercent, BigDecimal budgetLimit, BigDecimal cashBalance,
                            BigDecimal holdingsValue, BigDecimal totalValue, BigDecimal profit,
                            int positionCount, Instant createdAt) {
}
