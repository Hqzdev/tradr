package dev.tradr.backend.market.repository;

import dev.tradr.backend.market.domain.Candle;
import dev.tradr.backend.market.domain.Timeframe;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CandleRepository extends JpaRepository<Candle, Long> {
    List<Candle> findByInstrumentIdAndTimeframeOrderByBucketStartDesc(UUID instrumentId, Timeframe timeframe, Pageable pageable);

    Optional<Candle> findFirstByInstrumentIdAndTimeframeOrderByBucketStartDesc(UUID instrumentId, Timeframe timeframe);

    Optional<Candle> findByInstrumentIdAndTimeframeAndBucketStart(UUID instrumentId, Timeframe timeframe, Instant bucketStart);

    boolean existsByInstrumentIdAndTimeframe(UUID instrumentId, Timeframe timeframe);
}
