package dev.tradr.backend.agents.web.dto;
import java.time.Instant; import java.util.UUID;
public record DecisionResponse(Long id,UUID agentId,String action,String reason,String rules,UUID orderId,Instant timestamp){}
