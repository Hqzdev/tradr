package dev.tradr.backend.trading.repository;

import dev.tradr.backend.trading.domain.Trade;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
    List<Trade> findByAccountIdAndExecutedAtBeforeOrderByExecutedAtDesc(UUID accountId, Instant before, Pageable pageable);
    List<Trade> findByAccountIdAndInstrumentIdOrderByExecutedAtDesc(UUID accountId, UUID instrumentId);
    List<Trade> findByAccountIdAndExecutedAtAfter(UUID accountId, Instant executedAt);
}
