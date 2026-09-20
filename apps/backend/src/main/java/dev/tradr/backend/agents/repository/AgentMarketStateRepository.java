package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface AgentMarketStateRepository extends JpaRepository<AgentMarketState, AgentPositionId> {}
