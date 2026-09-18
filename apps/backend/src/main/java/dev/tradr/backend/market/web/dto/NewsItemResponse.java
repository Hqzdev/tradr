package dev.tradr.backend.market.web.dto;

public record NewsItemResponse(
        String source,
        String time,
        String headline
) {
}
