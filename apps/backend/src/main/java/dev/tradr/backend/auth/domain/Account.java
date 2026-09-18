package dev.tradr.backend.auth.domain;

import jakarta.persistence.*; // надо для работы с базой данных
import java.math.BigDecimal; // деньги — только BigDecimal, double/float теряют точность на дробях
import java.time.Instant; // надо для работы с датой и временем
import java.util.UUID; // надо для генерации уникальных идентификаторов

//тут у нас айди, юзерайди, баланс, валюта и дата создания
@Entity // указывает, что класс является сущностью JPA
@Table(name = "accounts") // имя таблицы должно точно совпадать с миграцией (V2__auth.sql) — там "accounts", не "Account"

public class Account {

    @Id
    @GeneratedValue
    private UUID id; // уникальный идентификатор аккаунта, который будет автоматически генерироваться при создании нового аккаунта

    @Column(name = "user_id", nullable = false, unique = true) // уникален — один пользователь = один демо-счёт в MVP
    private UUID userId; // уникальный идентификатор пользователя, который будет использоваться для связи аккаунта с пользователем

    @Column(name = "cash_balance", nullable = false) // имя колонки в БД — cash_balance, не balance
    private BigDecimal balance; // баланс аккаунта; BigDecimal, а не double — деньги нельзя хранить в плавающей точке

    @Column(nullable = false) // нуллабле фалз потому что валюта обязателен для создания аккаунта
    private String currency; // валюта аккаунта, которая будет храниться в базе

    @Column(name = "created_at", nullable = false, updatable = false) // нуллабле фалз потому что дата создания обязателен для регистрации, апдейтабл фалз потому что дата создания не должна изменяться
    private Instant createdAt = Instant.now(); // дата и время создания аккаунта, которая будет храниться в базе

    protected Account() {} // для jpa - jpa это фреймворк для работы с базой данных, который использует рефлексию для создания объектов, поэтому нужен конструктор без параметров

    public Account(UUID userId, BigDecimal balance, String currency) { // конструктор для создания нового аккаунта
        this.userId = userId;
        this.balance = balance;
        this.currency = currency;
    }

    // геттеры - без сеттера на id потому что id генерируется автоматически и не должен изменяться
    public UUID getId() { return id; } // даем айди аккаунту, чтобы он мог его использовать для идентификации себя в системе
    public UUID getUserId() { return userId; }
    public BigDecimal getBalance() { return balance; }
    public String getCurrency() { return currency; }
    public Instant getCreatedAt() { return createdAt; }

    public void debit(BigDecimal amount) {
        balance = balance.subtract(amount).setScale(2);
    }

    public void credit(BigDecimal amount) {
        balance = balance.add(amount).setScale(2);
    }
}
