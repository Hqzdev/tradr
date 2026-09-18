package dev.tradr.backend.market.application;

import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.websocket.MarketWebSocketHandler;
import dev.tradr.backend.trading.application.TradingService;
import dev.tradr.backend.agents.application.AgentService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class MarketTickEngine {

    private final MarketService marketService;
    private final MarketWebSocketHandler marketWebSocketHandler;
    private final MarketDataBootstrapper marketDataBootstrapper;
    private final TradingService tradingService;
    private final AgentService agentService;
    private final AtomicLong step = new AtomicLong();

    public MarketTickEngine(
            MarketService marketService,
            MarketWebSocketHandler marketWebSocketHandler,
            MarketDataBootstrapper marketDataBootstrapper,
            TradingService tradingService,
            AgentService agentService
    ) {
        this.marketService = marketService;
        this.marketWebSocketHandler = marketWebSocketHandler;
        this.marketDataBootstrapper = marketDataBootstrapper;
        this.tradingService = tradingService;
        this.agentService = agentService;
    }

    @Scheduled(fixedDelayString = "${app.market.tick-interval-ms:2600}")
    public void tick() {
        if (!marketDataBootstrapper.isReady()) {
            return;
        }
        long currentStep = step.getAndIncrement();
        for (Instrument instrument : marketService.instruments()) {
            QuoteSnapshot quote = marketService.applyTick(instrument, currentStep);
            tradingService.processEligibleLimitOrders(instrument, quote);
            agentService.onTick(instrument, quote);
            marketWebSocketHandler.broadcast(quote);
        }
    }
}
