package dev.tradr.backend.trading.application;

import dev.tradr.backend.agents.domain.*;
import dev.tradr.backend.agents.repository.*;
import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.application.QuoteSnapshot;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.trading.domain.*;
import dev.tradr.backend.trading.exception.*;
import dev.tradr.backend.trading.repository.*;
import dev.tradr.backend.trading.web.dto.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class TradingService {
    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");
    private final AccountRepository accounts;
    private final OrderRepository orders;
    private final TradeRepository trades;
    private final AgentRepository agents;
    private final AgentWalletRepository wallets;
    private final AgentPositionRepository positions;
    private final MarketService market;

    public TradingService(AccountRepository accounts, OrderRepository orders, TradeRepository trades,
                          AgentRepository agents, AgentWalletRepository wallets,
                          AgentPositionRepository positions, MarketService market) {
        this.accounts = accounts;
        this.orders = orders;
        this.trades = trades;
        this.agents = agents;
        this.wallets = wallets;
        this.positions = positions;
        this.market = market;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> orders(UUID userId, String requestedStatus, UUID agentId) {
        Account account = account(userId);
        List<Order> result = requestedStatus == null || requestedStatus.isBlank()
                ? orders.findByAccountIdOrderByCreatedAtDesc(account.getId())
                : orders.findByAccountIdAndStatusOrderByCreatedAtDesc(account.getId(), status(requestedStatus));
        return result.stream().filter(order -> agentId == null || agentId.equals(order.getSourceAgentId())).map(this::orderResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<TradeResponse> trades(UUID userId, int limit, Instant before, UUID agentId) {
        Account account = account(userId);
        Instant cursor = before == null ? Instant.now().plus(36_500, ChronoUnit.DAYS) : before;
        return trades.findByAccountIdAndExecutedAtBeforeOrderByExecutedAtDesc(account.getId(), cursor, PageRequest.of(0, limit))
                .stream().map(this::tradeResponse)
                .filter(trade -> agentId == null || agentId.equals(trade.agentId())).toList();
    }

    @Transactional(readOnly = true)
    public TradeStatsResponse tradeStats(UUID userId) {
        Account account = account(userId);
        Instant today = Instant.now().atZone(ZoneOffset.UTC).truncatedTo(ChronoUnit.DAYS).toInstant();
        List<Trade> todayTrades = trades.findByAccountIdAndExecutedAtAfter(account.getId(), today);
        BigDecimal turnover = todayTrades.stream().map(this::gross).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal commission = todayTrades.stream().map(Trade::getCommission).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        long buys = todayTrades.stream().filter(trade -> trade.getSide() == OrderSide.BUY).count();
        long open = orders.findByAccountIdAndStatusOrderByCreatedAtDesc(account.getId(), OrderStatus.OPEN).size();
        return new TradeStatsResponse(todayTrades.size(), buys, todayTrades.size() - buys, turnover, commission, open);
    }

    @Transactional(readOnly = true)
    public PortfolioResponse portfolio(UUID userId) {
        Account account = account(userId);
        List<Agent> accountAgents = agents.findByAccountIdOrderByCreatedAtDesc(account.getId());
        List<AgentPosition> allPositions = accountAgents.stream().flatMap(agent -> positions.findByIdAgentId(agent.getId()).stream()).toList();
        List<HoldingResponse> holdings = allPositions.stream().map(this::holding)
                .sorted(Comparator.comparing(HoldingResponse::marketValue).reversed()).toList();
        BigDecimal agentCash = accountAgents.stream().map(Agent::getId).map(wallets::findById).flatMap(Optional::stream)
                .map(AgentWallet::getCashBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal holdingsValue = holdings.stream().map(HoldingResponse::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal total = account.getBalance().add(agentCash).add(holdingsValue).setScale(2);
        return new PortfolioResponse(account.getBalance().add(agentCash).setScale(2), holdingsValue, total,
                holdings.stream().map(holding -> withShare(holding, total)).toList());
    }

    @Transactional(readOnly = true)
    public PositionResponse position(UUID userId, String ticker) {
        Account account = account(userId);
        Instrument instrument = market.instrument(ticker);
        AgentPosition position = agents.findByAccountIdOrderByCreatedAtDesc(account.getId()).stream()
                .map(Agent::getId).map(id -> positions.findById(new AgentPositionId(id, instrument.getId())))
                .flatMap(Optional::stream).findFirst()
                .orElseThrow(() -> new InvalidOrderException("No open position for " + instrument.getTicker()));
        return new PositionResponse(holding(position), position.getUpdatedAt(),
                trades.findByAccountIdAndInstrumentIdOrderByExecutedAtDesc(account.getId(), instrument.getId()).stream()
                        .map(this::tradeResponse).toList());
    }

    @Transactional
    public UUID executeAgentOrder(UUID accountId, UUID agentId, Instrument instrument, OrderSide side,
                                  BigDecimal quantity, QuoteSnapshot quote, long step) {
        agents.findByIdAndAccountId(agentId, accountId).orElseThrow(() -> new IllegalStateException("Agent not found"));
        AgentWallet wallet = wallets.findById(agentId).orElseThrow(() -> new IllegalStateException("Agent wallet not found"));
        BigDecimal price = quote.price().setScale(2, RoundingMode.HALF_UP);
        OrderCalculation calculation = OrderCalculator.calculate(price.toPlainString(), OrderAnchor.QUANTITY,
                OrderCalculator.shares(quantity), side);
        if (!calculation.valid()) throw new InvalidOrderException("Order values are invalid");
        AgentPositionId positionId = new AgentPositionId(agentId, instrument.getId());
        if (side == OrderSide.BUY) {
            if (positions.existsById(positionId)) throw new InvalidOrderException("Agent already owns this instrument");
            if (wallet.getCashBalance().compareTo(calculation.total()) < 0) throw new InsufficientFundsException();
            wallet.debit(calculation.total());
            positions.save(new AgentPosition(agentId, instrument.getId(), calculation.quantity(), price, step));
        } else {
            AgentPosition position = positions.findById(positionId).orElseThrow(InsufficientPositionException::new);
            if (position.getQuantity().compareTo(calculation.quantity()) != 0) throw new InvalidOrderException("Agents close positions in full");
            wallet.credit(calculation.total());
            positions.delete(position);
        }
        Order order = orders.save(Order.forAgent(accountId, instrument.getId(), agentId, side, calculation.quantity()));
        order.fill();
        trades.save(new Trade(order.getId(), accountId, instrument.getId(), side, calculation.quantity(), price, calculation.commission()));
        return order.getId();
    }

    private HoldingResponse holding(AgentPosition position) {
        Instrument instrument = market.instruments().stream().filter(item -> item.getId().equals(position.getId().getInstrumentId())).findFirst().orElseThrow();
        BigDecimal current = market.quote(instrument).price().setScale(2, RoundingMode.HALF_UP);
        BigDecimal value = current.multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cost = position.getAveragePrice().multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal profit = value.subtract(cost).setScale(2);
        BigDecimal percent = cost.signum() == 0 ? BigDecimal.ZERO : profit.divide(cost, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2);
        return new HoldingResponse(instrument.getTicker(), instrument.getName(), position.getQuantity(), position.getAveragePrice(), current, value, profit, percent, BigDecimal.ZERO);
    }

    private HoldingResponse withShare(HoldingResponse holding, BigDecimal total) {
        BigDecimal share = total.signum() == 0 ? BigDecimal.ZERO : holding.marketValue().divide(total, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2);
        return new HoldingResponse(holding.ticker(), holding.name(), holding.quantity(), holding.averagePrice(), holding.currentPrice(), holding.marketValue(), holding.profit(), holding.profitPercent(), share);
    }

    private TradeResponse tradeResponse(Trade trade) {
        BigDecimal gross = gross(trade);
        BigDecimal total = trade.getSide() == OrderSide.BUY ? gross.add(trade.getCommission()) : gross.subtract(trade.getCommission());
        Order order = orders.findById(trade.getOrderId()).orElseThrow();
        UUID agentId = order.getSourceAgentId();
        String agentName = agentName(agentId);
        return new TradeResponse(trade.getId(), trade.getOrderId(), instrumentTicker(trade.getInstrumentId()), trade.getSide().name().toLowerCase(Locale.ROOT),
                trade.getQuantity(), trade.getPrice(), gross, trade.getCommission(), total, agentId, agentName, trade.getExecutedAt());
    }

    private OrderResponse orderResponse(Order order) {
        UUID agentId = order.getSourceAgentId();
        return new OrderResponse(order.getId(), instrumentTicker(order.getInstrumentId()), order.getSide().name().toLowerCase(Locale.ROOT),
                order.getOrderType().name().toLowerCase(Locale.ROOT), order.getQuantity(), order.getLimitPrice(),
                order.getStatus().name().toLowerCase(Locale.ROOT), order.getSource().name().toLowerCase(Locale.ROOT),
                agentId, agentName(agentId), order.getCreatedAt(), order.getFilledAt());
    }

    private String agentName(UUID agentId) { return agentId == null ? "До перехода на агентов" : agents.findById(agentId).map(Agent::getName).orElse("Архивный агент"); }
    private BigDecimal gross(Trade trade) { return trade.getPrice().multiply(trade.getQuantity()).setScale(2, RoundingMode.HALF_UP); }
    private Account account(UUID userId) { return accounts.findByUserId(userId).orElseThrow(() -> new IllegalStateException("Account not found")); }
    private String instrumentTicker(UUID id) { return market.instruments().stream().filter(item -> item.getId().equals(id)).findFirst().orElseThrow().getTicker(); }
    private OrderStatus status(String value) {
        try { return OrderStatus.valueOf(value.toUpperCase(Locale.ROOT)); }
        catch (RuntimeException exception) { throw new InvalidOrderException("Unknown order status"); }
    }
}
