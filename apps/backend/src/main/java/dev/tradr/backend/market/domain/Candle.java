package dev.tradr.backend.market.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "candles")
public class Candle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instrument_id", nullable = false)
    private UUID instrumentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Timeframe timeframe;

    @Column(name = "bucket_start", nullable = false)
    private Instant bucketStart;

    @Column(nullable = false)
    private BigDecimal open;

    @Column(nullable = false)
    private BigDecimal high;

    @Column(nullable = false)
    private BigDecimal low;

    @Column(nullable = false)
    private BigDecimal close;

    @Column(nullable = false)
    private long volume;

    protected Candle() {
    }

    public Candle(UUID instrumentId, Timeframe timeframe, Instant bucketStart, BigDecimal open, BigDecimal high, BigDecimal low, BigDecimal close, long volume) {
        this.instrumentId = instrumentId;
        this.timeframe = timeframe;
        this.bucketStart = bucketStart;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }

    public void incorporateTick(BigDecimal price, long additionalVolume) {
        high = high.max(price);
        low = low.min(price);
        close = price;
        volume += additionalVolume;
    }

    public Long getId() {
        return id;
    }

    public UUID getInstrumentId() {
        return instrumentId;
    }

    public Timeframe getTimeframe() {
        return timeframe;
    }

    public Instant getBucketStart() {
        return bucketStart;
    }

    public BigDecimal getOpen() {
        return open;
    }

    public BigDecimal getHigh() {
        return high;
    }

    public BigDecimal getLow() {
        return low;
    }

    public BigDecimal getClose() {
        return close;
    }

    public long getVolume() {
        return volume;
    }
}
