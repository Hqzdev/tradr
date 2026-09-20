package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.AgentStrategy;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class AgentTradingPolicyTest {
    private final AgentTradingPolicy policy = new AgentTradingPolicy();

    @Test void carefulUsesConservativeLimitsAndBuysDips() {
        var rules = policy.forStrategy(AgentStrategy.CAREFUL);
        assertEquals(4, rules.maxPositions());
        assertEquals(new BigDecimal("0.20"), rules.positionShare());
        assertTrue(policy.shouldBuy(AgentStrategy.CAREFUL, new BigDecimal("-0.81"), "AAPL", 1));
        assertFalse(policy.shouldBuy(AgentStrategy.CAREFUL, new BigDecimal("0.40"), "AAPL", 1));
    }

    @Test void aggressiveUsesLargerAllocationAndMomentum() {
        var rules = policy.forStrategy(AgentStrategy.AGGRESSIVE);
        assertEquals(5, rules.maxPositions());
        assertEquals(new BigDecimal("0.17"), rules.positionShare());
        assertEquals(new BigDecimal("4.00"), rules.takeProfit());
        assertEquals(new BigDecimal("-3.00"), rules.stopLoss());
        assertTrue(policy.shouldBuy(AgentStrategy.AGGRESSIVE, new BigDecimal("0.81"), "NVDA", 1));
    }

    @Test void randomChoiceIsDeterministic() {
        boolean first = policy.shouldBuy(AgentStrategy.RANDOM, BigDecimal.ZERO, "TSLA", 42);
        assertEquals(first, policy.shouldBuy(AgentStrategy.RANDOM, BigDecimal.ZERO, "TSLA", 42));
    }

    @Test void positionBudgetUsesTotalWalletValueInsteadOfShrinkingCash() {
        var rules = policy.forStrategy(AgentStrategy.CAREFUL);
        assertEquals(new BigDecimal("15000.00"), policy.orderBudget(
                rules, new BigDecimal("45000"), new BigDecimal("30000")));
        assertEquals(new BigDecimal("5000.00"), policy.orderBudget(
                rules, new BigDecimal("5000"), new BigDecimal("70000")));
    }
}
