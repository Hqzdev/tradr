package dev.tradr.backend.dashboard.web.dto;

import dev.tradr.backend.agents.web.dto.AgentResponse;
import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(BigDecimal startingCapital, BigDecimal totalWealth, BigDecimal reserveCash,
                                BigDecimal allocatedCapital, BigDecimal profit, BigDecimal profitPercent,
                                BigDecimal goalValue, BigDecimal goalProgress, boolean accelerationEnabled,
                                List<AgentResponse> agents, List<DashboardActivityResponse> activity) {}
