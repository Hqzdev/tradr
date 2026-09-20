package dev.tradr.backend.market.application;

import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.websocket.MarketWebSocketHandler;
import dev.tradr.backend.agents.application.AgentService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicLong;

@Component
public class MarketTickEngine {

    private static final int ACCELERATED_STEPS_PER_TICK = 4;
    private static final int NORMAL_CYCLE_INTERVAL = 23;

    private final MarketService marketService;
    private final MarketWebSocketHandler marketWebSocketHandler;
    private final MarketDataBootstrapper marketDataBootstrapper;
    private final AgentService agentService;
    private final AtomicLong simulationStep = new AtomicLong();
    private final AtomicLong visualTick = new AtomicLong();

    public MarketTickEngine(
            MarketService marketService,
            MarketWebSocketHandler marketWebSocketHandler,
            MarketDataBootstrapper marketDataBootstrapper,
            AgentService agentService
    ) {
        this.marketService = marketService;
        this.marketWebSocketHandler = marketWebSocketHandler;
        this.marketDataBootstrapper = marketDataBootstrapper;
        this.agentService = agentService;
    }

    @Scheduled(fixedDelayString = "${app.market.tick-interval-ms:2600}")
    public void tick() {
        if (!marketDataBootstrapper.isReady()) {
            return;
        }
        long currentVisualTick = visualTick.getAndIncrement();
        var instruments = marketService.instruments();
        for (int substep = 0; substep < ACCELERATED_STEPS_PER_TICK; substep++) {
            long currentStep = simulationStep.getAndIncrement();
            boolean lastSubstep = substep == ACCELERATED_STEPS_PER_TICK - 1;
            boolean normalCycle = lastSubstep && currentVisualTick % NORMAL_CYCLE_INTERVAL == 0;
            for (Instrument instrument : instruments) {
                QuoteSnapshot quote = marketService.applyTick(instrument, currentStep);
                agentService.onTick(instrument, quote, currentStep, normalCycle);
                if (lastSubstep) {
                    marketWebSocketHandler.broadcast(quote);
                }
            }
        }
    }
}
