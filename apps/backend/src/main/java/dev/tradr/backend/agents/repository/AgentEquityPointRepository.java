package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.AgentEquityPoint;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AgentEquityPointRepository extends JpaRepository<AgentEquityPoint, Long> {
    List<AgentEquityPoint> findByAgentIdOrderByCapturedAtDesc(UUID agentId, Pageable pageable);
}
