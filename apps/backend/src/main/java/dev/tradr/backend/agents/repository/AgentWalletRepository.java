package dev.tradr.backend.agents.repository;
import dev.tradr.backend.agents.domain.AgentWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface AgentWalletRepository extends JpaRepository<AgentWallet, UUID> {}
