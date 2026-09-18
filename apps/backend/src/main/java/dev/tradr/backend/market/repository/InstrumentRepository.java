package dev.tradr.backend.market.repository;

import dev.tradr.backend.market.domain.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InstrumentRepository extends JpaRepository<Instrument, UUID> {
    Optional<Instrument> findByTickerIgnoreCase(String ticker);

    List<Instrument> findAllByOrderByTickerAsc();
}
