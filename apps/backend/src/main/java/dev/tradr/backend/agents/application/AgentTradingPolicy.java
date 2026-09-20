package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.AgentStrategy;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class AgentTradingPolicy {
    public Policy forStrategy(AgentStrategy strategy) {
        return switch (strategy) {
            case CAREFUL -> new Policy(4, new BigDecimal("0.20"), new BigDecimal("2.00"), new BigDecimal("-1.00"));
            case AGGRESSIVE -> new Policy(5, new BigDecimal("0.17"), new BigDecimal("4.00"), new BigDecimal("-3.00"));
            case RANDOM -> new Policy(4, new BigDecimal("0.20"), new BigDecimal("3.00"), new BigDecimal("-2.00"));
        };
    }

    public BigDecimal orderBudget(Policy policy, BigDecimal freeCash, BigDecimal holdingsValue) {
        BigDecimal target = freeCash.add(holdingsValue).multiply(policy.positionShare());
        return target.min(freeCash).setScale(2, RoundingMode.DOWN);
    }

    public boolean shouldBuy(AgentStrategy strategy, BigDecimal marketChange, String ticker, long step) {
        return switch (strategy) {
            case CAREFUL -> marketChange.compareTo(new BigDecimal("-0.80")) <= 0
                    || Math.floorMod(step + ticker.hashCode(), 19) == 0;
            case AGGRESSIVE -> marketChange.compareTo(new BigDecimal("0.80")) >= 0
                    || Math.floorMod(step + ticker.hashCode(), 13) == 0;
            case RANDOM -> Math.floorMod(step + ticker.hashCode(), 31) == 0;
        };
    }

    public record Policy(int maxPositions, BigDecimal positionShare, BigDecimal takeProfit, BigDecimal stopLoss) {}
}
