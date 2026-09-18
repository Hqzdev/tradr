package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.AgentConfig; import org.springframework.data.jpa.repository.JpaRepository; import java.util.UUID;
public interface AgentConfigRepository extends JpaRepository<AgentConfig,UUID>{}
