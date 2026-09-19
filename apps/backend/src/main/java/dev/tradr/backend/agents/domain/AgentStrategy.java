package dev.tradr.backend.agents.domain;

import java.math.BigDecimal;
import java.util.List;

public enum AgentStrategy {
    AGGRESSIVE(new StrategyProfile("Агрессивный", new BigDecimal("-5.00"), new BigDecimal("3.00"), List.of(new BigDecimal("-5.00"), new BigDecimal("-4.00"), new BigDecimal("-3.00"), new BigDecimal("-2.00"), new BigDecimal("-1.00"), new BigDecimal("1.00"), new BigDecimal("2.00"), new BigDecimal("3.00")))),
    CAREFUL(new StrategyProfile("Осторожный", new BigDecimal("-2.00"), new BigDecimal("2.00"), List.of(new BigDecimal("-2.00"), new BigDecimal("-1.00"), new BigDecimal("1.00"), new BigDecimal("2.00")))),
    RANDOM(new StrategyProfile("Случайный", new BigDecimal("-8.00"), new BigDecimal("8.00"), List.of(new BigDecimal("-8.00"), new BigDecimal("-7.00"), new BigDecimal("-6.00"), new BigDecimal("-5.00"), new BigDecimal("-4.00"), new BigDecimal("-3.00"), new BigDecimal("-2.00"), new BigDecimal("-1.00"), new BigDecimal("1.00"), new BigDecimal("2.00"), new BigDecimal("3.00"), new BigDecimal("4.00"), new BigDecimal("5.00"), new BigDecimal("6.00"), new BigDecimal("7.00"), new BigDecimal("8.00"))));

    private final StrategyProfile profile;

    AgentStrategy(StrategyProfile profile) {
        this.profile = profile;
    }

    public StrategyProfile profile() {
        return profile;
    }
}
