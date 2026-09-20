package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AgentPositionRepository extends JpaRepository<AgentPosition, AgentPositionId> {
    List<AgentPosition> findByIdAgentId(UUID agentId);
    long countByIdAgentId(UUID agentId);
}
