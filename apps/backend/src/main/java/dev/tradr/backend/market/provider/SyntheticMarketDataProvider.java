package dev.tradr.backend.market.provider;

import dev.tradr.backend.market.domain.Candle;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.Timeframe;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class SyntheticMarketDataProvider implements MarketDataProvider {

    private static final List<BigDecimal> TICK_SCENARIO = List.of(
            new BigDecimal("0.00"), new BigDecimal("0.02"), new BigDecimal("0.05"),
            new BigDecimal("0.03"), new BigDecimal("-0.02"), new BigDecimal("0.04"),
            new BigDecimal("0.06"), new BigDecimal("0.02"), new BigDecimal("-0.03"),
            new BigDecimal("0.05")
    );

    private static final Map<String, BigDecimal> DAILY_CHANGE_PERCENT = Map.of(
            "AAPL", new BigDecimal("1.84"),
            "NVDA", new BigDecimal("2.10"),
            "TSLA", new BigDecimal("-0.62"),
            "MSFT", new BigDecimal("0.48"),
            "AMZN", new BigDecimal("1.06"),
            "GOOGL", new BigDecimal("-0.31")
    );

    private static final List<BigDecimal> AAPL_FIVE_MINUTE_DELTAS = List.of(
            new BigDecimal("0.08"), new BigDecimal("0.06"), new BigDecimal("-0.03"),
            new BigDecimal("0.09"), new BigDecimal("0.05"), new BigDecimal("-0.04"),
            new BigDecimal("0.10"), new BigDecimal("0.06"), new BigDecimal("-0.02"),
            new BigDecimal("0.08"), new BigDecimal("0.04"), new BigDecimal("-0.03"),
            new BigDecimal("0.07"), new BigDecimal("0.05"), new BigDecimal("-0.04"),
            new BigDecimal("0.07"), new BigDecimal("0.04"), new BigDecimal("-0.05"),
            new BigDecimal("0.11"), new BigDecimal("0.04"), new BigDecimal("-0.07"),
            new BigDecimal("0.06"), new BigDecimal("-0.08"), new BigDecimal("0.08")
    );

    @Override
    public List<Candle> createHistory(Instrument instrument, Timeframe timeframe) {
        if (instrument.getTicker().equals("AAPL") && timeframe == Timeframe.FIVE_MINUTES) {
            return createAaplFiveMinuteHistory(instrument);
        }

        int count = 120;
        List<BigDecimal> deltas = new ArrayList<>(count);
        BigDecimal amplitude = instrument.getBasePrice()
                .multiply(new BigDecimal("0.0015"))
                .multiply(BigDecimal.valueOf(timeframe.duration().toMinutes()).sqrt(java.math.MathContext.DECIMAL64));
        for (int index = 0; index < count; index++) {
            double wave = Math.sin((index + instrument.getTicker().hashCode()) * 0.73)
                    + Math.cos((index + instrument.getTicker().hashCode()) * 0.37) * 0.55;
            deltas.add(round(amplitude.multiply(BigDecimal.valueOf(wave))));
        }
        return createCandles(instrument, timeframe, deltas, Instant.now());
    }

    @Override
    public BigDecimal nextPrice(Instrument instrument, long step) {
        BigDecimal delta = TICK_SCENARIO.get((int) (step % TICK_SCENARIO.size()));
        return round(instrument.getBasePrice().add(delta));
    }

    @Override
    public BigDecimal referencePrice(Instrument instrument) {
        BigDecimal changeFactor = BigDecimal.ONE.add(DAILY_CHANGE_PERCENT.get(instrument.getTicker())
                .movePointLeft(2));
        return round(instrument.getBasePrice().divide(changeFactor, 4, RoundingMode.HALF_UP));
    }

    @Override
    public long tickVolume(Instrument instrument, long step) {
        return 4_000L + Math.floorMod(instrument.getTicker().hashCode() + (int) step * 8_237, 62_000);
    }

    private List<Candle> createAaplFiveMinuteHistory(Instrument instrument) {
        return createCandles(instrument, Timeframe.FIVE_MINUTES, AAPL_FIVE_MINUTE_DELTAS, Instant.now());
    }

    private List<Candle> createCandles(Instrument instrument, Timeframe timeframe, List<BigDecimal> deltas, Instant end) {
        BigDecimal deltaSum = deltas.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal price = instrument.getBasePrice().subtract(deltaSum);
        Instant start = end.minus(timeframe.duration().multipliedBy(deltas.size()));
        List<Candle> candles = new ArrayList<>(deltas.size());

        for (int index = 0; index < deltas.size(); index++) {
            BigDecimal open = round(price);
            BigDecimal close = round(open.add(deltas.get(index)));
            BigDecimal high = round(open.max(close).add(deltas.get(index).abs().multiply(new BigDecimal("0.35"))).add(new BigDecimal("0.03")));
            BigDecimal low = round(open.min(close).subtract(deltas.get(index).abs().multiply(new BigDecimal("0.30"))).subtract(new BigDecimal("0.02")));
            candles.add(new Candle(
                    instrument.getId(),
                    timeframe,
                    start.plus(timeframe.duration().multipliedBy(index)),
                    open,
                    high,
                    low,
                    close,
                    30_000L + Math.floorMod(index * 8_237 + instrument.getTicker().hashCode(), 62_000)
            ));
            price = close;
        }

        return candles;
    }

    private BigDecimal round(BigDecimal value) {
        return value.setScale(4, RoundingMode.HALF_UP);
    }
}
