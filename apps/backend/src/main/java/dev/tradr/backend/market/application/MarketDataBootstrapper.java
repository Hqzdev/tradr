package dev.tradr.backend.market.application;

import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.Timeframe;
import dev.tradr.backend.market.provider.MarketDataProvider;
import dev.tradr.backend.market.repository.CandleRepository;
import dev.tradr.backend.market.repository.InstrumentRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class MarketDataBootstrapper implements ApplicationRunner {

    private final InstrumentRepository instrumentRepository;
    private final CandleRepository candleRepository;
    private final MarketDataProvider marketDataProvider;
    private final AtomicBoolean ready = new AtomicBoolean();

    public MarketDataBootstrapper(
            InstrumentRepository instrumentRepository,
            CandleRepository candleRepository,
            MarketDataProvider marketDataProvider
    ) {
        this.instrumentRepository = instrumentRepository;
        this.candleRepository = candleRepository;
        this.marketDataProvider = marketDataProvider;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (Instrument instrument : instrumentRepository.findAll()) {
            for (Timeframe timeframe : Timeframe.values()) {
                if (!candleRepository.existsByInstrumentIdAndTimeframe(instrument.getId(), timeframe)) {
                    candleRepository.saveAll(marketDataProvider.createHistory(instrument, timeframe));
                }
            }
        }
        ready.set(true);
    }

    public boolean isReady() {
        return ready.get();
    }
}
