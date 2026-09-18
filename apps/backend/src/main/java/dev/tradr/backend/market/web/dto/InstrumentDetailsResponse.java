package dev.tradr.backend.market.web.dto;

import java.util.List;

public record InstrumentDetailsResponse(
        InstrumentResponse instrument,
        List<MetricResponse> metrics,
        List<NewsItemResponse> news
) {
}
