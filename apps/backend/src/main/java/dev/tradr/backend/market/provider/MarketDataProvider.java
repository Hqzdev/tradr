package dev.tradr.backend.market.provider;

import dev.tradr.backend.market.domain.Candle;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.Timeframe;

import java.math.BigDecimal;
import java.util.List;

public interface MarketDataProvider {
    List<Candle> createHistory(Instrument instrument, Timeframe timeframe);

    BigDecimal nextPrice(Instrument instrument, long step);

    BigDecimal referencePrice(Instrument instrument);

    long tickVolume(Instrument instrument, long step);
}
