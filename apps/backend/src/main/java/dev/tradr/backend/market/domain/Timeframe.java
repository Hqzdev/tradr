package dev.tradr.backend.market.domain;

import java.time.Duration;
import java.util.Arrays;

public enum Timeframe {
    ONE_MINUTE("1m", Duration.ofMinutes(1)),
    FIVE_MINUTES("5m", Duration.ofMinutes(5)),
    FIFTEEN_MINUTES("15m", Duration.ofMinutes(15)),
    ONE_HOUR("1h", Duration.ofHours(1)),
    ONE_DAY("1d", Duration.ofDays(1));

    private final String apiValue;
    private final Duration duration;

    Timeframe(String apiValue, Duration duration) {
        this.apiValue = apiValue;
        this.duration = duration;
    }

    public String apiValue() {
        return apiValue;
    }

    public Duration duration() {
        return duration;
    }

    public static Timeframe fromApiValue(String value) {
        return Arrays.stream(values())
                .filter(timeframe -> timeframe.apiValue.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unsupported timeframe: " + value));
    }
}
