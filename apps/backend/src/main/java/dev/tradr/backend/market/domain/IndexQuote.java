package dev.tradr.backend.market.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "index_quotes")
public class IndexQuote {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "display_value", nullable = false)
    private String displayValue;

    @Column(name = "change_percent", nullable = false)
    private BigDecimal changePercent;

    @Column(name = "sort_order", nullable = false, unique = true)
    private short sortOrder;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected IndexQuote() {
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDisplayValue() {
        return displayValue;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    public short getSortOrder() {
        return sortOrder;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
