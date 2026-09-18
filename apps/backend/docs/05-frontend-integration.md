# Переключение фронта с моков на бэкенд

Правило: миграция идёт **по фазам бэкенда, экран за экраном**, не одним
большим рефакторингом в конце. Каждая фаза из `04-roadmap.md` разблокирует
конкретный набор экранов — переключаешь их сразу, пока контекст свежий, а
не оставляешь "доделать потом" (потом = никогда, ты сам знаешь эту
механику).

## Что уже подготовлено на фронте (сделано в этом заходе)

- `apps/web/.env.example` — переменные `NEXT_PUBLIC_API_BASE_URL` и
  `NEXT_PUBLIC_WS_BASE_URL`
- `apps/web/lib/api/client.ts` — универсальный fetch-обёртка (базовый URL из env,
  подстановка токена, разбор ошибок)
- `apps/web/lib/api/README.md` — паттерн для новых `*Api.ts` файлов
- `apps/web/MOCK_DATA_MAP.md` — построчная карта: какой экспорт из
  `lib/fixtures.ts` / `lib/agentsData.ts` / `lib/tradingExtra.ts` /
  `lib/psychologyData.ts` какой эндпоинт заменяет и какой экран/компонент
  надо поправить

Ничего из UI-компонентов пока не тронуто — они как импортировали моки, так
и импортируют. Это осознанно: трогать 30 экранов до того, как бэкенд хоть
что-то реально отдаёт — работа в стол.

## Порядок переключения (зеркалит roadmap)

1. **После Phase 1** — добавить экраны логина/регистрации (их нет),
   `AuthProvider`/контекст с токеном, `Sidebar.tsx` перестаёт хардкодить
   "Ярослав" и берёт `GET /auth/me`.
2. **После Phase 2** — `MarketScreen.tsx`, `TerminalScreen.tsx` (график),
   `StockCardScreen.tsx` переключаются на `lib/api/marketApi.ts` вместо
   `fixtures.ts`/`tradingExtra.ts: stockCards`. `useTicker.ts` заменяется на
   WS-подписку.
3. **После Phase 3** — `TerminalScreen.tsx` (форма заявки → `POST /orders`),
   `OpenOrdersScreen.tsx`, `TradeHistoryScreen.tsx`, `PortfolioScreen.tsx`,
   `PositionDetailScreen.tsx`.
4. **После Phase 4** — `AgentsListScreen.tsx`, `AgentDetailScreen.tsx` (и
   вкладки budget/character/log/skills), `CreateAgentScreen.tsx`,
   `AgentSetupTypeScreen.tsx`, `AgentsCompareScreen.tsx`,
   `AgentsRankingScreen.tsx`, `JournalScreen.tsx`.
5. **После Phase 5** — `SimSetupScreen.tsx`, `SimDataScreen.tsx`,
   `SimLiveScreen.tsx`, `SimResultsScreen.tsx`, `ReportExportScreen.tsx`.
6. **После Phase 6** — `TeamsListScreen.tsx`, `TeamDetailScreen.tsx`,
   `TeamsFeedScreen.tsx`.
7. **После Phase 7** — все `Settings*` экраны начинают реально сохранять
   (`PUT` вместо локального `useState`).
8. **После Phase 8** — ничего на фронте менять не нужно, если
   `MarketDataProvider` абстрагирован правильно — переключатель в
   `/settings/data` меняет поведение бэкенда, фронт этого не видит.

## Как определить, что экран готов к переключению

Открой файл экрана в `components/screens/`, найди импорт из `lib/*.ts` с
моковыми данными, замени на вызов соответствующей функции из
`lib/api/*.ts`. Пока бэкенд для этой фазы не готов — не трогай импорт,
компонент продолжает работать на фикстурах. Это значит, что frontend и
backend можно разрабатывать параллельно без блокировки друг друга — но
*переключение* делается сразу после того, как бэкенд для фазы заработал, а
не откладывается.
