# Модель данных

Ориентир на JPA-энтити + Flyway-миграции. Типы — Postgres-типы, не Java (сам
подберёшь `BigDecimal` vs `numeric`, `Instant` vs `timestamptz` и т.д. — тут
важны поля и связи, не синтаксис).

Деньги и количество акций — **никогда не `double`/`float`**. `OrderCalculator.ts`
на фронте уже считает через `BigInt` с фиксированным масштабом именно поэтому —
округление копейки на реальных (пусть и виртуальных) деньгах должно быть
детерминированным. На бэкенде — `BigDecimal` с явным `scale` (2 для денег, 8
для количества акций), `RoundingMode.HALF_UP`, те же правила, что в
`OrderCalculator.calculate()`: комиссия = 0.1% от суммы сделки, округление
вверх до цента.

## Auth / пользователи

**User**
- id (uuid, pk)
- email (unique, not null)
- password_hash (not null)
- display_name (not null)
- created_at

**RefreshToken**
- id (uuid, pk)
- user_id (fk → User)
- token_hash (unique)
- expires_at
- revoked_at (nullable)
- user_agent

**Account** (одна запись на пользователя в MVP, но не хардкодь
1:1 в схеме — когда-нибудь понадобятся несколько счетов)
- id (uuid, pk)
- user_id (fk → User)
- cash_balance (numeric(18,2), default 0.00)
- currency (default 'USD')
- created_at

## Рынок

**Instrument**
- id (uuid, pk)
- ticker (unique, e.g. "AAPL")
- name
- exchange
- type (enum: stock/etf/crypto/index)
- currency

**Candle**
- id (bigserial, pk)
- instrument_id (fk)
- timeframe (enum: 1m/5m/15m/1h/1d)
- bucket_start (timestamptz)
- open, high, low, close (numeric(18,4))
- volume (bigint)
- unique(instrument_id, timeframe, bucket_start)
- индекс по (instrument_id, timeframe, bucket_start desc) — это основной
  паттерн чтения (последние N свечей для графика)

Текущая цена не хранится отдельной таблицей — это последняя `close`
последней 1m-свечи, либо in-memory кэш (см. `03-market-data-and-agents-engine.md`),
который раз в интервал материализуется в Candle.

**IndexQuote** (S&P 500, NASDAQ, DOW — верхняя плашка рынка)
- id, name, value (текстом, как в фикстурах — это витрина, не торгуемый
  инструмент), change_percent, updated_at

## Торговля

**Order**
- id (uuid, pk)
- account_id (fk)
- instrument_id (fk)
- side (enum: buy/sell)
- order_type (enum: market/limit)
- quantity (numeric(18,8))
- limit_price (numeric(18,4), nullable)
- status (enum: open/filled/cancelled)
- source (enum: manual/agent) + source_agent_id (fk → Agent, nullable)
- created_at, filled_at (nullable)

**Trade** (исполнение ордера — в MVP ордер исполняется мгновенно по
рыночной цене, поэтому Order и Trade почти 1:1, но раздельные таблицы
оставляют путь к частичным исполнениям и лимитным заявкам, которые ждут)
- id (uuid, pk)
- order_id (fk)
- account_id, instrument_id (денормализовано для быстрых выборок истории)
- side, quantity, price, commission (numeric(18,2))
- executed_at

**Position** (материализованное состояние — держать как таблицу, не
пересчитывать каждый раз агрегацией по Trade; обновлять транзакционно
при каждом Trade)
- account_id, instrument_id (составной pk)
- quantity (numeric(18,8))
- avg_price (numeric(18,4))
- updated_at

## Агенты

**Agent**
- id (uuid, pk)
- account_id (fk, владелец)
- name
- strategy (enum: aggressive/careful/random/custom)
- status (enum: active/paused/error)
- risk_level (enum: low/medium/high)
- created_at

**AgentConfig** (то, что заполняется в мастере создания — экраны
character/budget/skills)
- agent_id (pk, fk)
- character (jsonb — параметры "личности"/порогов принятия решений,
  структуру бери из `psychologyData.ts: characterInfo`)
- budget (jsonb — лимиты капитала/риска, из `budgetInfo`)
- skills (jsonb — из `skillsInfo`)

Почему jsonb, а не нормализованные таблицы: эти параметры — конфиг
стратегии, не то, что запрашивается отдельными SQL-фильтрами. Нормализуешь,
если появится реальная потребность (аналитика "какие пороги дают лучший
результат" и т.п.) — не раньше.

**AgentDecisionLog**
- id (bigserial, pk)
- agent_id (fk)
- simulation_id (fk, nullable — null для live-режима на реальном счёте)
- ts (timestamptz)
- action (enum: buy/sell/wait)
- reason (text)
- rules_evaluated (jsonb — массив {label, ok}, как `AgentDetailInfo.decision.rules`)
- related_order_id (fk, nullable)

Это одна таблица питает и "Журнал" (агрегированный фид), и "Лог сессии"
агента (тот же лог, отфильтрованный по agent_id), и ленту команды (тот же
лог, отфильтрованный по agent_id ∈ команда) — не дублируй данные под
каждый экран.

## Симуляции

**SimulationDataset**
- id (uuid, pk)
- name
- source (enum: upload/generated/provider)
- instrument_id (fk)
- range_start, range_end (timestamptz)

**Simulation**
- id (uuid, pk)
- account_id (fk)
- name
- dataset_id (fk, nullable — null для live-симуляции на текущем рынке)
- mode (enum: live/backtest)
- status (enum: pending/running/completed/failed)
- config (jsonb — какие агенты участвуют, стартовый капитал, скорость)
- started_at, ended_at (nullable)

**SimulationResult**
- simulation_id (pk, fk)
- metrics (jsonb — per-agent pnl/winrate/drawdown, как `simResults`)
- equity_curve (jsonb или отдельная таблица `SimulationEquityPoint(simulation_id, day, agent_id, value)`,
  если понадобится построчно тянуть для графика — начни с jsonb, вынеси
  в таблицу, если графики начнут тормозить)

## Команды

**Team**
- id (uuid, pk), name, owner_id (fk → User), created_at

**TeamMembership**
- team_id, user_id (составной pk), role (enum: owner/member), joined_at

TeamFeed — отдельной таблицы не нужно, это `AgentDecisionLog`, отфильтрованный
по агентам команды (см. выше).

## Настройки

Одна таблица на пользователя с jsonb-секциями — из семи settings-экранов
только "Безопасность" (смена пароля) требует отдельной логики (проверка
текущего пароля, re-hash), остальное — конфиг:

**UserSettings**
- user_id (pk, fk)
- notifications (jsonb)
- trading (jsonb — дефолтные параметры ордеров и т.п.)
- market_data (jsonb — `{ provider: "synthetic" | "finnhub" }`, отражает
  `MARKET_DATA_PROVIDER`, но per-user переключатель, не только env)
- display (jsonb)
- metrics (jsonb)

## Связи — сводно

```
User 1—1 Account 1—N Position
User 1—N Agent (через Account)
User 1—N Order, 1—N Trade (через Account)
Agent 1—1 AgentConfig
Agent 1—N AgentDecisionLog
Agent 1—N Order (source_agent_id)
Instrument 1—N Candle, 1—N Order, 1—N Position
Simulation 1—1 SimulationResult, 1—N AgentDecisionLog
Team 1—N TeamMembership N—1 User
```
