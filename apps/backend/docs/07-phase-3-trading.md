# Торговля: подробная реализация

Файл сохранил историческое имя Phase 3. Текущая торговля агентская: публичных
ручных операций больше нет.

## Единственная точка записи

`TradingService.executeAgentOrder(...)` вызывается `AgentService`. Метод
получает account, agent, instrument, side, quantity, quote и simulation step.

Публичный `TradingController` содержит только GET-методы.

## Покупка

1. Проверить, что агент принадлежит account.
2. Рассчитать `gross = price × quantity`.
3. Рассчитать комиссию 0,1%.
4. Убедиться, что AgentWallet покрывает gross + commission.
5. Создать заполненный Order с source `AGENT`.
6. Создать Trade.
7. Списать деньги из AgentWallet.
8. Создать или увеличить AgentPosition и пересчитать среднюю цену.

Все шаги выполняются транзакционно.

## Продажа

1. Найти AgentPosition.
2. Проверить количество.
3. Рассчитать gross и комиссию.
4. Создать Order и Trade.
5. Зачислить `gross - commission` в AgentWallet.
6. Уменьшить позицию или удалить её полностью.
7. Обновить реализованную прибыль.

Короткая продажа не поддерживается.

## Комиссия

Комиссия равна 0,1% стоимости. Деньги округляются до центов. Количество
акций имеет точность до восьми знаков.

## Старые ручные данные

Тип `OrderSource.MANUAL` сохранён ради чтения старой истории. Миграция V13
отменила незаполненные старые ручные заявки. Создать новую ручную заявку
через HTTP нельзя.

## Read-only запросы

```text
GET /api/v1/orders?status=&agentId=
GET /api/v1/trades?limit=&before=&agentId=
GET /api/v1/trades/stats
GET /api/v1/portfolio
GET /api/v1/portfolio/{ticker}
```

`portfolio` оставлен для обратной совместимости. Источником результата
конкретного агента является `/agents/{id}/performance`.
