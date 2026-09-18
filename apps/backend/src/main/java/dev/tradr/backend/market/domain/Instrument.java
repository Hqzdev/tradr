package dev.tradr.backend.market.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "instruments")
public class Instrument {

    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String ticker;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String exchange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstrumentType type;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    protected Instrument() {
    }

    public Instrument(UUID id, String ticker, String name, String exchange, InstrumentType type, String currency, BigDecimal basePrice) {
        this.id = id;
        this.ticker = ticker;
        this.name = name;
        this.exchange = exchange;
        this.type = type;
        this.currency = currency;
        this.basePrice = basePrice;
    }

    public UUID getId() {
        return id;
    }

    public String getTicker() {
        return ticker;
    }

    public String getName() {
        return name;
    }

    public String getExchange() {
        return exchange;
    }

    public InstrumentType getType() {
        return type;
    }

    public String getCurrency() {
        return currency;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }
}
