package dev.tradr.backend.auth.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

// Читает app.jwt.* из application.yml (там — из переменных окружения
// JWT_SECRET / JWT_ACCESS_TTL_MIN / JWT_REFRESH_TTL_DAYS, см. .env.example).
// БЕЗ @Component: на record'е с @ConfigurationProperties он не гарантирует
// правильный биндинг — Spring может попытаться создать бин обычным DI и
// упасть с "required a bean of type 'java.lang.String'", ища бин для secret,
// вместо того чтобы прочитать его из application.yml. Регистрируется явно
// через @EnableConfigurationProperties в common/ConfigPropertiesConfig.java.
@ConfigurationProperties(prefix = "app.jwt")
public record JwtProperties(
        String secret,
        long accessTtlMinutes,
        long refreshTtlDays
) {}
