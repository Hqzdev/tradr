package dev.tradr.backend.market.web;

import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.application.QuoteSnapshot;
import dev.tradr.backend.market.domain.Candle;
import dev.tradr.backend.market.domain.Instrument;
import dev.tradr.backend.market.domain.Timeframe;
import dev.tradr.backend.market.exception.InvalidTimeframeException;
import dev.tradr.backend.market.web.dto.CandleResponse;
import dev.tradr.backend.market.web.dto.InstrumentDetailsResponse;
import dev.tradr.backend.market.web.dto.InstrumentResponse;
import dev.tradr.backend.market.web.dto.MetricResponse;
import dev.tradr.backend.market.web.dto.NewsItemResponse;
import dev.tradr.backend.market.web.dto.QuoteResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@RestController
@Validated
@RequestMapping("/api/v1/instruments")
public class InstrumentController {

    private final MarketService marketService;

    public InstrumentController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping
    public List<InstrumentResponse> instruments() {
        return marketService.instruments().stream()
                .map(instrument -> toInstrumentResponse(marketService.quote(instrument)))
                .toList();
    }

    @GetMapping("/{ticker}")
    public InstrumentDetailsResponse instrument(@PathVariable String ticker) {
        QuoteSnapshot quote = marketService.quote(ticker);
        return new InstrumentDetailsResponse(
                toInstrumentResponse(quote),
                metrics(quote),
                news(quote.instrument())
        );
    }

    @GetMapping("/{ticker}/quote")
    public QuoteResponse quote(@PathVariable String ticker) {
        return toQuoteResponse(marketService.quote(ticker));
    }

    @GetMapping("/{ticker}/candles")
    public List<CandleResponse> candles(
            @PathVariable String ticker,
            @RequestParam(defaultValue = "5m") String timeframe,
            @RequestParam(defaultValue = "60") @Min(1) @Max(500) int limit
    ) {
        Timeframe resolvedTimeframe = resolveTimeframe(timeframe);
        return marketService.candles(ticker, resolvedTimeframe, limit).stream()
                .map(this::toCandleResponse)
                .toList();
    }

    @GetMapping("/{ticker}/news")
    public List<NewsItemResponse> news(@PathVariable String ticker) {
        return news(marketService.instrument(ticker));
    }

    private Timeframe resolveTimeframe(String value) {
        try {
            return Timeframe.fromApiValue(value);
        } catch (IllegalArgumentException exception) {
            throw new InvalidTimeframeException(value);
        }
    }

    private InstrumentResponse toInstrumentResponse(QuoteSnapshot quote) {
        Instrument instrument = quote.instrument();
        return new InstrumentResponse(
                instrument.getTicker(),
                instrument.getName(),
                instrument.getExchange(),
                instrument.getType().name().toLowerCase(),
                instrument.getCurrency(),
                quote.price(),
                quote.changePercent(),
                quote.volume(),
                quote.timestamp()
        );
    }

    private QuoteResponse toQuoteResponse(QuoteSnapshot quote) {
        return new QuoteResponse(
                quote.instrument().getTicker(),
                quote.price(),
                quote.changePercent(),
                quote.volume(),
                quote.timestamp()
        );
    }

    private CandleResponse toCandleResponse(Candle candle) {
        return new CandleResponse(
                candle.getBucketStart(),
                candle.getOpen(),
                candle.getHigh(),
                candle.getLow(),
                candle.getClose(),
                candle.getVolume()
        );
    }

    private List<MetricResponse> metrics(QuoteSnapshot quote) {
        BigDecimal low = quote.price().multiply(new BigDecimal("0.985")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal high = quote.price().multiply(new BigDecimal("1.015")).setScale(2, RoundingMode.HALF_UP);
        return List.of(
                new MetricResponse("Биржа", quote.instrument().getExchange()),
                new MetricResponse("Валюта", quote.instrument().getCurrency()),
                new MetricResponse("Диапазон дня", low + " - " + high),
                new MetricResponse("Текущая цена", quote.price().setScale(2, RoundingMode.HALF_UP).toPlainString()),
                new MetricResponse("Изменение", quote.changePercent().toPlainString() + "%"),
                new MetricResponse("Объём", Long.toString(quote.volume()))
        );
    }

    private List<NewsItemResponse> news(Instrument instrument) {
        return List.of(
                new NewsItemResponse("TRADR Synthetic", "сейчас", instrument.getName() + " обновляется synthetic market engine"),
                new NewsItemResponse("TRADR Synthetic", "2 ч назад", "Детерминированный сценарий рынка сформировал новую ценовую сессию для " + instrument.getTicker())
        );
    }
}
