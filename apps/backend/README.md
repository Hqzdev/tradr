# TRADR — backend

Phase 0 (скелет) и Phase 1 (auth) сделал Claude по прямой просьбе — обычно
код в `src/` пишет Ярослав сам, Claude готовит спецификацию в `docs/` и
подсказывает. Дальше, с Phase 2, снова по умолчанию: пишет Ярослав.

## Что уже готово

### Phase 0 — скелет
- `pom.xml` — Maven, Spring Boot 4.1.x, Java 21.
- `BackendApplication.java`, `common/HealthController.java` (`GET /health`).
- `application.yml`, `V1__init.sql` (пустая baseline-миграция), `Dockerfile`,
  `docker-compose.dev.yml` (Postgres + Adminer), `.env.example`, `.gitignore`.
- Maven Wrapper уже включён. Для обычного локального запуска используй
  `npm run dev`; без npm можно вызвать `./mvnw spring-boot:run`.

### Phase 1 — auth
- **Сущности** (`auth/`): `User`, `Account`, `RefreshToken` — под миграцию
  `V2__auth.sql` (таблицы `users`, `accounts`, `refresh_tokens`). Баланс —
  `BigDecimal`, не `double`; новый аккаунт начинается с нулевого баланса.
- **Репозитории**: `UserRepository`, `AccountRepository`, `RefreshTokenRepository`.
- **JWT**: `JwtProperties` (`app.jwt.*` из `.env`), `JwtService` (генерация и
  проверка access-токена, HS256), `JwtAuthenticationFilter` (разбирает
  `Authorization: Bearer <jwt>`, кладёт `userId` в `SecurityContext`).
- **Refresh-токены** — не JWT: случайная строка (32 байта), в БД хранится
  только её SHA-256-хэш. `/auth/refresh` делает ротацию — старый токен
  гасится, выдаётся новый.
- **`AuthService`**: `register` (создаёт `User` + `Account` с нулевым
  балансом), `login` (BCrypt), `refresh`, `logout`, `me`.
- **`AuthController`** (`/api/v1/auth/*`): `POST /register`, `POST /login`,
  `POST /refresh`, `POST /logout`, `GET /me`.
- **`common/SecurityConfig`** — реальная JWT-цепочка (заменила временный
  `permitAll()` из Phase 0): публично доступны только `/health` и
  `/api/v1/auth/{register,login,refresh,logout}`; `/api/v1/auth/me` и все
  будущие эндпоинты — только с валидным токеном. CORS настроен из
  `app.cors.allowed-origins` (`.env`: `CORS_ALLOWED_ORIGINS`).
- **`common/GlobalExceptionHandler`** — единый формат ошибок
  (`{"message": "..."}`), коды: 409 (email занят), 401 (неверные
  креды/токен), 400 (провал валидации `@Valid`).
- Исключения (`EmailAlreadyExistsException`, `InvalidCredentialsException`,
  `InvalidRefreshTokenException`) — обычные `RuntimeException`, ловятся
  в `GlobalExceptionHandler`.

### Phase 2 — рынок
- **Схема рынка**: `V3__market.sql` создаёт `instruments`, `candles` и
  `index_quotes`; `V4__fix_instrument_currency_type.sql` приводит тип валюты
  к JPA-модели. В базе есть шесть акций и три индекса.
- **SyntheticMarketDataProvider**: создаёт детерминированную историю свечей
  для пяти таймфреймов и повторяемый сценарий live-тиков.
- **Tick engine**: обновляет минутную свечу каждые 2,6 секунды и рассылает
  изменения подписчикам конкретного тикера.
- **REST**: `GET /api/v1/market/indices`, `/api/v1/instruments`,
  `/api/v1/instruments/{ticker}`, `/quote`, `/candles`, `/news`.
- **WebSocket**: `WS /ws/market/{ticker}` отдаёт начальную котировку при
  подключении и последующие тики.

### Phase 3 — заявки, сделки и портфель
- **Схема торговли**: `V5__trading.sql` создаёт `orders`, `trades` и
  `positions`. Flyway применяет миграцию при старте backend.
- **Расчёт заявки**: Java-версия прежнего `OrderCalculator` считает дробные
  акции, цену и комиссию 0.1% с тем же округлением.
- **Заявки**: рыночные исполняются сразу; лимитные ждут нужную цену,
  проверяются на каждом тике и могут быть отменены до исполнения.
- **REST**: `POST /orders/preview`, `POST /orders`, `GET /orders`,
  `DELETE /orders/{id}`, `GET /trades`, `/trades/stats`, `GET /portfolio`,
  `GET /portfolio/{ticker}`.
