package dev.tradr.backend.agents.web.dto;
import jakarta.validation.constraints.NotBlank;
public record CreateAgentRequest(@NotBlank String name,@NotBlank String strategy){}
