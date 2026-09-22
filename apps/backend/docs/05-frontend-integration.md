# Как frontend подключён к backend

Frontend больше не должен брать пользовательские деньги, агентов или сделки
из статических fixtures. Рабочие данные приходят из REST API.

## Общий клиент

`apps/web/lib/api/client.ts`:

- читает `NEXT_PUBLIC_API_BASE_URL`;
- добавляет access token;
- разбирает JSON;
- приводит ошибку к понятному сообщению;
- участвует в обновлении access token.

API разбит по предметным файлам: `auth.ts`, `dashboard.ts`, `agents.ts`,
`market.ts` и `trading.ts`.

## Экран → API

### LoginScreen и RegisterScreen

- `POST /auth/login`;
- `POST /auth/register`;
- ответ сохраняется в клиентское хранилище токенов;
- безопасный `next` определяет маршрут после успеха.

### DashboardScreen

- `GET /dashboard` загружает весь первый экран одним запросом;
- `PATCH /account/preferences` меняет цель или ускорение;
- запуск агента выполняет `POST /agents/{id}/start`;
- после действия Dashboard перечитывается.

### AgentsListScreen и AgentDetailScreen

- список: `GET /agents`;
- карточка: `GET /agents/{id}`;
- результат: `GET /agents/{id}/performance`;
- журнал: `GET /agents/{id}/log`;
- управление: start, pause, close, allocation.

### MarketScreen и StockDetailScreen

- инструменты и свечи приходят из market API;
- WebSocket обновляет цену выбранной акции;
- формы ручной покупки нет.

### TradeHistoryScreen

- `GET /trades` показывает операции;
- каждая новая операция содержит агента;
- пользователь только фильтрует и изучает историю.

## Loading, error и empty

Каждый экран обязан различать:

- данные ещё загружаются;
- запрос закончился ошибкой;
- запрос успешен, но список пуст;
- действие успешно изменило состояние.

Пустой список агентов должен предлагать создать агента. Ошибка сети не
должна выглядеть как пустой список.

## WebSocket

`NEXT_PUBLIC_WS_BASE_URL` используется для живых котировок. В локальной
среде это `ws://`, в продакшене — `wss://`.

WebSocket не заменяет REST: после перезагрузки исходный снимок всё равно
загружается обычным запросом.

## Старые маршруты

- `/terminal` и `/portfolio` перенаправляют на Dashboard;
- `/orders` не создаёт операции;
- старые экранные компоненты не считаются доступной функцией, если маршрут
  больше их не использует.
