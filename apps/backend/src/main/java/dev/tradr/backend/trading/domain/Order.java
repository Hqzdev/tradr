package dev.tradr.backend.trading.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "instrument_id", nullable = false)
    private UUID instrumentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSide side;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", nullable = false)
    private OrderType orderType;

    @Column(nullable = false, precision = 18, scale = 8)
    private BigDecimal quantity;

    @Column(name = "limit_price", precision = 18, scale = 4)
    private BigDecimal limitPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderSource source;

    @Column(name = "source_agent_id")
    private UUID sourceAgentId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "filled_at")
    private Instant filledAt;

    protected Order() {
    }

    public Order(UUID accountId, UUID instrumentId, OrderSide side, OrderType orderType, BigDecimal quantity, BigDecimal limitPrice) {
        this.accountId = accountId;
        this.instrumentId = instrumentId;
        this.side = side;
        this.orderType = orderType;
        this.quantity = quantity;
        this.limitPrice = limitPrice;
        this.status = OrderStatus.OPEN;
        this.source = OrderSource.MANUAL;
    }

    public static Order forAgent(UUID accountId, UUID instrumentId, UUID agentId, OrderSide side, BigDecimal quantity) {
        Order order = new Order(accountId, instrumentId, side, OrderType.MARKET, quantity, null);
        order.source = OrderSource.AGENT;
        order.sourceAgentId = agentId;
        return order;
    }

    public void fill() {
        status = OrderStatus.FILLED;
        filledAt = Instant.now();
    }

    public void cancel() {
        status = OrderStatus.CANCELLED;
    }

    public UUID getId() { return id; }
    public UUID getAccountId() { return accountId; }
    public UUID getInstrumentId() { return instrumentId; }
    public OrderSide getSide() { return side; }
    public OrderType getOrderType() { return orderType; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getLimitPrice() { return limitPrice; }
    public OrderStatus getStatus() { return status; }
    public OrderSource getSource() { return source; }
    public UUID getSourceAgentId() { return sourceAgentId; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getFilledAt() { return filledAt; }
}
