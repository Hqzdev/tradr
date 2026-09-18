package dev.tradr.backend.auth.repository;

import dev.tradr.backend.auth.domain.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

// JpaRepository сам даёт save/findById/findAll/delete — их не пишем руками,
// Spring Data сгенерирует реализацию по одной этой сигнатуре.
public interface AccountRepository extends JpaRepository<Account, UUID> {
    // Нужен, чтобы по пользователю найти его демо-счёт (баланс) — например,
    // сразу после логина или для показа баланса в терминале.
    Optional<Account> findByUserId(UUID userId);
}
