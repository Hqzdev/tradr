package dev.tradr.backend.agents.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name="agent_decision_logs")
public class AgentDecisionLog {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="agent_id",nullable=false) private UUID agentId;
 @Column(name="simulation_id") private UUID simulationId;
 @Column(nullable=false) @Enumerated(EnumType.STRING) private AgentAction action;
 @Column(nullable=false) private String reason;
 @JdbcTypeCode(SqlTypes.JSON) @Column(name="rules_evaluated",columnDefinition="jsonb",nullable=false) private String rules;
 @Column(name="related_order_id") private UUID relatedOrderId;
 @Column(name="ts",nullable=false) private Instant timestamp=Instant.now();
 protected AgentDecisionLog(){}
 public AgentDecisionLog(UUID agentId,AgentAction action,String reason,String rules,UUID orderId){this.agentId=agentId;this.action=action;this.reason=reason;this.rules=rules;this.relatedOrderId=orderId;}
 public Long getId(){return id;} public UUID getAgentId(){return agentId;} public AgentAction getAction(){return action;} public String getReason(){return reason;} public String getRules(){return rules;} public UUID getRelatedOrderId(){return relatedOrderId;} public Instant getTimestamp(){return timestamp;}
}
