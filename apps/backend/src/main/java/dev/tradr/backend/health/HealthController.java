package dev.tradr.backend.health;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

// Простой пинг-эндпоинт, чтобы проверить, что сервер вообще поднялся —
// используется в docker-compose healthcheck и вручную через curl.
// Публичный (см. SecurityConfig.PUBLIC_PATHS) — токен не требуется.
@RestController
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "ok";
    }
}
