package dev.tradr.backend.auth.repository;

import dev.tradr.backend.auth.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    // Нужен при логине — ищем пользователя по email, который он ввёл в форму.
    Optional<User> findByEmail(String email);

    // Нужен при регистрации — проверить email на занятость до создания
    // пользователя, чтобы не ловить ошибку уникальности из самой базы.
    boolean existsByEmail(String email);
}
