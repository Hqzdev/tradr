package dev.tradr.backend.market.repository;

import dev.tradr.backend.market.domain.IndexQuote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface IndexQuoteRepository extends JpaRepository<IndexQuote, UUID> {
    List<IndexQuote> findAllByOrderBySortOrderAsc();
}
