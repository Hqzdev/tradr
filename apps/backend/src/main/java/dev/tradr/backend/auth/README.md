# Authentication

This feature owns registration, login, JWT access tokens, refresh-token rotation, logout, and the current-user endpoint.

- `application` contains authentication use cases.
- `domain` contains JPA entities.
- `repository` contains persistence interfaces.
- `security` contains JWT creation, validation, and request authentication.
- `web` contains REST endpoints and their request and response models.
- `exception` contains feature-specific failures.

Public endpoints are under `/api/v1/auth`. `GET /api/v1/auth/me` requires a valid bearer access token. The database schema is defined in `src/main/resources/db/migration/V2__auth.sql`.
