package dev.tradr.backend.trading.web.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateOrderRequest(
        @NotBlank String ticker,
        @NotBlank String side,
        @NotBlank String orderType,
        String quantity,
        String amount,
        String limitPrice
) {
}
