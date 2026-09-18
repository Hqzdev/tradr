# Market

This feature provides the synthetic market used by Phase 2. It owns seeded instruments, persisted candles, current quotes, REST reads, scheduled ticks, and ticker-scoped WebSocket broadcasts.

- `domain` maps market tables and timeframes.
- `repository` reads and writes market persistence.
- `provider` creates deterministic synthetic data.
- `application` boots market history, serves reads, and advances prices.
- `web` exposes the REST contract.
- `websocket` manages live ticker subscriptions.
- `exception` contains market-specific failures.
