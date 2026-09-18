package dev.tradr.backend.auth.domain;

import jakarta.persistence.*; // надо для работы с базой данных
import java.time.Instant; // надо для работы с датой и временем
import java.util.UUID; // надо для генерации уникальных идентификаторов

//тут у нас айди, юзерайди, токенхеш, когда истекает, ревокед и дата создания
@Entity // указывает, что класс является сущностью JPA
@Table(name = "refresh_tokens") // имя таблицы из миграции — refresh_tokens, не "RefreshToken"

public class RefreshToken {

    @Id
    @GeneratedValue
    private UUID id; // уникальный идентификатор токена, который будет автоматически генерироваться при создании нового токена

    @Column(name = "user_id", nullable = false) // нуллабле фалз потому что айди пользователя обязателен для создания токена
    private UUID userId; // уникальный идентификатор пользователя, который будет использоваться для связи токена с пользователем

    @Column(name = "token_hash", nullable = false, unique = true) // нуллабле фалз потому что хэш токена обязателен для создания токена; уникален — как в миграции
    private String tokenHash; // хэш токена (не сам токен!), который будет храниться в базе

    @Column(name = "expires_at", nullable = false) // нуллабле фалз потому что дата истечения токена обязателен для создания токена
    private Instant expiresAt; // дата и время истечения токена, которая будет храниться в базе

    @Column(name = "revoked_at") // ревокед может быть нуллабле потому что токен может быть ещё не отозван
    private Instant revokedAt; // дата и время отзыва токена, которая будет храниться в базе

    @Column(name = "created_at", nullable = false, updatable = false) // нуллабле фалз потому что дата создания обязателен для регистрации, апдейтабл фалз потому что дата создания не должна изменяться
    private Instant createdAt = Instant.now(); // дата и время создания токена, которая будет храниться в базе

    protected RefreshToken() {} // для jpa - jpa это фреймворк для работы с базой данных, который использует рефлексию для создания объектов, поэтому нужен конструктор без параметров

    public RefreshToken(UUID userId, String tokenHash, Instant expiresAt) { // конструктор для создания нового токена
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    // Единственное поле, которое меняется после создания: отзыв токена
    // при logout или при ротации (выдаче нового refresh-токена в /auth/refresh).
    // Метод, а не публичный сеттер — так в одном месте видно единственную
    // разрешённую мутацию этой сущности.
    public void revoke() {
        this.revokedAt = Instant.now();
    }

    // геттеры - без сеттера на id потому что id генерируется автоматически и не должен изменяться
    public UUID getId() { return id; } // даем айди токену, чтобы он мог его использовать для идентификации себя в системе
    public UUID getUserId() { return userId; }
    public String getTokenHash() { return tokenHash; }
    public Instant getExpiresAt() { return expiresAt; }
    public Instant getRevokedAt() { return revokedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
