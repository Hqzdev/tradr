package dev.tradr.backend.agents.web.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record EquityPointResponse(BigDecimal totalValue, Instant capturedAt) {}
