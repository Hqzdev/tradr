package dev.tradr.backend.market.provider;

import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.InstrumentType;
import dev.tradr.backend.market.domain.Timeframe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SyntheticMarketDataProviderTest {

    private final SyntheticMarketDataProvider provider = new SyntheticMarketDataProvider();

    @Test
    void createsTheFixtureCompatibleAaplFiveMinuteHistory() {
        Instrument instrument = instrument();

        var candles = provider.createHistory(instrument, Timeframe.FIVE_MINUTES);

        assertEquals(24, candles.size());
        assertEquals(new BigDecimal("192.4500"), candles.getLast().getClose());
        assertEquals(new BigDecimal("192.4500"), provider.nextPrice(instrument, 0));
        assertEquals(new BigDecimal("192.5000"), provider.nextPrice(instrument, 2));
    }

    private Instrument instrument() {
        return new Instrument(
                UUID.fromString("00000000-0000-0000-0000-000000000001"),
                "AAPL",
                "Apple Inc.",
                "NASDAQ",
                InstrumentType.STOCK,
                "USD",
                new BigDecimal("192.4500")
        );
    }
}
