package dev.tradr.backend.simulation.web.dto;
import jakarta.validation.constraints.NotBlank;
public record CreateDatasetRequest(@NotBlank String name,@NotBlank String ticker){}
