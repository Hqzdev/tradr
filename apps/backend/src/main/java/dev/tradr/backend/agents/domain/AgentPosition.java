package dev.tradr.backend.agents.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "agent_positions")
public class AgentPosition {
    @EmbeddedId private AgentPositionId id;
    @Column(nullable = false, precision = 18, scale = 8) private BigDecimal quantity;
    @Column(name = "avg_price", nullable = false, precision = 18, scale = 4) private BigDecimal averagePrice;
    @Column(name = "opened_step", nullable = false) private long openedStep;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt = Instant.now();

    protected AgentPosition() {}
    public AgentPosition(UUID agentId, UUID instrumentId, BigDecimal quantity, BigDecimal averagePrice, long openedStep) {
        this.id = new AgentPositionId(agentId, instrumentId);
        this.quantity = quantity.setScale(8, RoundingMode.HALF_UP);
        this.averagePrice = averagePrice.setScale(4, RoundingMode.HALF_UP);
        this.openedStep = openedStep;
    }
    public AgentPositionId getId() { return id; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public long getOpenedStep() { return openedStep; }
    public Instant getUpdatedAt() { return updatedAt; }
}
