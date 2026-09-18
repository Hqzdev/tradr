package dev.tradr.backend.market.web;

import dev.tradr.backend.market.application.MarketService;
import dev.tradr.backend.market.domain.IndexQuote;
import dev.tradr.backend.market.web.dto.IndexQuoteResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/indices")
    public List<IndexQuoteResponse> indices() {
        return marketService.indexQuotes().stream()
                .map(this::toResponse)
                .toList();
    }

    private IndexQuoteResponse toResponse(IndexQuote indexQuote) {
        return new IndexQuoteResponse(
                indexQuote.getName(),
                indexQuote.getDisplayValue(),
                indexQuote.getChangePercent(),
                indexQuote.getUpdatedAt()
        );
    }
}
