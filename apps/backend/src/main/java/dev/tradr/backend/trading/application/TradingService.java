package dev.tradr.backend.trading.application;

import dev.tradr.backend.auth.domain.Account;
import dev.tradr.backend.auth.repository.AccountRepository;
import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.application.QuoteSnapshot;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.trading.domain.Order;
import dev.tradr.backend.trading.domain.OrderSide;
import dev.tradr.backend.trading.domain.OrderStatus;
import dev.tradr.backend.trading.domain.OrderType;
import dev.tradr.backend.trading.domain.Position;
import dev.tradr.backend.trading.domain.PositionId;
import dev.tradr.backend.trading.domain.Trade;
import dev.tradr.backend.trading.exception.InsufficientFundsException;
import dev.tradr.backend.trading.exception.InsufficientPositionException;
import dev.tradr.backend.trading.exception.InvalidOrderException;
import dev.tradr.backend.trading.exception.OrderNotFoundException;
import dev.tradr.backend.trading.exception.OrderStateException;
import dev.tradr.backend.trading.repository.OrderRepository;
import dev.tradr.backend.trading.repository.PositionRepository;
import dev.tradr.backend.trading.repository.TradeRepository;
import dev.tradr.backend.trading.web.dto.CreateOrderRequest;
import dev.tradr.backend.trading.web.dto.HoldingResponse;
import dev.tradr.backend.trading.web.dto.OrderCalculationResponse;
import dev.tradr.backend.trading.web.dto.OrderResponse;
import dev.tradr.backend.trading.web.dto.PortfolioResponse;
import dev.tradr.backend.trading.web.dto.PositionResponse;
import dev.tradr.backend.trading.web.dto.PreviewOrderRequest;
import dev.tradr.backend.trading.web.dto.TradeResponse;
import dev.tradr.backend.trading.web.dto.TradeStatsResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class TradingService {

    private static final BigDecimal ONE_HUNDRED = new BigDecimal("100");

    private final AccountRepository accountRepository;
    private final OrderRepository orderRepository;
    private final TradeRepository tradeRepository;
    private final PositionRepository positionRepository;
    private final MarketService marketService;

    public TradingService(
            AccountRepository accountRepository,
            OrderRepository orderRepository,
            TradeRepository tradeRepository,
            PositionRepository positionRepository,
            MarketService marketService
    ) {
        this.accountRepository = accountRepository;
        this.orderRepository = orderRepository;
        this.tradeRepository = tradeRepository;
        this.positionRepository = positionRepository;
        this.marketService = marketService;
    }

    @Transactional(readOnly = true)
    public OrderCalculationResponse preview(PreviewOrderRequest request) {
        OrderSide side = side(request.side());
        OrderAnchor anchor = anchor(request.anchor());
        String price = priceText(marketService.quote(request.ticker()));
        return calculationResponse(OrderCalculator.calculate(price, anchor, request.value(), side));
    }

    @Transactional
    public OrderResponse create(UUID userId, CreateOrderRequest request) {
        Account account = account(userId);
        Instrument instrument = marketService.instrument(request.ticker());
        OrderSide side = side(request.side());
        OrderType orderType = orderType(request.orderType());
        String input = input(request);
        OrderAnchor anchor = request.quantity() == null || request.quantity().isBlank() ? OrderAnchor.AMOUNT : OrderAnchor.QUANTITY;
        BigDecimal limitPrice = orderType == OrderType.LIMIT ? limitPrice(request.limitPrice()) : null;
        String calculationPrice = limitPrice == null ? priceText(marketService.quote(instrument)) : priceText(limitPrice);
        OrderCalculation calculation = OrderCalculator.calculate(calculationPrice, anchor, input, side);
        requireValid(calculation);
        Order order = new Order(account.getId(), instrument.getId(), side, orderType, calculation.quantity(), limitPrice);
        if (orderType == OrderType.LIMIT) {
            ensureReservation(account, instrument.getId(), side, calculation);
        }
        order = orderRepository.save(order);
        QuoteSnapshot quote = marketService.quote(instrument);
        if (orderType == OrderType.MARKET || eligible(order, quote.price())) {
            execute(order, account, instrument, quote);
        }
        return orderResponse(order, instrument);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> orders(UUID userId, String requestedStatus) {
        Account account = account(userId);
        List<Order> orders = requestedStatus == null || requestedStatus.isBlank()
                ? orderRepository.findByAccountIdOrderByCreatedAtDesc(account.getId())
                : orderRepository.findByAccountIdAndStatusOrderByCreatedAtDesc(account.getId(), status(requestedStatus));
        return orders.stream().map(order -> orderResponse(order, marketService.instrument(instrumentTicker(order)))).toList();
    }

    @Transactional
    public void cancel(UUID userId, UUID orderId) {
        Account account = account(userId);
        Order order = orderRepository.findByIdAndAccountId(orderId, account.getId())
                .orElseThrow(() -> new OrderNotFoundException(orderId));
        if (order.getStatus() != OrderStatus.OPEN) {
            throw new OrderStateException("Only open orders can be cancelled");
        }
        order.cancel();
    }

    @Transactional(readOnly = true)
    public List<TradeResponse> trades(UUID userId, int limit, Instant before) {
        Account account = account(userId);
        Instant cursor = before == null ? Instant.now().plus(36_500, ChronoUnit.DAYS) : before;
        return tradeRepository.findByAccountIdAndExecutedAtBeforeOrderByExecutedAtDesc(account.getId(), cursor, PageRequest.of(0, limit))
                .stream().map(this::tradeResponse).toList();
    }

    @Transactional(readOnly = true)
    public TradeStatsResponse tradeStats(UUID userId) {
        Account account = account(userId);
        Instant startOfDay = Instant.now().atZone(ZoneOffset.UTC).truncatedTo(ChronoUnit.DAYS).toInstant();
        List<Trade> trades = tradeRepository.findByAccountIdAndExecutedAtAfter(account.getId(), startOfDay);
        BigDecimal turnover = trades.stream().map(this::gross).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal commission = trades.stream().map(Trade::getCommission).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        long buyCount = trades.stream().filter(trade -> trade.getSide() == OrderSide.BUY).count();
        long sellCount = trades.size() - buyCount;
        long openOrders = orderRepository.findByAccountIdAndStatusOrderByCreatedAtDesc(account.getId(), OrderStatus.OPEN).size();
        return new TradeStatsResponse(trades.size(), buyCount, sellCount, turnover, commission, openOrders);
    }

    @Transactional(readOnly = true)
    public PortfolioResponse portfolio(UUID userId) {
        Account account = account(userId);
        List<HoldingResponse> holdings = positionRepository.findByIdAccountId(account.getId()).stream()
                .map(this::holding)
                .sorted(Comparator.comparing(HoldingResponse::marketValue).reversed())
                .toList();
        BigDecimal holdingsValue = holdings.stream().map(HoldingResponse::marketValue).reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2);
        BigDecimal totalValue = account.getBalance().add(holdingsValue).setScale(2);
        List<HoldingResponse> weightedHoldings = holdings.stream()
                .map(holding -> holdingWithPortfolioShare(holding, totalValue))
                .toList();
        return new PortfolioResponse(account.getBalance(), holdingsValue, totalValue, weightedHoldings);
    }

    @Transactional(readOnly = true)
    public PositionResponse position(UUID userId, String ticker) {
        Account account = account(userId);
        Instrument instrument = marketService.instrument(ticker);
        Position position = positionRepository.findById(new PositionId(account.getId(), instrument.getId()))
                .orElseThrow(() -> new InvalidOrderException("No open position for " + instrument.getTicker()));
        return new PositionResponse(
                holding(position),
                position.getUpdatedAt(),
                tradeRepository.findByAccountIdAndInstrumentIdOrderByExecutedAtDesc(account.getId(), instrument.getId())
                        .stream().map(this::tradeResponse).toList()
        );
    }

    @Transactional
    public void processEligibleLimitOrders(Instrument instrument, QuoteSnapshot quote) {
        for (Order order : orderRepository.findByInstrumentIdAndStatusOrderByCreatedAtAsc(instrument.getId(), OrderStatus.OPEN)) {
            if (!eligible(order, quote.price())) {
                continue;
            }
            Account account = accountRepository.findById(order.getAccountId()).orElse(null);
            if (account == null) {
                continue;
            }
            execute(order, account, instrument, quote);
        }
    }

    @Transactional
    public UUID executeAgentOrder(UUID accountId, UUID agentId, Instrument instrument, OrderSide side, BigDecimal quantity, QuoteSnapshot quote) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new IllegalStateException("Account not found"));
        Order order = orderRepository.save(Order.forAgent(accountId, instrument.getId(), agentId, side, quantity));
        execute(order, account, instrument, quote);
        return order.getId();
    }

    private void execute(Order order, Account account, Instrument instrument, QuoteSnapshot quote) {
        OrderCalculation calculation = OrderCalculator.calculate(priceText(quote), OrderAnchor.QUANTITY, OrderCalculator.shares(order.getQuantity()), order.getSide());
        requireValid(calculation);
        if (order.getSide() == OrderSide.BUY) {
            if (account.getBalance().compareTo(calculation.total()) < 0) {
                if (order.getOrderType() == OrderType.LIMIT) return;
                throw new InsufficientFundsException();
            }
            account.debit(calculation.total());
            buyPosition(account.getId(), instrument.getId(), calculation.quantity(), quotePrice(quote));
        } else {
            Position position = positionRepository.findById(new PositionId(account.getId(), instrument.getId()))
                    .orElseThrow(InsufficientPositionException::new);
            if (position.getQuantity().compareTo(calculation.quantity()) < 0) {
                if (order.getOrderType() == OrderType.LIMIT) return;
                throw new InsufficientPositionException();
            }
            account.credit(calculation.total());
            sellPosition(position, calculation.quantity());
        }
        accountRepository.save(account);
        order.fill();
        tradeRepository.save(new Trade(
                order.getId(),
                account.getId(),
                instrument.getId(),
                order.getSide(),
                calculation.quantity(),
                quotePrice(quote),
                calculation.commission()
        ));
    }

    private void buyPosition(UUID accountId, UUID instrumentId, BigDecimal quantity, BigDecimal price) {
        PositionId positionId = new PositionId(accountId, instrumentId);
        Position position = positionRepository.findById(positionId).orElse(null);
        if (position == null) {
            positionRepository.save(new Position(accountId, instrumentId, quantity, price));
            return;
        }
        position.buy(quantity, price);
    }

    private void sellPosition(Position position, BigDecimal quantity) {
        position.sell(quantity);
        if (position.getQuantity().signum() == 0) {
            positionRepository.delete(position);
        }
    }

    private void ensureReservation(Account account, UUID instrumentId, OrderSide side, OrderCalculation calculation) {
        List<Order> openOrders = orderRepository.findByAccountIdAndInstrumentIdAndStatus(account.getId(), instrumentId, OrderStatus.OPEN);
        if (side == OrderSide.BUY) {
            BigDecimal reserved = openOrders.stream()
                    .filter(order -> order.getSide() == OrderSide.BUY)
                    .map(order -> OrderCalculator.calculate(priceText(order.getLimitPrice()), OrderAnchor.QUANTITY, OrderCalculator.shares(order.getQuantity()), OrderSide.BUY).total())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (account.getBalance().compareTo(reserved.add(calculation.total())) < 0) {
                throw new InsufficientFundsException();
            }
            return;
        }
        BigDecimal reserved = openOrders.stream()
                .filter(order -> order.getSide() == OrderSide.SELL)
                .map(Order::getQuantity)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        Position position = positionRepository.findById(new PositionId(account.getId(), instrumentId))
                .orElseThrow(InsufficientPositionException::new);
        if (position.getQuantity().compareTo(reserved.add(calculation.quantity())) < 0) {
            throw new InsufficientPositionException();
        }
    }

    private HoldingResponse holding(Position position) {
        Instrument instrument = marketService.instrument(instrumentTicker(position));
        BigDecimal currentPrice = quotePrice(marketService.quote(instrument));
        BigDecimal marketValue = currentPrice.multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cost = position.getAveragePrice().multiply(position.getQuantity()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal profit = marketValue.subtract(cost).setScale(2);
        BigDecimal profitPercent = cost.signum() == 0 ? BigDecimal.ZERO : profit.divide(cost, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2);
        return new HoldingResponse(instrument.getTicker(), instrument.getName(), position.getQuantity(), position.getAveragePrice(), currentPrice, marketValue, profit, profitPercent, BigDecimal.ZERO);
    }

    private HoldingResponse holdingWithPortfolioShare(HoldingResponse holding, BigDecimal totalValue) {
        BigDecimal share = totalValue.signum() == 0 ? BigDecimal.ZERO : holding.marketValue().divide(totalValue, 4, RoundingMode.HALF_UP).multiply(ONE_HUNDRED).setScale(2);
        return new HoldingResponse(holding.ticker(), holding.name(), holding.quantity(), holding.averagePrice(), holding.currentPrice(), holding.marketValue(), holding.profit(), holding.profitPercent(), share);
    }

    private TradeResponse tradeResponse(Trade trade) {
        BigDecimal gross = gross(trade);
        BigDecimal total = trade.getSide() == OrderSide.BUY ? gross.add(trade.getCommission()) : gross.subtract(trade.getCommission());
        return new TradeResponse(trade.getId(), trade.getOrderId(), instrumentTicker(trade), trade.getSide().name().toLowerCase(Locale.ROOT), trade.getQuantity(), trade.getPrice(), gross, trade.getCommission(), total, trade.getExecutedAt());
    }

    private BigDecimal gross(Trade trade) {
        return trade.getPrice().multiply(trade.getQuantity()).setScale(2, RoundingMode.HALF_UP);
    }

    private OrderResponse orderResponse(Order order, Instrument instrument) {
        return new OrderResponse(order.getId(), instrument.getTicker(), order.getSide().name().toLowerCase(Locale.ROOT), order.getOrderType().name().toLowerCase(Locale.ROOT), order.getQuantity(), order.getLimitPrice(), order.getStatus().name().toLowerCase(Locale.ROOT), order.getSource().name().toLowerCase(Locale.ROOT), order.getCreatedAt(), order.getFilledAt());
    }

    private Account account(UUID userId) {
        return accountRepository.findByUserId(userId).orElseThrow(() -> new IllegalStateException("Account not found"));
    }

    private String input(CreateOrderRequest request) {
        boolean hasQuantity = request.quantity() != null && !request.quantity().isBlank();
        boolean hasAmount = request.amount() != null && !request.amount().isBlank();
        if (hasQuantity == hasAmount) {
            throw new InvalidOrderException("Provide exactly one of quantity or amount");
        }
        return hasQuantity ? request.quantity() : request.amount();
    }

    private OrderSide side(String value) {
        try {
            return OrderSide.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidOrderException("side must be buy or sell");
        }
    }

    private OrderAnchor anchor(String value) {
        try {
            return OrderAnchor.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidOrderException("anchor must be quantity or amount");
        }
    }

    private OrderType orderType(String value) {
        try {
            return OrderType.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidOrderException("orderType must be market or limit");
        }
    }

    private OrderStatus status(String value) {
        try {
            return OrderStatus.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw new InvalidOrderException("Unknown order status");
        }
    }

    private BigDecimal limitPrice(String value) {
        if (!OrderCalculator.accepts(value == null ? "" : value, 2)) {
            throw new InvalidOrderException("limitPrice must contain a positive price with up to two decimals");
        }
        BigDecimal price = new BigDecimal(value.replace(',', '.'));
        if (price.signum() <= 0) {
            throw new InvalidOrderException("limitPrice must be greater than zero");
        }
        return price.setScale(4);
    }

    private void requireValid(OrderCalculation calculation) {
        if (!calculation.valid()) {
            throw new InvalidOrderException("Order values are invalid");
        }
    }

    private boolean eligible(Order order, BigDecimal currentPrice) {
        if (order.getOrderType() == OrderType.MARKET) return true;
        return order.getSide() == OrderSide.BUY
                ? currentPrice.compareTo(order.getLimitPrice()) <= 0
                : currentPrice.compareTo(order.getLimitPrice()) >= 0;
    }

    private String priceText(QuoteSnapshot quote) {
        return quotePrice(quote).toPlainString();
    }

    private BigDecimal quotePrice(QuoteSnapshot quote) {
        return quote.price().setScale(2, RoundingMode.HALF_UP);
    }

    private String priceText(BigDecimal price) {
        return price.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    private OrderCalculationResponse calculationResponse(OrderCalculation calculation) {
        return new OrderCalculationResponse(calculation.quantity(), calculation.gross(), calculation.commission(), calculation.total(), calculation.valid());
    }

    private String instrumentTicker(Order order) {
        return marketService.instruments().stream().filter(instrument -> instrument.getId().equals(order.getInstrumentId())).findFirst().orElseThrow().getTicker();
    }

    private String instrumentTicker(Position position) {
        return marketService.instruments().stream().filter(instrument -> instrument.getId().equals(position.getId().getInstrumentId())).findFirst().orElseThrow().getTicker();
    }

    private String instrumentTicker(Trade trade) {
        return marketService.instruments().stream().filter(instrument -> instrument.getId().equals(trade.getInstrumentId())).findFirst().orElseThrow().getTicker();
    }
}
