package dev.tradr.backend.market.application;

import dev.tradr.backend.market.domain.Instrument;

import java.math.BigDecimal;
import java.time.Instant;

public record QuoteSnapshot(
        Instrument instrument,
        BigDecimal price,
        BigDecimal changePercent,
        long volume,
        Instant timestamp
) {
}
