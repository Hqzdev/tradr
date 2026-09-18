package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface AgentRepository extends JpaRepository<Agent,UUID>{ List<Agent> findByAccountIdOrderByCreatedAtDesc(UUID accountId); List<Agent> findByStatus(AgentStatus status); Optional<Agent> findByIdAndAccountId(UUID id,UUID accountId); }
