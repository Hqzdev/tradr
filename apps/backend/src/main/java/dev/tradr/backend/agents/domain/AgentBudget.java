package dev.tradr.backend.agents.domain;

import java.math.BigDecimal;
import java.util.Objects;

public record AgentBudget(BigDecimal limit, String currency) {

    public static final BigDecimal DEFAULT_LIMIT = new BigDecimal("75000.00");
    public static final BigDecimal MINIMUM_LIMIT = new BigDecimal("1000.00");
    public static final BigDecimal MAXIMUM_LIMIT = new BigDecimal("100000.00");
    public static final String DEFAULT_CURRENCY = "USD";

    public AgentBudget {
        Objects.requireNonNull(limit, "limit");
        Objects.requireNonNull(currency, "currency");
        if (limit.compareTo(MINIMUM_LIMIT) < 0 || limit.compareTo(MAXIMUM_LIMIT) > 0) {
            throw new IllegalArgumentException("budgetLimit must be between 1000 and 100000");
        }
        if (!DEFAULT_CURRENCY.equals(currency)) {
            throw new IllegalArgumentException("budget currency must be USD");
        }
        limit = limit.setScale(2);
    }

    public static AgentBudget fromNullable(BigDecimal limit) {
        return new AgentBudget(limit == null ? DEFAULT_LIMIT : limit, DEFAULT_CURRENCY);
    }
}
