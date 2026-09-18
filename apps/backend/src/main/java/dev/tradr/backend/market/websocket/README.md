# Market WebSocket

Clients subscribe to `/ws/market/{ticker}`. The handler sends an immediate quote followed by each scheduled price tick for that ticker.
