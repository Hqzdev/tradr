# TRADR backend

Spring Boot backend для учебной агентской торговли. Он создаёт пользователей,
учебные счета и агентов, генерирует синтетический рынок и исполняет сделки
только от имени агентов.

## Требования

- Java 21;
- Docker или OrbStack;
- PostgreSQL из `docker-compose.dev.yml`;
- заполненный `.env` на основе `.env.example`.

## Запуск

Из корня репозитория:

```bash
cp apps/backend/.env.example apps/backend/.env
docker compose -f apps/backend/docker-compose.dev.yml up -d
npm install
npm run dev:backend
```

Проверка:

```bash
curl -s http://localhost:8080/health
curl -s http://localhost:8080/api/v1/instruments
```

## Модули

- `auth` — пользователи, BCrypt, JWT и refresh tokens;
- `dashboard` — капитал, цель, резерв и общая активность;
- `market` — 18 инструментов, свечи, synthetic provider и WebSocket;
- `agents` — стратегии, кошельки, позиции, P&L и журнал;
- `trading` — исполнение агентских сделок и read-only история;
- `common` — единые ошибки;
- `config` — Security, CORS и WebSocket.

## Основные правила

- новый Account получает 100 000 USD;
- первый агент обычно получает 75 000 USD и создаётся остановленным;
- ручные POST-заявки не опубликованы;
- все новые сделки связаны с агентом;
- деньги считаются через `BigDecimal`;
- схему меняет Flyway, Hibernate только проверяет;
- рынок синтетический, реальный провайдер пока не подключён.

## Тесты

```bash
./mvnw test
```

## Документация

- `docs/00-overview.md` — архитектура и текущие возможности;
- `docs/01-data-model.md` — таблицы и владение капиталом;
- `docs/02-api-contract.md` — REST и WebSocket;
- `docs/03-market-data-and-agents-engine.md` — тики и решения;
- `docs/04-roadmap.md` — следующие этапы;
- `docs/05-frontend-integration.md` — связь с Next.js;
- `docs/06-phase-2-market.md` — подробности рынка;
- `docs/07-phase-3-trading.md` — подробности исполнения;
- `docs/08-phase-4-agents.md` — жизненный цикл агента;
- `docs/09-terminal-and-agents.md` — актуальные ограничения.

Документация на сайте доступна по `/docs` и написана для читателя без опыта
работы с Java.
