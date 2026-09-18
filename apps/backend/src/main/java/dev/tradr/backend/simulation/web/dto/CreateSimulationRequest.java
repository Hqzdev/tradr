package dev.tradr.backend.simulation.web.dto;
import java.math.BigDecimal; import java.util.List; import java.util.UUID;
public record CreateSimulationRequest(String name,UUID datasetId,String mode,List<UUID> agentIds,BigDecimal startingCapital,Integer speed){}
