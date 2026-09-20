package dev.tradr.backend.agents.web.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateAgentRequest(
        @NotBlank @Size(max = 120) String name,
        @NotBlank String strategy,
        @DecimalMin("1000.00") @DecimalMax("100000.00") @Digits(integer = 6, fraction = 2) BigDecimal budgetLimit
) {}
