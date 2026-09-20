# Локальная разработка TRADR

Этот документ описывает рабочий путь для запуска полного приложения на локальной машине.

## Требования

- Node.js 20+ и npm;
- Java 21;
- Docker и Docker Compose;
- свободные порты `3000`, `8080`, `5432` и `8081`.

## Подготовка окружения

Создайте локальные файлы окружения из шаблонов:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env.local
```

В `apps/backend/.env` обязательно замените `JWT_SECRET` на случайную строку длиной не менее 32 символов. Не добавляйте файлы `.env` в Git.

Запустите PostgreSQL и Adminer:

```bash
docker compose -f apps/backend/docker-compose.dev.yml up -d
```

Установите JavaScript-зависимости из корня репозитория:

```bash
npm install
```

## Запуск

```bash
npm run dev
```

Команда запускает два процесса:

- `web` — Next.js на `http://localhost:3000`;
- `backend` — Spring Boot на `http://localhost:8080`.

Если один процесс завершается с ошибкой, второй останавливается, чтобы консоль не оставалась в ложном состоянии «всё запущено».

Для раздельного запуска используйте:

```bash
npm run dev:web
npm run dev:backend
```

## Проверка работоспособности

```bash
curl -i http://localhost:8080/health
curl -s http://localhost:8080/api/v1/market/indices
```

Первая команда должна вернуть успешный статус, а вторая — список индексов после завершения инициализации приложения.

## Тесты

```bash
npm run test:web
npm run test:backend
```

Команды запускают тесты соответствующих workspace-пакетов. Дополнительные сценарии по API и фазам реализации находятся в [документации бэкенда](./apps/backend/docs/00-overview.md).

## Частые проблемы

- **Порт занят.** Остановите процесс, который слушает соответствующий порт, или измените конфигурацию запуска.
- **Бэкенд не подключается к базе.** Проверьте `docker compose ... ps`, значения `DB_*` в `apps/backend/.env` и логи контейнера PostgreSQL.
- **Ошибка JWT при старте.** Убедитесь, что `JWT_SECRET` не остался шаблонным значением.
- **Фронтенд не видит API.** Проверьте `NEXT_PUBLIC_API_BASE_URL` и `NEXT_PUBLIC_WS_BASE_URL` в `apps/web/.env.local`.
