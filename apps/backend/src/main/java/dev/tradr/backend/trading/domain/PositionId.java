package dev.tradr.backend.trading.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
public class PositionId implements Serializable {

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "instrument_id", nullable = false)
    private UUID instrumentId;

    protected PositionId() {
    }

    public PositionId(UUID accountId, UUID instrumentId) {
        this.accountId = accountId;
        this.instrumentId = instrumentId;
    }

    public UUID getAccountId() { return accountId; }
    public UUID getInstrumentId() { return instrumentId; }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof PositionId that)) return false;
        return accountId.equals(that.accountId) && instrumentId.equals(that.instrumentId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(accountId, instrumentId);
    }
}
