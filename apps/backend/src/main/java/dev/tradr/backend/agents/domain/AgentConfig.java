package dev.tradr.backend.agents.domain;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.UUID;
@Entity @Table(name="agent_configs")
public class AgentConfig {
 @Id @Column(name="agent_id") private UUID agentId;
 @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition="jsonb",nullable=false) private String character;
 @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition="jsonb",nullable=false) private String budget;
 @JdbcTypeCode(SqlTypes.JSON) @Column(columnDefinition="jsonb",nullable=false) private String skills;
 protected AgentConfig() {}
 public AgentConfig(UUID agentId,String character,String budget,String skills){this.agentId=agentId;this.character=character;this.budget=budget;this.skills=skills;}
 public String getCharacter(){return character;} public String getBudget(){return budget;} public String getSkills(){return skills;}
}
