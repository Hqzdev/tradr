package dev.tradr.backend.market.provider;

import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.InstrumentType;
import dev.tradr.backend.market.domain.Timeframe;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
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
        var prices = java.util.stream.LongStream.range(0, 180)
                .mapToObj(step -> provider.nextPrice(instrument, step))
                .toList();
        var minimum = prices.stream().min(BigDecimal::compareTo).orElseThrow();
        var maximum = prices.stream().max(BigDecimal::compareTo).orElseThrow();
        assertEquals(true, minimum.compareTo(instrument.getBasePrice().multiply(new BigDecimal("0.97"))) < 0);
        assertEquals(true, maximum.compareTo(instrument.getBasePrice().multiply(new BigDecimal("1.03"))) > 0);
    }

    @Test
    void providesReferencePricesForEveryLandingInstrument() {
        List<Instrument> instruments = List.of(
                instrument("META", "Meta Platforms, Inc.", "NASDAQ", "527.8000"),
                instrument("AMD", "Advanced Micro Devices, Inc.", "NASDAQ", "154.6500"),
                instrument("NFLX", "Netflix, Inc.", "NASDAQ", "119.5000"),
                instrument("INTC", "Intel Corporation", "NASDAQ", "24.3600"),
                instrument("AVGO", "Broadcom Inc.", "NASDAQ", "342.5000"),
                instrument("JPM", "JPMorgan Chase & Co.", "NYSE", "303.2000"),
                instrument("V", "Visa Inc.", "NYSE", "359.1000"),
                instrument("KO", "The Coca-Cola Company", "NYSE", "70.1500"),
                instrument("DIS", "The Walt Disney Company", "NYSE", "115.6000"),
                instrument("PEP", "PepsiCo, Inc.", "NASDAQ", "145.8000"),
                instrument("BAC", "Bank of America Corporation", "NYSE", "51.2000"),
                instrument("XOM", "Exxon Mobil Corporation", "NYSE", "113.4500")
        );

        instruments.forEach(instrument -> {
            var referencePrice = provider.referencePrice(instrument);
            assertEquals(4, referencePrice.scale());
        });
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

    private Instrument instrument(String ticker, String name, String exchange, String basePrice) {
        return new Instrument(
                UUID.nameUUIDFromBytes(ticker.getBytes()),
                ticker,
                name,
                exchange,
                InstrumentType.STOCK,
                "USD",
                new BigDecimal(basePrice)
        );
    }
}
