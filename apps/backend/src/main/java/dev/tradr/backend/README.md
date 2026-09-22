# Backend packages

`BackendApplication` is the Spring Boot entry point. The packages below are grouped by responsibility.

- `config` configures framework integration and application properties.
- `health` exposes infrastructure health endpoints.
- `common` contains shared HTTP error handling.
- `auth` contains the authentication feature, split into layers.
- `market` contains synthetic prices, charts, and market WebSocket updates.
- `dashboard` aggregates account value, goal progress, agents, and activity.
- `agents` owns agent wallets, positions, strategies, and decision history.
- `trading` executes agent-owned orders and exposes read-only history.
