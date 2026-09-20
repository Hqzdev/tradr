package dev.tradr.backend.agents.application;

import dev.tradr.backend.agents.domain.*;
import dev.tradr.backend.agents.exception.AgentAllocationException;
import dev.tradr.backend.agents.repository.*;
import dev.tradr.backend.agents.web.dto.*;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.application.QuoteSnapshot;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.trading.application.TradingService;
import dev.tradr.backend.trading.domain.OrderSide;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.util.*;

@Service
public class AgentService {
    private static final long COOLDOWN_STEPS = 10;
    private static final long MAX_HOLDING_STEPS = 390;
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private final AgentRepository agents;
    private final AgentConfigRepository configs;
    private final AgentDecisionLogRepository logs;
    private final AgentWalletRepository wallets;
    private final AgentPositionRepository positions;
    private final AgentMarketStateRepository marketStates;
    private final AgentEquityPointRepository equityPoints;
    private final AccountRepository accounts;
    private final MarketService market;
    private final TradingService trading;
    private final AgentProvisioner provisioner;
    private final AgentTradingPolicy policies;

    public AgentService(AgentRepository agents, AgentConfigRepository configs, AgentDecisionLogRepository logs,
                        AgentWalletRepository wallets, AgentPositionRepository positions,
                        AgentMarketStateRepository marketStates, AgentEquityPointRepository equityPoints,
                        AccountRepository accounts, MarketService market, TradingService trading,
                        AgentProvisioner provisioner, AgentTradingPolicy policies) {
        this.agents = agents;
        this.configs = configs;
        this.logs = logs;
        this.wallets = wallets;
        this.positions = positions;
        this.marketStates = marketStates;
        this.equityPoints = equityPoints;
        this.accounts = accounts;
        this.market = market;
        this.trading = trading;
        this.provisioner = provisioner;
        this.policies = policies;
    }

    @Transactional
    public AgentResponse create(UUID userId, CreateAgentRequest request) {
        return response(provisioner.provision(account(userId).getId(), request));
    }

    @Transactional(readOnly = true)
    public List<AgentResponse> list(UUID userId) {
        return agents.findByAccountIdOrderByCreatedAtDesc(account(userId).getId()).stream()
                .filter(agent -> agent.getStatus() != AgentStatus.ARCHIVED).map(this::response).toList();
    }

    @Transactional(readOnly = true)
    public AgentResponse get(UUID userId, UUID id) { return response(owned(userId, id)); }

    @Transactional
    public AgentResponse start(UUID userId, UUID id) {
        Agent agent = owned(userId, id);
        if (agent.getStatus() == AgentStatus.ARCHIVED) throw new AgentAllocationException("Архивного агента нельзя запустить");
        agent.setStatus(AgentStatus.ACTIVE);
        logs.save(new AgentDecisionLog(id, AgentAction.WAIT, "Агент запущен и начал анализировать рынок", "[]", null));
        return response(agent);
    }

    @Transactional
    public AgentResponse pause(UUID userId, UUID id) {
        Agent agent = owned(userId, id);
        agent.setStatus(AgentStatus.PAUSED);
        logs.save(new AgentDecisionLog(id, AgentAction.WAIT, "Агент поставлен на паузу. Позиции сохранены", "[]", null));
        return response(agent);
    }

    @Transactional
    public AgentResponse status(UUID userId, UUID id, String status) {
        return "active".equalsIgnoreCase(status) ? start(userId, id) : pause(userId, id);
    }

    @Transactional
    public AgentResponse allocation(UUID userId, UUID id, BigDecimal target) {
        Agent agent = owned(userId, id);
        if (agent.getStatus() != AgentStatus.PAUSED) throw new AgentAllocationException("Сначала поставьте агента на паузу");
        AgentWallet wallet = wallet(id);
        Account account = account(userId);
        BigDecimal delta = target.setScale(2).subtract(wallet.getInitialCash());
        if (delta.signum() > 0) {
            if (account.getBalance().compareTo(delta) < 0) throw new AgentAllocationException("Недостаточно денег в резерве");
            account.debit(delta);
            wallet.increaseAllocation(delta);
        } else if (delta.signum() < 0) {
            BigDecimal refund = delta.abs();
            try { wallet.decreaseAllocation(refund); }
            catch (IllegalArgumentException exception) { throw new AgentAllocationException("Нельзя вернуть деньги, вложенные в открытые позиции"); }
            account.credit(refund);
        }
        snapshot(agent);
        return response(agent);
    }

