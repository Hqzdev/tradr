package dev.tradr.backend.agents.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "agent_equity_points")
public class AgentEquityPoint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "agent_id", nullable = false) private java.util.UUID agentId;
    @Column(name = "cash_value", nullable = false) private BigDecimal cashValue;
    @Column(name = "holdings_value", nullable = false) private BigDecimal holdingsValue;
    @Column(name = "total_value", nullable = false) private BigDecimal totalValue;
    @Column(name = "captured_at", nullable = false) private Instant capturedAt = Instant.now();
    protected AgentEquityPoint() {}
    public AgentEquityPoint(java.util.UUID agentId, BigDecimal cashValue, BigDecimal holdingsValue) { this.agentId = agentId; this.cashValue = cashValue; this.holdingsValue = holdingsValue; this.totalValue = cashValue.add(holdingsValue); }
    public java.util.UUID getAgentId() { return agentId; }
    public BigDecimal getCashValue() { return cashValue; }
    public BigDecimal getHoldingsValue() { return holdingsValue; }
    public BigDecimal getTotalValue() { return totalValue; }
    public Instant getCapturedAt() { return capturedAt; }
}
