package dev.tradr.backend.dashboard.application;

import dev.tradr.backend.auth.domain.Account;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public final class AccountProgression {
    private static final BigDecimal REWARD_RATE = new BigDecimal("0.01");
    private static final List<BigDecimal> MILESTONES = List.of(
            new BigDecimal("100000"), new BigDecimal("110000"), new BigDecimal("120000"),
            new BigDecimal("150000"), new BigDecimal("200000"), new BigDecimal("300000"),
            new BigDecimal("500000"), new BigDecimal("1000000"), new BigDecimal("2000000"),
            new BigDecimal("5000000"), new BigDecimal("10000000"), new BigDecimal("20000000"),
            new BigDecimal("50000000"), new BigDecimal("100000000")
    );

    public void advanceFor(Account account, BigDecimal totalWealth) {
        BigDecimal wealth = totalWealth;

        while (wealth.compareTo(account.getGoalValue()) >= 0) {
            BigDecimal reachedMilestone = account.getGoalValue();
            BigDecimal reward = reachedMilestone.multiply(REWARD_RATE)
                    .setScale(2, RoundingMode.HALF_UP);

            account.credit(reward);
            account.advanceLevel(milestone(account.getLevel() + 2));
            wealth = wealth.add(reward);
        }
    }

    public BigDecimal nextLevelReward(Account account) {
        return account.getGoalValue().multiply(REWARD_RATE).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal previousMilestone(Account account) {
        return milestone(account.getLevel());
    }

    private BigDecimal milestone(int level) {
        if (level <= MILESTONES.size()) return MILESTONES.get(level - 1);
        return MILESTONES.getLast().multiply(BigDecimal.valueOf(2).pow(level - MILESTONES.size()));
    }
}