    @Transactional
    public void close(UUID userId, UUID id) {
        Agent agent = owned(userId, id);
        agent.setStatus(AgentStatus.PAUSED);
        for (AgentPosition position : List.copyOf(positions.findByIdAgentId(id))) {
            Instrument instrument = instrument(position.getId().getInstrumentId());
            QuoteSnapshot quote = market.quote(instrument);
            UUID orderId = trading.executeAgentOrder(agent.getAccountId(), id, instrument, OrderSide.SELL, position.getQuantity(), quote, Long.MAX_VALUE);
            logs.save(new AgentDecisionLog(id, AgentAction.SELL, "Позиция " + instrument.getTicker() + " закрыта при закрытии агента", "[]", orderId));
        }
        Account account = account(userId);
        account.credit(wallet(id).drain());
        agent.setStatus(AgentStatus.ARCHIVED);
    }

    @Transactional
    public void delete(UUID userId, UUID id) { close(userId, id); }

    @Transactional(readOnly = true)
    public Object config(UUID userId, UUID id, String field) {
        owned(userId, id);
        AgentConfig config = configs.findById(id).orElseThrow();
        return switch (field) {
            case "character" -> config.getCharacter();
            case "budget" -> config.getBudget();
            case "skills" -> config.getSkills();
            default -> throw new IllegalArgumentException("Unknown config field");
        };
    }

    @Transactional(readOnly = true)
    public List<DecisionResponse> log(UUID userId, UUID id, int limit) {
        owned(userId, id);
        return logs.findByAgentIdOrderByTimestampDesc(id, PageRequest.of(0, limit)).stream().map(this::decision).toList();
    }

