package dev.tradr.backend.config;

import dev.tradr.backend.auth.security.JwtProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// Единая точка регистрации всех *Properties-классов (JwtProperties,
// CorsProperties). Явный @EnableConfigurationProperties надёжнее, чем
// @Component на самом record'е — гарантирует, что Spring создаст бин через
// биндинг настроек из application.yml, а не попытается через обычный DI
// найти бины для String/long-параметров конструктора и упасть.
@Configuration
@EnableConfigurationProperties({JwtProperties.class, CorsProperties.class})
public class ConfigPropertiesConfig {
}
