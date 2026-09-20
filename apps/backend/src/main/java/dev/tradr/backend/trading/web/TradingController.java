package dev.tradr.backend.trading.web;

import dev.tradr.backend.trading.application.TradingService;
import dev.tradr.backend.trading.web.dto.OrderResponse;
import dev.tradr.backend.trading.web.dto.PortfolioResponse;
import dev.tradr.backend.trading.web.dto.PositionResponse;
import dev.tradr.backend.trading.web.dto.TradeResponse;
import dev.tradr.backend.trading.web.dto.TradeStatsResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@Validated
@RequestMapping("/api/v1")
public class TradingController {

    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @GetMapping("/orders")
    public List<OrderResponse> orders(Authentication authentication, @RequestParam(required = false) String status,
                                      @RequestParam(required = false) UUID agentId) {
        return tradingService.orders(userId(authentication), status, agentId);
    }

    @GetMapping("/trades")
    public List<TradeResponse> trades(
            Authentication authentication,
            @RequestParam(defaultValue = "50") @Min(1) @Max(200) int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant before,
            @RequestParam(required = false) UUID agentId
    ) {
        return tradingService.trades(userId(authentication), limit, before, agentId);
    }

    @GetMapping("/trades/stats")
    public TradeStatsResponse tradeStats(Authentication authentication) {
        return tradingService.tradeStats(userId(authentication));
    }

    @GetMapping("/portfolio")
    public PortfolioResponse portfolio(Authentication authentication) {
        return tradingService.portfolio(userId(authentication));
    }

    @GetMapping("/portfolio/{ticker}")
    public PositionResponse position(Authentication authentication, @PathVariable String ticker) {
        return tradingService.position(userId(authentication), ticker);
    }

    private UUID userId(Authentication authentication) {
        return (UUID) authentication.getPrincipal();
    }
}
