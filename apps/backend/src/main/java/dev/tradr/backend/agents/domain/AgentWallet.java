package dev.tradr.backend.agents.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

@Entity
@Table(name = "agent_wallets")
public class AgentWallet {
    @Id
    @Column(name = "agent_id")
    private UUID agentId;

    @Column(name = "initial_cash", nullable = false)
    private BigDecimal initialCash;

    @Column(name = "cash_balance", nullable = false)
    private BigDecimal cashBalance;

    @Column(nullable = false, length = 3)
    private String currency;

    protected AgentWallet() {}

    public AgentWallet(UUID agentId, BigDecimal allocation, String currency) {
        this.agentId = agentId;
        this.initialCash = money(allocation);
        this.cashBalance = money(allocation);
        this.currency = currency;
    }

    public void debit(BigDecimal amount) {
        if (cashBalance.compareTo(amount) < 0) throw new IllegalArgumentException("Agent wallet has insufficient funds");
        cashBalance = money(cashBalance.subtract(amount));
    }

    public void credit(BigDecimal amount) { cashBalance = money(cashBalance.add(amount)); }

    public void increaseAllocation(BigDecimal amount) {
        initialCash = money(initialCash.add(amount));
        credit(amount);
    }

    public void decreaseAllocation(BigDecimal amount) {
        if (cashBalance.compareTo(amount) < 0) throw new IllegalArgumentException("Only free cash can be returned");
        initialCash = money(initialCash.subtract(amount));
        debit(amount);
    }

    public BigDecimal drain() {
        BigDecimal amount = cashBalance;
        cashBalance = BigDecimal.ZERO.setScale(2);
        return amount;
    }

    public UUID getAgentId() { return agentId; }
    public BigDecimal getInitialCash() { return initialCash; }
    public BigDecimal getCashBalance() { return cashBalance; }
    public String getCurrency() { return currency; }

    private BigDecimal money(BigDecimal value) { return value.setScale(2, RoundingMode.HALF_UP); }
}
