# API-контракт

База: `/api/v1`. Все ответы — JSON. Аутентифицированные запросы —
`Authorization: Bearer <access_token>`. Реальный времени — WebSocket
(`/ws/...`), STOMP поверх SockJS или raw WebSocket — выбор за тобой, raw
проще, STOMP удобнее при росте числа каналов подписки.

Каждый блок ниже привязан к конкретному экрану `apps/web/app/(app)/...`, чтобы
не гадать, что именно нужно эндпоинту.

## Auth (экраны логина/регистрации — их ещё нет на фронте, добавляются в Phase 1)

- `POST /auth/register` — { email, password, displayName } → создаёт User + Account с нулевым балансом → { accessToken, refreshToken, user }
- `POST /auth/login` — { email, password } → { accessToken, refreshToken, user }
- `POST /auth/refresh` — { refreshToken } → { accessToken, refreshToken } (ротация)
- `POST /auth/logout` — ревокация refresh-токена
- `GET /auth/me` → текущий User + Account

## Рынок — `/market`, `/market/[ticker]`

- `GET /market/indices` → IndexQuote[] (замена `fixtures.ts: indices`)
- `GET /instruments` → Asset[] (замена `fixtures.ts: assets`)
- `GET /instruments/{ticker}` → Asset + StockCardInfo (замена `tradingExtra.ts: stockCards[ticker]`)
- `GET /instruments/{ticker}/candles?timeframe=1m|5m|15m|1h|1d&limit=` → Candle[] (замена `fixtures.ts: candles`, timeframes)
- `GET /instruments/{ticker}/news` → NewsItem[] (замена `tradingExtra.ts: stockCards[ticker].news`)
- `WS /ws/market/{ticker}` → поток тиков `{ price, changePercent, ts }` (замена `useTicker.ts`)

## Терминал — `/terminal`

- `GET /instruments/{ticker}/quote` → текущая цена для формы заявки
- `POST /orders/preview` — { ticker, side, anchor: quantity|amount, value } → { quantity, gross, commission, total, valid } (серверный эквивалент `OrderCalculator.calculate()` — **обязан давать те же числа при тех же входных данных**, покрой это интеграционным тестом, портированным из `OrderCalculator.test.ts`)
- `POST /orders` — { ticker, side, orderType, quantity или amount } → Order (создаёт Order, мгновенно исполняет по рыночной цене → Trade → обновляет Position)

## Открытые заявки — `/orders`

- `GET /orders?status=open` → OpenOrderRow[] (замена `tradingExtra.ts: openOrders`)
- `DELETE /orders/{id}` → отмена

## История сделок — `/history`

- `GET /trades?limit=&before=` → HistoryTradeRow[] (замена `tradingExtra.ts: tradeHistoryRows`, пагинация обязательна — в фикстурах 3 строки, в реальности их будут тысячи)
- `GET /trades/stats` → tradeHistoryStats

## Портфель — `/portfolio`, `/portfolio/[ticker]`

- `GET /portfolio` → { cashBalance, totalValue, holdings: Holding[] } (замена `manualHoldings`, `manualPortfolioValue`, `totalCapital`, `freeCash`)
- `GET /portfolio/{ticker}` → PositionInfo + PositionEntry[] (замена `tradingExtra.ts: positions[ticker]`)

## Агенты — `/agents/*`

- `GET /agents` → Agent[] (список, замена `fixtures.ts: agents`)
- `POST /agents` — мастер создания (тип из `agentTypeOptions`, character/budget/skills) → Agent
- `GET /agents/{id}` → AgentDetailInfo (замена `agentsData.ts: agentDetails[id]`)
- `PATCH /agents/{id}` — статус (active/paused), настройки
- `DELETE /agents/{id}`
- `GET /agents/{id}/character`, `GET /agents/{id}/budget`, `GET /agents/{id}/skills` → соответствующие срезы AgentConfig (или просто вернуть весь AgentConfig и фильтровать на фронте — проще и достаточно на этом объёме данных)
- `GET /agents/{id}/log?limit=` → AgentDecisionLog[] (замена `psychologyData.ts: agentSessionLog[strategy]`)
- `GET /agents/compare?ids=a,b,c` → CompareRow[]
- `GET /agents/ranking` → RankRow[]
- `WS /ws/agents/activity` → живой фид решений всех агентов пользователя (замена `agentsData.ts: agentActivity`, показывается на рынке/терминале)

## Симуляция — `/simulation/*`

- `GET /simulation/datasets` → Dataset[] (замена `tradingExtra.ts: simDatasets`)
- `POST /simulation/datasets` — загрузка файла с историческими данными (multipart)
- `POST /simulations` — { datasetId?, mode, agentIds[], startingCapital, speed } → Simulation (запускает backtest или live-режим)
- `GET /simulations/{id}` → статус + `liveSimInfo`-подобный снимок
- `WS /ws/simulations/{id}` → живой поток решений/таймлайна (замена `liveDecisions`, `liveTimeline`)
- `GET /simulations/{id}/results` → simResults-подобная структура (метрики + equity curve)
- `GET /simulations/{id}/export?format=csv|pdf` → файл (замена `exportContentOptions`, `exportPreview`)

## Каталог — `/catalog`

- `GET /catalog?type=&query=` → CatalogStock[] (замена `psychologyData.ts: catalogStocks`) — по сути алиас/расширение `GET /instruments` с фильтром по типу, не заводи отдельную сущность

## Команды — `/teams/*`

- `GET /teams` → TeamInfo[] (замена `psychologyData.ts: teams`)
- `POST /teams` — { name }
- `GET /teams/{id}` → TeamInfo + участники + сводка (`relationsSummary`)
- `GET /teams/{id}/feed` → FeedEvent[] (замена `feedEvents` — фильтр AgentDecisionLog по агентам команды)
- `POST /teams/{id}/members` — { userId } (или invite-flow, если понадобится)

## Журнал — `/journal`

- `GET /journal?limit=&agentId=` → journalEntries-подобная структура — снова AgentDecisionLog, без фильтра по конкретному агенту

## Настройки — `/settings/*`

- `GET /settings/profile`, `PUT /settings/profile` — displayName и т.п.
- `PUT /settings/security/password` — { currentPassword, newPassword }
- `GET /settings/notifications`, `PUT /settings/notifications`
- `GET /settings/trading`, `PUT /settings/trading`
- `GET /settings/data`, `PUT /settings/data` — { provider: "synthetic" | "finnhub" } (переключатель источника рыночных данных, см. `03-market-data-and-agents-engine.md`)
- `GET /settings/display`, `PUT /settings/display`
- `GET /settings/metrics`, `PUT /settings/metrics`

## Что осознанно остаётся на фронте (не эндпоинты)

- `lib/changelog.json` — чейнджлог версий сайта, это про релизы фронта, не
  про данные пользователя. Не переноси на бэкенд без явной причины.
- `lib/emptyStates.ts` — статичные тексты пустых состояний, это UI-копирайт,
  не данные.
