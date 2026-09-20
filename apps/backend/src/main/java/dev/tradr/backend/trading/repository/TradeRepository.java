package dev.tradr.backend.trading.repository;

import dev.tradr.backend.trading.domain.Trade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
    List<Trade> findByAccountIdAndExecutedAtBeforeOrderByExecutedAtDesc(UUID accountId, Instant before, Pageable pageable);
    List<Trade> findByAccountIdAndInstrumentIdOrderByExecutedAtDesc(UUID accountId, UUID instrumentId);
    List<Trade> findByAccountIdAndExecutedAtAfter(UUID accountId, Instant executedAt);

    @Query(value = """
            SELECT COALESCE(SUM(
                CASE WHEN t.side = 'BUY'
                    THEN (t.quantity * t.price) + t.commission
                    ELSE -((t.quantity * t.price) - t.commission)
                END
            ), 0)
            FROM trades t
            JOIN orders o ON o.id = t.order_id
            WHERE o.source_agent_id = :agentId
            """, nativeQuery = true)
    BigDecimal netAgentExposure(@Param("agentId") UUID agentId);
}
