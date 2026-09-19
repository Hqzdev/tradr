package dev.tradr.backend.agents.domain;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class StrategyProfileTest {

    @Test
    void aggressiveProfileMatchesPositiveAndNegativeSignals() {
        StrategyProfile profile = AgentStrategy.AGGRESSIVE.profile();

        assertTrue(profile.matches(new BigDecimal("-5.00"), new BigDecimal("-5.00")));
        assertTrue(profile.matches(new BigDecimal("3.10"), new BigDecimal("3.00")));
        assertFalse(profile.matches(new BigDecimal("-4.99"), new BigDecimal("-5.00")));
        assertFalse(profile.matches(new BigDecimal("2.99"), new BigDecimal("3.00")));
    }
}
