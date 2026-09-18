# Phase 5: симуляции

## Что есть

Можно создать датасет для инструмента, запустить backtest и получить сохранённый результат. Симуляция сразу получает статус `completed`, поэтому её удобно проверить одним запросом.

Результат содержит стартовый капитал, итоговый капитал, доходность, число сделок и короткую кривую капитала. Его можно получить JSON или CSV.

## API

- `GET /api/v1/simulation/datasets` — список датасетов.
- `POST /api/v1/simulation/datasets` — создать датасет `{ "name", "ticker" }`.
- `POST /api/v1/simulations` — создать и выполнить backtest.
- `GET /api/v1/simulations/{id}` — статус.
- `GET /api/v1/simulations/{id}/results` — результат.
- `GET /api/v1/simulations/{id}/export` — CSV-файл.

## Ограничение

Загрузка произвольного CSV и live-WebSocket симуляции потребуют восстановления frontend и отдельного этапа интерфейса. Backend уже хранит датасеты и результаты в PostgreSQL.
