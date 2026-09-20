package dev.tradr.backend.dashboard.web.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public record AccountPreferencesRequest(
        @DecimalMin("1000.00") @DecimalMax("10000000.00") BigDecimal goalValue,
        Boolean accelerationEnabled
) {}
