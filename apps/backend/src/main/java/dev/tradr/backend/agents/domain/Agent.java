package dev.tradr.backend.agents.domain;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
@Entity @Table(name = "agents")
public class Agent {
 @Id @GeneratedValue private UUID id;
 @Column(name="account_id", nullable=false) private UUID accountId;
 @Column(nullable=false) private String name;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private AgentStrategy strategy;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private AgentStatus status = AgentStatus.ACTIVE;
 @Column(name="risk_level", nullable=false) private String riskLevel;
 @Column(name="created_at", nullable=false, updatable=false) private Instant createdAt = Instant.now();
 protected Agent() {}
 public Agent(UUID accountId,String name,AgentStrategy strategy,String riskLevel){this.accountId=accountId;this.name=name;this.strategy=strategy;this.riskLevel=riskLevel;}
 public void setStatus(AgentStatus status){this.status=status;}
 public UUID getId(){return id;} public UUID getAccountId(){return accountId;} public String getName(){return name;} public AgentStrategy getStrategy(){return strategy;} public AgentStatus getStatus(){return status;} public String getRiskLevel(){return riskLevel;} public Instant getCreatedAt(){return createdAt;}
}
