# Актуальный API-контракт

Базовый адрес: `/api/v1`. Защищённые запросы используют заголовок:

```text
Authorization: Bearer <accessToken>
```

Ошибки возвращаются в виде `{ "message": "Понятный текст" }`.

## Авторизация

### POST /auth/register

```json
{
  "email": "user@example.com",
  "password": "secret123",
  "displayName": "Ярослав",
  "firstAgent": {
    "name": "Стартовый агент",
    "strategy": "careful",
    "budgetLimit": 75000
  }
}
```

Возвращает `accessToken`, `refreshToken`, `user` и необязательный
`firstAgentId`. `firstAgent` необязателен для старых клиентов.

- `POST /auth/login` — вход;
- `POST /auth/refresh` — ротация refresh token;
- `POST /auth/logout` — отзыв refresh token;
- `GET /auth/me` — текущий пользователь.

## Dashboard

- `GET /dashboard` — общий капитал, резерв, цель, P&L, скорость, агенты и
  последние события;
- `PATCH /account/preferences` — меняет `goalValue` и/или
  `accelerationEnabled`.

Пример:

```json
{ "goalValue": 120000, "accelerationEnabled": true }
```

## Агенты

- `GET /agents` — неархивные агенты пользователя;
- `POST /agents` — создать остановленного агента и выделить бюджет;
- `GET /agents/{id}` — карточка агента;
- `POST /agents/{id}/start` — запустить;
- `POST /agents/{id}/pause` — поставить на паузу;
- `POST /agents/{id}/close` — продать позиции, вернуть деньги, архивировать;
- `PATCH /agents/{id}/allocation` — изменить капитал остановленного агента;
- `GET /agents/{id}/performance` — кошелёк, позиции, P&L и кривая;
- `GET /agents/{id}/log?limit=50` — журнал решений;
- `GET /agents/{id}/character|budget|skills` — части конфигурации.

Создание:

```json
{
  "name": "Импульс",
  "strategy": "aggressive",
  "budgetLimit": 25000
}
```

Бюджет разрешён от 1 000 до 100 000 USD и не может превышать резерв.

## Рынок

- `GET /market/indices` — учебные индексы;
- `GET /instruments` — все акции;
- `GET /instruments/{ticker}` — подробности;
- `GET /instruments/{ticker}/quote` — текущая цена;
- `GET /instruments/{ticker}/candles?timeframe=5m&limit=100` — свечи;
- `GET /instruments/{ticker}/news` — учебные новости;
- `WS /ws/market/{ticker}` — поток котировок.

Разрешённые таймфреймы: `1m`, `5m`, `15m`, `1h`, `1d`.

## История торговли: только чтение

- `GET /orders?status=&agentId=` — заявки;
- `GET /trades?limit=&before=&agentId=` — сделки;
- `GET /trades/stats` — агрегаты;
- `GET /portfolio` — совместимый общий снимок;
- `GET /portfolio/{ticker}` — совместимый просмотр позиции.

В публичном Controller нет `POST /orders`, preview и отмены ручной заявки.
Новые операции создаются только через `executeAgentOrder` внутри backend.

## Безопасность владения

Каждый защищённый метод получает UUID пользователя из проверенного JWT.
Перед чтением или изменением агент ищется по паре `agentId + accountId`.
Переданный чужой UUID не даёт доступ к чужим данным.

## WebSocket

Пример адреса:

```text
ws://localhost:8080/ws/market/AAPL
```

В продакшене на HTTPS-странице нужен `wss://`.