- **Портфель**: после сделки меняются баланс, история и средняя цена позиции.

### Phase 4–5 — агенты и симуляции
- **Агенты**: таблицы `agents`, `agent_configs`, `agent_decision_logs`; API
  создания, управления и журнала решений.
- **Симуляции**: датасеты, backtest, сохранённые результаты и CSV-экспорт.
- Миграция `V6__agents_and_simulations.sql` создаёт обе части схемы.

## С чего начать (проверить, что всё живое)

1. Postgres: `docker compose -f docker-compose.dev.yml up -d`.
2. `.env` уже должен быть (`cp .env.example .env`, если ещё нет) — **замени
   `JWT_SECRET`** на настоящую случайную строку не короче 32 символов,
   плейсхолдер `change_me_...` не годится даже для локального теста дольше
   одного раза (это ключ подписи JWT — с ним подделывается любой токен).
3. Запусти `npm run dev`. Скрипт сам передаст `.env` в JVM.
4. Проверь Flyway: в логах должно быть
   `Successfully applied 2 migrations` (было 1, теперь `V1` + `V2__auth`).
5. Проверь весь цикл:

```bash
# регистрация — вернёт accessToken + refreshToken + user
curl -s -X POST localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","displayName":"Тест"}'

# логин
curl -s -X POST localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# /me — подставь accessToken из ответа выше
curl -s localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"

# без токена /me должен вернуть 401/403, не 200 и не 500
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/api/v1/auth/me

# refresh — подставь refreshToken из register/login
curl -s -X POST localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'

# повторный вызов с ТЕМ ЖЕ refreshToken должен теперь провалиться —
# ротация его уже погасила
curl -s -X POST localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<тот же refreshToken>"}'
```

6. **Готово с Phase 1**, если все шесть команд ведут себя как описано, — тогда
   переходи к `docs/04-roadmap.md`, Phase 2 (рынок, синтетический генератор
   цен, `/instruments`, `/instruments/{ticker}/candles`, WebSocket-тики).
   Дальше пишешь сам.

7. **Проверка Phase 2**:

```bash
curl -s localhost:8080/api/v1/market/indices | jq
curl -s localhost:8080/api/v1/instruments | jq
curl -s 'localhost:8080/api/v1/instruments/AAPL/candles?timeframe=5m&limit=24' | jq
```

## Документы

- `docs/00-overview.md` — вердикт, стек, архитектура целиком, честная оценка объёма
- `docs/01-data-model.md` — сущности, поля, связи
- `docs/02-api-contract.md` — REST/WS эндпоинты по каждому экрану сайта
- `docs/03-market-data-and-agents-engine.md` — источник рыночных данных + движок торговых агентов
- `docs/04-roadmap.md` — фазы разработки до MVP
- `docs/05-frontend-integration.md` — как переключать фронт с моков на реальный API
- `docs/06-phase-2-market.md` — Phase 2 простыми словами: рынок, API, свечи и WebSocket
- `docs/07-phase-3-trading.md` — Phase 3 простыми словами: заявки, сделки и портфель
- `docs/08-phase-4-agents.md` — Phase 4 простыми словами: агенты
- `docs/09-phase-5-simulations.md` — Phase 5 простыми словами: симуляции

## Структура

```
backend/
  src/main/java/dev/tradr/backend/
    BackendApplication.java
    common/
      HealthController.java
      SecurityConfig.java        # реальная JWT-цепочка (Phase 1)
      GlobalExceptionHandler.java
      CorsProperties.java
      ErrorResponse.java
    auth/                        # Phase 1 — готово
      User.java, Account.java, RefreshToken.java
      UserRepository.java, AccountRepository.java, RefreshTokenRepository.java
      JwtProperties.java, JwtService.java, JwtAuthenticationFilter.java
      AuthService.java, AuthController.java
      EmailAlreadyExistsException.java, InvalidCredentialsException.java,
      InvalidRefreshTokenException.java
      dto/
        RegisterRequest.java, LoginRequest.java, RefreshRequest.java,
        AuthResponse.java, UserResponse.java
      README.md
    market/        # Phase 2 — инструменты, свечи, synthetic provider, REST и WS
    trading/        # Phase 3
    agents/        # Phase 4
    simulation/      # Phase 5
    teams/          # Phase 6
    settings/       # Phase 7
  src/main/resources/
    application.yml
    db/migration/
      V1__init.sql
      V2__auth.sql
  src/test/java/dev/tradr/backend/
  Dockerfile
  docker-compose.dev.yml
  pom.xml
```
