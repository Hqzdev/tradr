package dev.tradr.backend.auth.repository;

import dev.tradr.backend.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    // Нужен на /refresh и /logout — клиент присылает сырой токен, мы
    // хэшируем его тем же способом, что при выдаче, и ищем по хэшу (сам
    // токен в базе не хранится, см. AuthService.hash()).
    Optional<RefreshToken> findByTokenHash(String tokenHash);
}
