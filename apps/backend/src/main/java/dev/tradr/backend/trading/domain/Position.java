package dev.tradr.backend.trading.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "positions")
public class Position {

    @EmbeddedId
    private PositionId id;

    @Column(nullable = false, precision = 18, scale = 8)
    private BigDecimal quantity;

    @Column(name = "avg_price", nullable = false, precision = 18, scale = 4)
    private BigDecimal averagePrice;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Position() {
    }

    public Position(UUID accountId, UUID instrumentId, BigDecimal quantity, BigDecimal averagePrice) {
        this.id = new PositionId(accountId, instrumentId);
        this.quantity = quantity;
        this.averagePrice = averagePrice;
    }

    public void buy(BigDecimal addedQuantity, BigDecimal price) {
        BigDecimal totalQuantity = quantity.add(addedQuantity);
        averagePrice = averagePrice.multiply(quantity)
                .add(price.multiply(addedQuantity))
                .divide(totalQuantity, 4, RoundingMode.HALF_UP);
        quantity = totalQuantity;
        updatedAt = Instant.now();
    }

    public void sell(BigDecimal soldQuantity) {
        quantity = quantity.subtract(soldQuantity);
        updatedAt = Instant.now();
    }

    public PositionId getId() { return id; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public Instant getUpdatedAt() { return updatedAt; }
}
