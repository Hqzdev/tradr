package dev.tradr.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

// app.cors.allowed-origins в application.yml биндится из
// CORS_ALLOWED_ORIGINS (список через запятую — Spring сам разбивает
// строку в List<String> для @ConfigurationProperties).
// БЕЗ @Component — см. подробное объяснение в auth/JwtProperties.java.
// Регистрируется через common/ConfigPropertiesConfig.java.
@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(List<String> allowedOrigins) {}
