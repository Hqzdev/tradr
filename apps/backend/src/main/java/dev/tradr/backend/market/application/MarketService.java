package dev.tradr.backend.market.application;

import dev.tradr.backend.market.domain.Candle;
import dev.tradr.backend.market.domain.IndexQuote;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.Timeframe;
import dev.tradr.backend.market.exception.InstrumentNotFoundException;
import dev.tradr.backend.market.provider.MarketDataProvider;
import dev.tradr.backend.market.repository.CandleRepository;
import dev.tradr.backend.market.repository.IndexQuoteRepository;
import dev.tradr.backend.market.repository.InstrumentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MarketService {

    private final InstrumentRepository instrumentRepository;
    private final CandleRepository candleRepository;
    private final IndexQuoteRepository indexQuoteRepository;
    private final MarketDataProvider marketDataProvider;

    public MarketService(
            InstrumentRepository instrumentRepository,
            CandleRepository candleRepository,
            IndexQuoteRepository indexQuoteRepository,
            MarketDataProvider marketDataProvider
    ) {
        this.instrumentRepository = instrumentRepository;
        this.candleRepository = candleRepository;
        this.indexQuoteRepository = indexQuoteRepository;
        this.marketDataProvider = marketDataProvider;
    }

    @Transactional(readOnly = true)
    public List<Instrument> instruments() {
        return instrumentRepository.findAllByOrderByTickerAsc();
    }

    @Transactional(readOnly = true)
    public List<IndexQuote> indexQuotes() {
        return indexQuoteRepository.findAllByOrderBySortOrderAsc();
    }

    @Transactional(readOnly = true)
    public Instrument instrument(String ticker) {
        return instrumentRepository.findByTickerIgnoreCase(ticker)
                .orElseThrow(() -> new InstrumentNotFoundException(ticker));
    }

    @Transactional(readOnly = true)
    public QuoteSnapshot quote(String ticker) {
        return quote(instrument(ticker));
    }

    @Transactional(readOnly = true)
    public QuoteSnapshot quote(Instrument instrument) {
        Candle candle = candleRepository.findFirstByInstrumentIdAndTimeframeOrderByBucketStartDesc(
                        instrument.getId(),
                        Timeframe.ONE_MINUTE
                )
                .orElseThrow(() -> new IllegalStateException("No one-minute candle for " + instrument.getTicker()));
        BigDecimal referencePrice = marketDataProvider.referencePrice(instrument);
        BigDecimal changePercent = candle.getClose()
                .subtract(referencePrice)
                .divide(referencePrice, 8, RoundingMode.HALF_UP)
                .movePointRight(2)
                .setScale(2, RoundingMode.HALF_UP);
        return new QuoteSnapshot(instrument, candle.getClose(), changePercent, candle.getVolume(), candle.getBucketStart());
    }

    @Transactional(readOnly = true)
    public List<Candle> candles(String ticker, Timeframe timeframe, int limit) {
        Instrument instrument = instrument(ticker);
        List<Candle> candles = new ArrayList<>(candleRepository.findByInstrumentIdAndTimeframeOrderByBucketStartDesc(
                instrument.getId(),
                timeframe,
                PageRequest.of(0, limit)
        ));
        Collections.reverse(candles);
        return candles;
    }

    @Transactional
    public QuoteSnapshot applyTick(Instrument instrument, long step) {
        BigDecimal price = marketDataProvider.nextPrice(instrument, step);
        long volume = marketDataProvider.tickVolume(instrument, step);
        Candle latest = candleRepository.findFirstByInstrumentIdAndTimeframeOrderByBucketStartDesc(
                        instrument.getId(),
                        Timeframe.ONE_MINUTE
                )
                .orElseThrow(() -> new IllegalStateException("No one-minute candle for " + instrument.getTicker()));
        Instant bucketStart = Instant.now().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
        Candle current = candleRepository.findByInstrumentIdAndTimeframeAndBucketStart(
                        instrument.getId(),
                        Timeframe.ONE_MINUTE,
                        bucketStart
                )
                .orElseGet(() -> new Candle(
                        instrument.getId(),
                        Timeframe.ONE_MINUTE,
                        bucketStart,
                        latest.getClose(),
                        latest.getClose(),
                        latest.getClose(),
                        latest.getClose(),
                        0
                ));
        current.incorporateTick(price, volume);
        Candle saved = candleRepository.save(current);
        BigDecimal referencePrice = marketDataProvider.referencePrice(instrument);
        BigDecimal changePercent = price.subtract(referencePrice)
                .divide(referencePrice, 8, RoundingMode.HALF_UP)
                .movePointRight(2)
                .setScale(2, RoundingMode.HALF_UP);
        return new QuoteSnapshot(instrument, saved.getClose(), changePercent, saved.getVolume(), saved.getBucketStart());
    }
}
