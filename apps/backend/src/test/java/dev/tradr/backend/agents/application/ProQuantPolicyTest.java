package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.AgentStrategy;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProQuantPolicyTest {
    private final AgentTradingPolicy policies = new AgentTradingPolicy();

    @Test void entersModerateDipsButRejectsCrashesAndPositivePrices() {
        assertTrue(policies.shouldBuy(AgentStrategy.PRO_QUANT, new BigDecimal("-1.20"), "AAPL", 10));
        assertTrue(policies.shouldBuy(AgentStrategy.PRO_QUANT, new BigDecimal("-3.00"), "AAPL", 10));
        assertFalse(policies.shouldBuy(AgentStrategy.PRO_QUANT, new BigDecimal("-3.01"), "AAPL", 10));
        assertFalse(policies.shouldBuy(AgentStrategy.PRO_QUANT, new BigDecimal("0.80"), "AAPL", 10));
    }

    @Test void protectsCashReserveAndLimitsPositionSize() {
        var policy = policies.forStrategy(AgentStrategy.PRO_QUANT);
        assertEquals(new BigDecimal("12000.00"), policies.orderBudget(policy, new BigDecimal("100000"), BigDecimal.ZERO));
        assertEquals(new BigDecimal("5000.00"), policies.orderBudget(policy, new BigDecimal("25000"), new BigDecimal("75000")));
        assertEquals(new BigDecimal("0.00"), policies.orderBudget(policy, new BigDecimal("15000"), new BigDecimal("85000")));
    }

    @Test void usesRequestedProfitAndLossExitThresholds() {
        var policy = policies.forStrategy(AgentStrategy.PRO_QUANT);
        assertEquals(new BigDecimal("100.00"), policy.takeProfit());
        assertEquals(new BigDecimal("-40.00"), policy.stopLoss());
    }
}
