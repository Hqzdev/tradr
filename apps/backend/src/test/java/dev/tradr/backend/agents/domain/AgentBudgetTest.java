package dev.tradr.backend.agents.domain;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AgentBudgetTest {

    @Test
    void acceptsInclusiveLimitsAndNormalizesScale() {
        assertEquals(new BigDecimal("1000.00"), new AgentBudget(new BigDecimal("1000"), "USD").limit());
        assertEquals(new BigDecimal("100000.00"), new AgentBudget(new BigDecimal("100000"), "USD").limit());
    }

    @Test
    void rejectsLimitsOutsideEducationalAccount() {
        assertThrows(IllegalArgumentException.class, () -> new AgentBudget(new BigDecimal("999.99"), "USD"));
        assertThrows(IllegalArgumentException.class, () -> new AgentBudget(new BigDecimal("100000.01"), "USD"));
    }

    @Test
    void usesBackwardCompatibleDefault() {
        assertEquals(new BigDecimal("75000.00"), AgentBudget.fromNullable(null).limit());
    }
}
