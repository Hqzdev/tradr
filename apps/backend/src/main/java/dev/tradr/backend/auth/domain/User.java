package dev.tradr.backend.auth.domain;

import jakarta.persistence.*; // надо для работы с базой данных
import java.time.Instant; // надо для работы с датой и временем
import java.util.UUID; // надо для генерации уникальных идентификаторов

@Entity // указывает, что класс является сущностью JPA
@Table(name = "users")

public class User {

    @Id
    @GeneratedValue
    private UUID id; // уникальный идентификатор пользователя, который будет автоматически генерироваться при создании нового пользователя

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false) // нуллабле фалз потому что пароль обязателен для регистрации
    private String passwordHash; // хэш пароля пользователя, который будет храниться в базе

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "created_at", nullable = false, updatable = false) // было "@column" с маленькой буквы — аннотации регистрозависимы, так не компилировалось
    private Instant createdAt = Instant.now();

    protected User() {} // для jpa - jpa это фреймворк для работы с базой данных, который использует рефлексию для создания объектов, поэтому нужен конструктор без параметров

    public User(String email, String passwordHash, String displayName) { // конструктор для создания нового пользователя
        this.email = email;
        this.passwordHash = passwordHash;
        this.displayName = displayName;
    }

    // геттеры - без сеттера на id потому что id генерируется автоматически и не должен изменяться
    public UUID getId() { return id; } // даем айди пользователю, чтобы он мог его использовать для идентификации себя в системе
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getDisplayName() { return displayName; }
    public Instant getCreatedAt() { return createdAt; }
}
