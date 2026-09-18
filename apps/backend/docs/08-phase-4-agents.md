# Phase 4: торговые агенты

## Что есть

Можно создать агента с одной из трёх стратегий: `aggressive`, `careful` или `random`. У агента есть имя, уровень риска и настройки character, budget, skills.

Активные агенты получают тики рынка. Любое решение пишется в журнал. Агрессивный агент делает небольшую первую покупку AAPL через тот же механизм, что и ручная заявка; это создаёт настоящий ордер, сделку и позицию.

## API

- `GET /api/v1/agents` — список своих агентов.
- `POST /api/v1/agents` — создать агента.
- `GET /api/v1/agents/{id}` — один агент.
- `PATCH /api/v1/agents/{id}` с `{ "status": "paused" }` — поставить на паузу.
- `DELETE /api/v1/agents/{id}` — удалить.
- `GET /api/v1/agents/{id}/character`, `/budget`, `/skills` — настройки.
- `GET /api/v1/agents/{id}/log` — журнал решений.

Пример создания:

```bash
curl -X POST localhost:8080/api/v1/agents \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Импульс","strategy":"aggressive","riskLevel":"high"}'
```

## Ограничение

Файлы frontend удалены из рабочего дерева, поэтому подключение экранов агентов и WebSocket активности пока нельзя завершить на уровне UI.
