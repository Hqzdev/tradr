package dev.tradr.backend.trading.web.dto;

import jakarta.validation.constraints.NotBlank;

public record PreviewOrderRequest(
        @NotBlank String ticker,
        @NotBlank String side,
        @NotBlank String anchor,
        @NotBlank String value
) {
}
