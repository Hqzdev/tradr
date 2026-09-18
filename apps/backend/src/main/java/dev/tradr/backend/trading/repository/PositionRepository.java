package dev.tradr.backend.trading.repository;

import dev.tradr.backend.trading.domain.Position;
import dev.tradr.backend.trading.domain.PositionId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PositionRepository extends JpaRepository<Position, PositionId> {
    List<Position> findByIdAccountId(UUID accountId);
}
