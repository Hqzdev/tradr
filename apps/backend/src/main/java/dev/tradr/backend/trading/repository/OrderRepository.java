package dev.tradr.backend.trading.repository;

import dev.tradr.backend.trading.domain.Order;
import dev.tradr.backend.trading.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByAccountIdOrderByCreatedAtDesc(UUID accountId);
    List<Order> findByAccountIdAndStatusOrderByCreatedAtDesc(UUID accountId, OrderStatus status);
    List<Order> findByAccountIdAndInstrumentIdAndStatus(UUID accountId, UUID instrumentId, OrderStatus status);
    List<Order> findByInstrumentIdAndStatusOrderByCreatedAtAsc(UUID instrumentId, OrderStatus status);
    Optional<Order> findByIdAndAccountId(UUID id, UUID accountId);
}
