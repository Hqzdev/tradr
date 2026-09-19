package dev.tradr.backend.agents.domain;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

public record StrategyProfile(String name, BigDecimal minimumChange, BigDecimal maximumChange, List<BigDecimal> signals) {
    public BigDecimal randomSignal() {
        return signals.get(ThreadLocalRandom.current().nextInt(signals.size()));
    }

    public boolean matches(BigDecimal changePercent, BigDecimal signal) {
        return signal.signum() < 0
                ? changePercent.compareTo(signal) <= 0
                : changePercent.compareTo(signal) >= 0;
    }

    public String rangeLabel() {
        return minimumChange.stripTrailingZeros().toPlainString() + "% ... +" + maximumChange.stripTrailingZeros().toPlainString() + "%";
    }
}