    @Transactional(readOnly = true)
    public AgentPerformanceResponse performance(UUID userId, UUID id) {
        Agent agent = owned(userId, id);
        AgentWallet wallet = wallet(id);
        List<AgentHoldingResponse> holdings = positions.findByIdAgentId(id).stream().map(this::holding).toList();
        BigDecimal holdingsValue = holdings.stream().map(AgentHoldingResponse::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal total = wallet.getCashBalance().add(holdingsValue).setScale(2);
        BigDecimal profit = total.subtract(wallet.getInitialCash()).setScale(2);
        BigDecimal percent = percentage(profit, wallet.getInitialCash());
        List<EquityPointResponse> curve = equityPoints.findByAgentIdOrderByCapturedAtDesc(id, PageRequest.of(0, 100)).stream()
                .map(point -> new EquityPointResponse(point.getTotalValue(), point.getCapturedAt())).toList();
        return new AgentPerformanceResponse(agent.getId(), wallet.getInitialCash(), wallet.getCashBalance(), holdingsValue,
                total, profit, percent, holdings, curve);
    }

    @Transactional
    public void onTick(Instrument instrument, QuoteSnapshot quote, long step, boolean normalCycle) {
        for (Agent agent : agents.findByStatus(AgentStatus.ACTIVE)) {
            Account account = accounts.findById(agent.getAccountId()).orElse(null);
            if (account == null || (!account.isAccelerationEnabled() && !normalCycle)) continue;
            evaluate(agent, instrument, quote, step);
        }
    }

    private void evaluate(Agent agent, Instrument instrument, QuoteSnapshot quote, long step) {
        AgentTradingPolicy.Policy policy = policies.forStrategy(agent.getStrategy());
        AgentPositionId key = new AgentPositionId(agent.getId(), instrument.getId());
        Optional<AgentPosition> existing = positions.findById(key);
        if (existing.isPresent()) {
            AgentPosition position = existing.get();
            BigDecimal returnPercent = quote.price().subtract(position.getAveragePrice())
                    .divide(position.getAveragePrice(), 6, RoundingMode.HALF_UP).multiply(ONE_HUNDRED);
            boolean timedOut = step - position.getOpenedStep() >= MAX_HOLDING_STEPS;
            if (returnPercent.compareTo(policy.takeProfit()) >= 0 || returnPercent.compareTo(policy.stopLoss()) <= 0 || timedOut) {
                sell(agent, instrument, quote, position, step, returnPercent, timedOut);
            }
            return;
        }
        AgentMarketState state = marketStates.findById(key).orElse(null);
        long sinceLastTrade = state == null ? Long.MAX_VALUE : step - state.getLastTradeStep();
        if (sinceLastTrade >= 0 && sinceLastTrade < COOLDOWN_STEPS) return;
        if (positions.countByIdAgentId(agent.getId()) >= policy.maxPositions()) return;
        if (!policies.shouldBuy(agent.getStrategy(), quote.changePercent(), instrument.getTicker(), step)) {
            if ("AAPL".equals(instrument.getTicker()) && step % 10 == 0) {
                logs.save(new AgentDecisionLog(agent.getId(), AgentAction.WAIT, "Анализирует рынок и ждёт подходящий момент", "[]", null));
            }
            return;
        }
        AgentWallet wallet = wallet(agent.getId());
        BigDecimal holdingsValue = positions.findByIdAgentId(agent.getId()).stream()
                .map(this::marketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal amount = policies.orderBudget(policy, wallet.getCashBalance(), holdingsValue);
        BigDecimal quantity = amount.divide(quote.price().multiply(new BigDecimal("1.001")), 8, RoundingMode.DOWN);
        if (quantity.multiply(quote.price()).compareTo(BigDecimal.ONE) < 0) return;
        try {
            UUID orderId = trading.executeAgentOrder(agent.getAccountId(), agent.getId(), instrument, OrderSide.BUY, quantity, quote, step);
            tradedAt(key, step);
            logs.save(new AgentDecisionLog(agent.getId(), AgentAction.BUY,
                    "Купил " + instrument.getTicker() + ": стратегия увидела подходящую цену", "[]", orderId));
            snapshot(agent);
        } catch (RuntimeException ignored) {
            logs.save(new AgentDecisionLog(agent.getId(), AgentAction.WAIT, "Пропустил сделку: свободных денег недостаточно", "[]", null));
        }
    }

    private void sell(Agent agent, Instrument instrument, QuoteSnapshot quote, AgentPosition position, long step,
                      BigDecimal returnPercent, boolean timedOut) {
        UUID orderId = trading.executeAgentOrder(agent.getAccountId(), agent.getId(), instrument, OrderSide.SELL, position.getQuantity(), quote, step);
        tradedAt(position.getId(), step);
        String cause = timedOut ? "истёк торговый день" : returnPercent.signum() >= 0 ? "достигнута цель прибыли" : "сработало ограничение убытка";
        logs.save(new AgentDecisionLog(agent.getId(), AgentAction.SELL,
                "Продал " + instrument.getTicker() + ": " + cause, "[]", orderId));
        snapshot(agent);
    }

    private void tradedAt(AgentPositionId key, long step) {
        AgentMarketState state = marketStates.findById(key).orElse(new AgentMarketState(key.getAgentId(), key.getInstrumentId(), step));
        state.tradedAt(step);
        marketStates.save(state);
    }

    private void snapshot(Agent agent) {
        AgentWallet wallet = wallet(agent.getId());
        BigDecimal holdings = positions.findByIdAgentId(agent.getId()).stream().map(this::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add);
        equityPoints.save(new AgentEquityPoint(agent.getId(), wallet.getCashBalance(), holdings));
    }

    private AgentResponse response(Agent agent) {
        AgentWallet wallet = wallet(agent.getId());
        BigDecimal holdings = positions.findByIdAgentId(agent.getId()).stream().map(this::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal total = wallet.getCashBalance().add(holdings).setScale(2);
        return new AgentResponse(agent.getId(), agent.getName(), agent.getStrategy().name().toLowerCase(Locale.ROOT),
                agent.getStatus().name().toLowerCase(Locale.ROOT), agent.getRiskLevel(), agent.getTriggerPercent(),
                wallet.getInitialCash(), wallet.getCashBalance(), holdings, total, total.subtract(wallet.getInitialCash()).setScale(2),
                positions.findByIdAgentId(agent.getId()).size(), agent.getCreatedAt());
    }

    private AgentHoldingResponse holding(AgentPosition position) {
        Instrument instrument = instrument(position.getId().getInstrumentId());
        BigDecimal current = market.quote(instrument).price().setScale(2, RoundingMode.HALF_UP);
        BigDecimal value = current.multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cost = position.getAveragePrice().multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal profit = value.subtract(cost).setScale(2);
        return new AgentHoldingResponse(instrument.getTicker(), instrument.getName(), position.getQuantity(), position.getAveragePrice(), current,
                value, profit, percentage(profit, cost));
    }

    private BigDecimal marketValue(AgentPosition position) { return market.quote(instrument(position.getId().getInstrumentId())).price().multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP); }
    private BigDecimal percentage(BigDecimal value, BigDecimal base) { return base.signum() == 0 ? BigDecimal.ZERO : value.divide(base, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2); }
    private AgentWallet wallet(UUID id) { return wallets.findById(id).orElseThrow(() -> new IllegalStateException("Agent wallet not found")); }
    private Account account(UUID userId) { return accounts.findByUserId(userId).orElseThrow(() -> new IllegalStateException("Account not found")); }
    private Agent owned(UUID userId, UUID id) { return agents.findByIdAndAccountId(id, account(userId).getId()).orElseThrow(); }
    private Instrument instrument(UUID id) { return market.instruments().stream().filter(item -> item.getId().equals(id)).findFirst().orElseThrow(); }
    private DecisionResponse decision(AgentDecisionLog log) { return new DecisionResponse(log.getId(), log.getAgentId(), log.getAction().name().toLowerCase(Locale.ROOT), log.getReason(), log.getRules(), log.getRelatedOrderId(), log.getTimestamp()); }
}
