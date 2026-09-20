package dev.tradr.backend.agents.domain;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class AgentWalletTest {
    @Test void buyAndSellAmountsStayInsideTheAgentWallet() {
        AgentWallet wallet = new AgentWallet(UUID.randomUUID(), new BigDecimal("25000"), "USD");
        wallet.debit(new BigDecimal("5005"));
        wallet.credit(new BigDecimal("5100"));
        assertEquals(new BigDecimal("25095.00"), wallet.getCashBalance());
        assertEquals(new BigDecimal("25000.00"), wallet.getInitialCash());
    }

    @Test void allocationCanOnlyReturnFreeCash() {
        AgentWallet wallet = new AgentWallet(UUID.randomUUID(), new BigDecimal("10000"), "USD");
        wallet.debit(new BigDecimal("9000"));
        assertThrows(IllegalArgumentException.class, () -> wallet.decreaseAllocation(new BigDecimal("2000")));
        assertEquals(new BigDecimal("10000.00"), wallet.getInitialCash());
    }

    @Test void closingDrainsCashButPreservesPerformanceBaseline() {
        AgentWallet wallet = new AgentWallet(UUID.randomUUID(), new BigDecimal("5000"), "USD");
        wallet.credit(new BigDecimal("125"));
        assertEquals(new BigDecimal("5125.00"), wallet.drain());
        assertEquals(new BigDecimal("0.00"), wallet.getCashBalance());
        assertEquals(new BigDecimal("5000.00"), wallet.getInitialCash());
    }
}
