# Рынок: подробная реализация

Файл сохранил историческое имя Phase 2, но описывает актуальный рынок.

## Инструменты

V3 создала первые шесть акций, V11 добавила ещё двенадцать. Сейчас доступны:

`AAPL`, `NVDA`, `TSLA`, `MSFT`, `AMZN`, `GOOGL`, `META`, `AMD`, `NFLX`,
`INTC`, `AVGO`, `JPM`, `V`, `KO`, `DIS`, `PEP`, `BAC`, `XOM`.

У каждой записи есть имя, биржа NASDAQ или NYSE, тип STOCK и валюта USD.

## Запуск рынка

`MarketDataBootstrapper` проверяет наличие исходных свечей. Если данных нет,
он создаёт историю. `MarketTickEngine` не начинает цикл, пока bootstrapper
не сообщит о готовности.

## Свечи

Поддерживаются `1m`, `5m`, `15m`, `1h` и `1d`. Ответ содержит:

- время начала;
- open;
- high;
- low;
- close;
- volume.

Пара `instrument + timeframe + bucket_start` уникальна.

## Котировка

`MarketService` получает текущую цену из провайдера, обновляет минутную свечу
и строит `QuoteSnapshot`. Один и тот же snapshot используется агентом и
WebSocket, чтобы пользователь не видел другую цену, чем торговый движок.

## HTTP-примеры

```bash
curl -s http://localhost:8080/api/v1/instruments
curl -s http://localhost:8080/api/v1/instruments/AAPL
curl -s http://localhost:8080/api/v1/instruments/AAPL/quote
curl -s 'http://localhost:8080/api/v1/instruments/AAPL/candles?timeframe=5m&limit=24'
```

Неверный timeframe возвращает 400, неизвестный тикер — 404.

## WebSocket

```text
ws://localhost:8080/ws/market/AAPL
```

Клиент сразу получает текущий снимок, затем обновления последнего внутреннего
шага визуального тика.

## Ограничение

Цены, метрики и новости сейчас учебные. Не используйте их как биржевой
источник и не называйте real-time market data.
