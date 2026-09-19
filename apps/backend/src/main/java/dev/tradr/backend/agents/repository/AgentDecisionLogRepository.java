package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.AgentAction; import dev.tradr.backend.agents.domain.AgentDecisionLog; import org.springframework.data.domain.Pageable; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface AgentDecisionLogRepository extends JpaRepository<AgentDecisionLog,Long>{ List<AgentDecisionLog> findByAgentIdOrderByTimestampDesc(UUID agentId, Pageable pageable); boolean existsByAgentIdAndAction(UUID agentId, AgentAction action); }
