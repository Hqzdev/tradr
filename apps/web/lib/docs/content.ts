export interface DocEntry {
  path: string;
  description: string;
  tag?: string;
  warning?: string;
}

export interface DocSection {
  id: string;
  title: string;
  description?: string;
  entries?: DocEntry[];
  bullets?: string[];
  code?: string;
  note?: string;
}

export interface DocPage {
  slug: string;
  order: number;
  group: "Начало" | "Интерфейс" | "Сервер" | "Процессы";
  eyebrow: string;
  title: string;
  description: string;
  readTime: string;
  sections: DocSection[];
}

export const docsPages: DocPage[] = [
  {
    slug: "overview",
    order: 1,
    group: "Начало",
    eyebrow: "Начало работы",
    title: "Как устроен TRADR",
    description: "Короткая карта проекта для первого знакомства. После этой страницы будет понятно, что запускается, где лежит код и как данные проходят через систему.",
    readTime: "7 минут",
    sections: [
      {
        id: "purpose",
        title: "Что делает проект",
        bullets: [
          "TRADR — учебная торговая платформа. Здесь нет реальных денег и инвестиционных рекомендаций.",
          "Пользователь наблюдает за единым искусственным рынком, создаёт учебные заявки и видит состояние портфеля.",
          "Три типа агентов — агрессивный, осторожный и случайный — принимают решения на одних и тех же котировках.",
          "Все решения агентов сохраняются в журнале, поэтому действие можно объяснить и проверить.",
        ],
        note: "Главная идея: одинаковые данные → разные стратегии → сравнимый результат.",
      },
      {
        id: "layers",
        title: "Четыре слоя системы",
        entries: [
          { path: "apps/web", description: "Next.js-интерфейс: страницы, компоненты, API-клиенты и визуальная система.", tag: "Интерфейс" },
          { path: "apps/backend", description: "Spring Boot API: авторизация, рынок, торговля, агенты и доступ к базе.", tag: "Сервер" },
          { path: "PostgreSQL", description: "Пользователи, счета, свечи, заявки, сделки, позиции, агенты и журнал решений.", tag: "Данные" },
          { path: "design/design.pen", description: "Редактируемый источник экранов, компонентов, размеров и состояний интерфейса.", tag: "Дизайн" },
        ],
      },
      {
        id: "flow",
        title: "Как проходит действие пользователя",
        bullets: [
          "Страница вызывает функцию из apps/web/lib/api.",
          "apiFetch добавляет JWT и отправляет запрос на сервер.",
          "Controller проверяет форму запроса и передаёт работу Service-классу.",
          "Service применяет бизнес-правила и обращается к Repository.",
          "Repository читает или изменяет PostgreSQL, а DTO возвращает безопасный ответ интерфейсу.",
        ],
      },
      {
        id: "start",
        title: "Первый локальный запуск",
        description: "Интерфейс и сервер запускаются отдельно. Сначала поднимите PostgreSQL, затем оба приложения.",
        code: "# база данных\ncd apps/backend\ndocker compose -f docker-compose.dev.yml up -d\n\n# сервер — http://localhost:8080\ncp .env.example .env\nnpm run dev\n\n# интерфейс — http://localhost:3000\ncd ../web\nnpm install\nnpm run dev",
        note: "Перед запуском замените JWT_SECRET в apps/backend/.env на случайную строку длиной не меньше 32 символов.",
      },
    ],
  },
  {
    slug: "repository",
    order: 2,
    group: "Начало",
    eyebrow: "Карта репозитория",
    title: "Все корневые папки и файлы",
    description: "Что находится в корне проекта, какие каталоги редактируются вручную, а какие создаются инструментами и не являются исходным кодом.",
    readTime: "8 минут",
    sections: [
      {
        id: "root",
        title: "Корень tradr/",
        entries: [
          { path: "README.md", description: "Короткая публичная презентация проекта, превью экранов и общая схема работы." },
          { path: "apps/", description: "Рабочие приложения: интерфейс в web и сервер в backend." },
          { path: "design/", description: "Макеты Pencil, экспортированные изображения и материалы для README." },
          { path: "design-qa.md", description: "История визуальных проверок лендинга и экранов документации." },
          { path: ".git/", description: "История Git. Не редактируется вручную.", warning: "Служебная папка" },
          { path: ".DS_Store", description: "Служебный файл macOS. Его можно исключить через .gitignore.", warning: "Не относится к продукту" },
        ],
      },
      {
        id: "design",
        title: "Папка design/",
        entries: [
          { path: "design/design.pen", description: "Главный редактируемый макет всех продуктовых и документационных экранов." },
          { path: "design/assets/readme/hero.svg", description: "Большая обложка в верхней части README." },
          { path: "design/assets/readme/workflow.svg", description: "Схема: рынок → решение агента → сделка → результат." },
          { path: "design/design-previews/", description: "PNG-превью экранов для README, обсуждений и визуального сравнения." },
          { path: "design/logo-export/", description: "Экспорт фирменного знака TRADR." },
        ],
      },
      {
        id: "generated",
        title: "Что не нужно редактировать",
        entries: [
          { path: "apps/web/.next/", description: "Результат разработки и сборки Next.js. Пересоздаётся автоматически.", warning: "Не редактировать" },
          { path: "apps/web/node_modules/", description: "Установленные npm-пакеты. Источник списка — package.json.", warning: "Не редактировать" },
          { path: "apps/backend/target/", description: "Скомпилированные Java-классы и отчёты Maven.", warning: "Не редактировать" },
          { path: "apps/backend/logs/", description: "Локальные журналы сервера; правила хранения описаны в logs/README.md." },
          { path: "apps/web/tsconfig.tsbuildinfo", description: "Кэш TypeScript для ускорения повторных проверок.", warning: "Генерируется" },
        ],
      },
      {
        id: "ownership",
        title: "Где искать нужное изменение",
        bullets: [
          "Новый экран или маршрут — apps/web/app.",
          "Переиспользуемый UI — apps/web/components/ui.",
          "Запрос к серверу — apps/web/lib/api.",
          "Новое бизнес-правило — application-слой нужного серверного модуля.",
          "Новая таблица или поле — новая Flyway-миграция в db/migration.",
          "Визуальное решение до реализации — design/design.pen.",
        ],
      },
    ],
  },
  {
    slug: "web-routes",
    order: 3,
    group: "Интерфейс",
    eyebrow: "Интерфейс · маршруты",
    title: "Страницы приложения",
    description: "Папка app/ использует Next.js App Router. Каждая page.tsx отвечает за URL, а сложный интерфейс обычно передаёт отдельному компоненту экрана.",
    readTime: "12 минут",
    sections: [
      {
        id: "root-routes",
        title: "Общие файлы и публичные страницы",
        entries: [
          { path: "app/layout.tsx", description: "Корневой HTML, метаданные, Inter и глобальные стили для всех маршрутов." },
          { path: "app/globals.css", description: "Tailwind, глобальные правила, лендинг, документация, адаптивность и reduced motion." },
          { path: "app/page.tsx", description: "Публичная главная страница. Показывает LandingPage." },
          { path: "app/docs/[[...slug]]/page.tsx", description: "Документация: открывает обзор или выбранный раздел по slug." },
          { path: "app/(auth)/layout.tsx", description: "Чистая оболочка страниц входа и регистрации без рабочего сайдбара." },
          { path: "app/(auth)/login/page.tsx", description: "Маршрут /login, подключает LoginScreen." },
          { path: "app/(auth)/register/page.tsx", description: "Маршрут /register, подключает RegisterScreen." },
        ],
      },
      {
        id: "main-routes",
        title: "Основной рабочий контур",
        entries: [
          { path: "app/(app)/layout.tsx", description: "Общая оболочка защищённой зоны: ProtectedApp, сайдбар и область контента." },
          { path: "app/(app)/error.tsx", description: "Экран непредвиденной ошибки внутри приложения и кнопка повторной попытки." },
          { path: "app/(app)/market/page.tsx", description: "Обзор рынка: котировки, индексы, карточки инструментов." },
          { path: "app/(app)/market/[ticker]/page.tsx", description: "Детали выбранного инструмента по динамическому тикеру." },
          { path: "app/(app)/terminal/page.tsx", description: "Торговый терминал: график, котировка, расчёт и создание заявки." },
          { path: "app/(app)/portfolio/page.tsx", description: "Баланс, общая стоимость и список позиций." },
          { path: "app/(app)/portfolio/[ticker]/page.tsx", description: "Детальная позиция выбранного тикера." },
          { path: "app/(app)/portfolio/aapl/page.tsx", description: "Статический маршрут демонстрации позиции AAPL." },
          { path: "app/(app)/orders/page.tsx", description: "Открытые и завершённые заявки, отмена доступной заявки." },
          { path: "app/(app)/history/page.tsx", description: "История исполненных сделок и агрегированная статистика." },
          { path: "app/(app)/journal/page.tsx", description: "Общий журнал событий и решений агентов." },
          { path: "app/(app)/catalog/page.tsx", description: "Каталог доступных инструментов и справочная информация." },
        ],
      },
      {
        id: "agent-routes",
        title: "Маршруты агентов",
        entries: [
          { path: "app/(app)/agents/page.tsx", description: "Список агентов пользователя и их текущие состояния." },
          { path: "app/(app)/agents/new/page.tsx", description: "Создание агента: имя и тип стратегии." },
          { path: "app/(app)/agents/setup/page.tsx", description: "Пошаговая настройка нового агента." },
          { path: "app/(app)/agents/[id]/page.tsx", description: "Карточка конкретного агента." },
          { path: "app/(app)/agents/[id]/character/page.tsx", description: "Характер и профиль стратегии агента." },
          { path: "app/(app)/agents/[id]/budget/page.tsx", description: "Учебный бюджет и ограничения агента." },
          { path: "app/(app)/agents/[id]/skills/page.tsx", description: "Навыки и доступные действия агента." },
          { path: "app/(app)/agents/[id]/log/page.tsx", description: "История решений выбранного агента." },
          { path: "app/(app)/agents/compare/page.tsx", description: "Сравнение стратегий и результатов." },
          { path: "app/(app)/agents/ranking/page.tsx", description: "Рейтинг агентов по учебным показателям." },
        ],
      },
      {
        id: "settings-routes",
        title: "Команды и настройки",
        entries: [
          { path: "app/(app)/teams/page.tsx", description: "Список команд и совместных пространств." },
          { path: "app/(app)/teams/[teamId]/page.tsx", description: "Страница конкретной команды." },
          { path: "app/(app)/teams/feed/page.tsx", description: "Лента командных событий." },
          { path: "app/(app)/settings/page.tsx", description: "Главная страница настроек пользователя." },
          { path: "settings/display/page.tsx", description: "Отображение и плотность интерфейса." },
          { path: "settings/notifications/page.tsx", description: "Правила уведомлений." },
          { path: "settings/security/page.tsx", description: "Безопасность аккаунта и сессий." },
          { path: "settings/trading/page.tsx", description: "Параметры учебной торговли." },
          { path: "settings/data/page.tsx", description: "Данные, экспорт и локальные настройки." },
          { path: "settings/metrics/page.tsx", description: "Выбор отображаемых показателей." },
        ],
      },
    ],
  },
  {
    slug: "web-components",
    order: 4,
    group: "Интерфейс",
    eyebrow: "Интерфейс · компоненты",
    title: "Из чего собран интерфейс",
    description: "Компоненты разделены по ответственности: общая навигация, готовые экраны, графики и маленькие UI-примитивы.",
    readTime: "13 минут",
    sections: [
      {
        id: "shell",
        title: "Общая оболочка",
        entries: [
          { path: "components/Sidebar.tsx", description: "Основная навигация рабочего приложения, группы меню, профиль и журнал версий." },
          { path: "components/StatTile.tsx", description: "Унифицированная карточка числового показателя." },
          { path: "components/auth/ProtectedApp.tsx", description: "Проверяет локальную сессию и не показывает рабочую зону неавторизованному пользователю." },
          { path: "components/icons.tsx", description: "Единые обёртки Hugeicons и фирменный IconLogo. Новые общие иконки добавляются сюда." },
          { path: "components/landing/LandingPage.tsx", description: "Весь публичный лендинг: hero, метрики, продуктовые карточки, ресурсы и footer." },
          { path: "components/docs/DocsShell.tsx", description: "Оболочка документации, поиск, мобильное меню и боковая навигация." },
          { path: "components/docs/DocArticle.tsx", description: "Отображает секции, списки файлов, заметки и примеры кода." },
        ],
      },
      {
        id: "screens",
        title: "Компоненты экранов",
        entries: [
          { path: "screens/MarketScreen.tsx", description: "Полный интерфейс рынка и загрузка списка инструментов." },
          { path: "screens/TerminalScreen.tsx", description: "Торговый сценарий: выбор акции, график, форма и предпросмотр заявки." },
          { path: "screens/PortfolioScreen.tsx", description: "Сводка портфеля и позиции пользователя." },
          { path: "screens/OpenOrdersScreen.tsx", description: "Таблица заявок и действие отмены." },
          { path: "screens/TradeHistoryScreen.tsx", description: "История сделок и статистика." },
          { path: "screens/AgentsListScreen.tsx", description: "Список агентов и управление их состоянием." },
          { path: "screens/AgentDetailScreen.tsx", description: "Подробная информация по одному агенту." },
          { path: "screens/CreateAgentScreen.tsx", description: "Форма создания агента." },
          { path: "screens/SettingsScreen.tsx", description: "Каркас и содержимое разделов настроек." },
          { path: "screens/LoginScreen.tsx", description: "Форма входа, валидация и сохранение сессии." },
          { path: "screens/RegisterScreen.tsx", description: "Регистрация пользователя и создание первой сессии." },
          { path: "screens/ComingSoonScreen.tsx", description: "Единое временное состояние для ещё не реализованного раздела." },
        ],
      },
      {
        id: "charts",
        title: "Графики",
        entries: [
          { path: "charts/LineChart.tsx", description: "Базовая линия временного ряда." },
          { path: "charts/Sparkline.tsx", description: "Маленький график внутри карточек и таблиц." },
          { path: "charts/CapitalChart.tsx", description: "Изменение учебного капитала во времени." },
          { path: "charts/PositionProfitChart.tsx", description: "Прибыль или убыток конкретной позиции." },
        ],
      },
      {
        id: "ui",
        title: "UI-примитивы",
        description: "Эти компоненты не знают бизнес-логики. Они получают данные и события через props.",
        entries: [
          { path: "ui/Button.tsx · IconButton.tsx", description: "Основная и компактная кнопки, размеры, состояния и focus-ring." },
          { path: "ui/Input.tsx · PasswordInput.tsx · FieldBox.tsx", description: "Поля формы, ошибки, подписи и показ пароля." },
          { path: "ui/Card.tsx · Badge.tsx · PageHeader.tsx", description: "Контейнеры, статусы и заголовок страницы." },
          { path: "ui/SearchField.tsx · Select.tsx", description: "Поиск и собственный выпадающий список." },
          { path: "ui/Tabs.tsx · SegmentedControl.tsx", description: "Вкладки и переключатель с единым скользящим индикатором." },
          { path: "ui/Toggle.tsx · ProgressBar.tsx · StepProgress.tsx", description: "Переключатель, прогресс и шаги сценария." },
          { path: "ui/Toast.tsx · Tooltip.tsx", description: "Короткие уведомления и контекстные подсказки." },
          { path: "ui/EmptyState.tsx · Skeleton.tsx", description: "Пустое состояние и загрузочная заглушка." },
          { path: "ui/AnimatedNumber.tsx", description: "Плавно меняет числовое значение без сторонней библиотеки анимаций." },
        ],
      },
    ],
  },
  {
    slug: "web-data",
    order: 5,
    group: "Интерфейс",
    eyebrow: "Интерфейс · данные",
    title: "API, типы и локальная логика",
    description: "Папка lib/ отделяет работу с сервером, типы и небольшие чистые функции от React-компонентов.",
    readTime: "10 минут",
    sections: [
      {
        id: "api",
        title: "API-клиенты",
        entries: [
          { path: "lib/api/client.ts", description: "Базовый адрес, JWT из localStorage, apiFetch, ApiError и WebSocket URL." },
          { path: "lib/api/auth.ts", description: "register, login, currentUser, logout и хранение access/refresh токенов." },
          { path: "lib/api/market.ts", description: "Тип Instrument и получение списка инструментов." },
          { path: "lib/api/trading.ts", description: "Портфель, заявки, сделки, статистика и отмена заявки." },
          { path: "lib/api/agents.ts", description: "Создание, чтение и изменение состояния агентов." },
          { path: "lib/api/README.md", description: "Правила работы API-слоя и договорённости по запросам." },
        ],
        note: "Компонент не должен самостоятельно собирать URL или читать токен. Для этого существует lib/api/client.ts.",
      },
      {
        id: "helpers",
        title: "Типы и вспомогательные функции",
        entries: [
          { path: "lib/types.ts", description: "Общие TypeScript-типы приложения, включая запись changelog." },
          { path: "lib/clsx.ts", description: "Безопасно объединяет CSS-классы по условиям." },
          { path: "lib/emptyStates.ts", description: "Единые тексты и настройки пустых состояний." },
          { path: "lib/useTicker.ts", description: "React-hook для выбора и синхронизации текущего тикера." },
          { path: "lib/useAnimatedNumber.ts", description: "requestAnimationFrame-анимация числа без Framer Motion." },
          { path: "lib/changelog.json", description: "Источник видимой истории версий в сайдбаре. Новая запись всегда идёт первой." },
          { path: "lib/changelog.ts", description: "Типизированно экспортирует список версий и currentRelease." },
        ],
      },
      {
        id: "calculator",
        title: "Расчёт заявки",
        entries: [
          { path: "lib/OrderCalculator.ts", description: "Чистая клиентская версия расчёта количества, суммы и комиссии для мгновенного предпросмотра." },
          { path: "lib/OrderCalculator.test.ts", description: "Проверяет округление, дробные акции, buy/sell и ошибочные значения." },
        ],
        note: "Сервер повторяет этот расчёт и остаётся окончательным источником истины. Клиентский калькулятор нужен только для быстрого интерфейса.",
      },
      {
        id: "config",
        title: "Конфигурация интерфейса",
        entries: [
          { path: "package.json", description: "Next.js 14, React 18, Hugeicons и команды dev/build/start/lint." },
          { path: "package-lock.json", description: "Точные версии npm-зависимостей. Обновляется npm, не вручную." },
          { path: "next.config.js", description: "Настройки сборки Next.js." },
          { path: "tailwind.config.ts", description: "Цвета, Inter, размеры текста, радиусы, тени и CSS-анимации TRADR." },
          { path: "postcss.config.js", description: "Подключает Tailwind и Autoprefixer." },
          { path: "tsconfig.json", description: "Строгие настройки TypeScript и alias @/." },
          { path: "next-env.d.ts", description: "Служебные типы Next.js. Не редактируется вручную." },
          { path: "public/logo.png", description: "Растровый логотип для внешних поверхностей." },
          { path: "CLAUDE.md", description: "Обязательные правила: Hugeicons, design.pen, без animation-библиотек, changelog перед изменениями." },
        ],
      },
    ],
  },
  {
    slug: "backend-architecture",
    order: 6,
    group: "Сервер",
    eyebrow: "Сервер · архитектура",
    title: "Как проходит запрос на сервере",
    description: "Сервер построен модульно: web принимает HTTP, application выполняет сценарий, domain хранит правила, repository работает с PostgreSQL.",
    readTime: "10 минут",
    sections: [
      {
        id: "root",
        title: "Корневые файлы сервера",
        entries: [
          { path: "BackendApplication.java", description: "Точка запуска Spring Boot и корень сканирования компонентов." },
          { path: "pom.xml", description: "Java 21, Spring Boot, Security, JPA, Validation, WebSocket, Flyway, PostgreSQL и тесты." },
          { path: "mvnw · mvnw.cmd · .mvn/", description: "Maven Wrapper: одинаковая версия Maven без глобальной установки." },
          { path: "package.json", description: "Короткие npm-команды-обёртки для привычного локального запуска сервера." },
          { path: "Dockerfile", description: "Собирает контейнер сервера для окружения развёртывания." },
          { path: "docker-compose.dev.yml", description: "Локальные PostgreSQL и Adminer." },
          { path: "HELP.md", description: "Справочные ссылки, созданные шаблоном Spring Initializr." },
          { path: "README.md", description: "Состояние фаз, запуск и проверочные curl-команды." },
        ],
      },
      {
        id: "layers",
        title: "Правило слоёв",
        entries: [
          { path: "web/", description: "Controller и DTO. Здесь только HTTP, валидация и перевод ответа." },
          { path: "application/", description: "Сценарии продукта, транзакции и связь нескольких репозиториев." },
          { path: "domain/", description: "Сущности, value objects, enum и правила изменения состояния." },
          { path: "repository/", description: "Spring Data интерфейсы чтения и записи БД." },
          { path: "exception/", description: "Понятные доменные ошибки, которые переводятся в HTTP-ответ централизованно." },
        ],
        note: "Controller не должен считать комиссию или менять позицию. Entity не должна знать про HTTP. Repository не содержит интерфейсный текст.",
      },
      {
        id: "common",
        title: "Общая инфраструктура",
        entries: [
          { path: "common/api/ErrorResponse.java", description: "Единое тело ошибки с понятным сообщением." },
          { path: "common/api/GlobalExceptionHandler.java", description: "Переводит исключения и ошибки валидации в правильные HTTP-коды." },
          { path: "config/SecurityConfig.java", description: "JWT-цепочка, публичные URL, PasswordEncoder и правила доступа." },
          { path: "config/CorsProperties.java", description: "Разрешённые адреса интерфейса из переменной окружения." },
          { path: "config/ConfigPropertiesConfig.java", description: "Включает типизированные @ConfigurationProperties." },
          { path: "config/MarketWebSocketConfig.java", description: "Регистрирует WebSocket рынка по /ws/market/{ticker}." },
          { path: "health/HealthController.java", description: "Публичный GET /health для проверки доступности процесса." },
        ],
      },
      {
        id: "request",
        title: "Пример цепочки создания заявки",
        code: "POST /api/v1/orders\n  → TradingController\n  → CreateOrderRequest + @Valid\n  → TradingService.create(userId, request)\n  → MarketService + AccountRepository\n  → OrderCalculator\n  → OrderRepository / TradeRepository / PositionRepository\n  → OrderResponse → JSON",
      },
    ],
  },
  {
    slug: "backend-auth",
    order: 7,
    group: "Сервер",
    eyebrow: "Сервер · безопасность",
    title: "Авторизация и сессия",
    description: "Access-токен подтверждает каждый защищённый запрос. Refresh-токен одноразово обновляет сессию и хранится в базе только в виде SHA-256 хэша.",
    readTime: "11 минут",
    sections: [
      {
        id: "domain",
        title: "Модель авторизации",
        entries: [
          { path: "auth/domain/User.java", description: "Пользователь: email, хэш пароля, отображаемое имя и время создания." },
          { path: "auth/domain/Account.java", description: "Учебный денежный счёт пользователя, баланс и валюта." },
          { path: "auth/domain/RefreshToken.java", description: "Хэш refresh-токена, срок действия и момент отзыва." },
          { path: "auth/repository/UserRepository.java", description: "Поиск пользователя по email и проверка занятости адреса." },
          { path: "auth/repository/AccountRepository.java", description: "Поиск счёта по пользователю и идентификатору." },
          { path: "auth/repository/RefreshTokenRepository.java", description: "Поиск и сохранение refresh-токенов по хэшу." },
        ],
      },
      {
        id: "security",
        title: "JWT и фильтр",
        entries: [
          { path: "auth/security/JwtProperties.java", description: "JWT_SECRET, время жизни access-токена и refresh-токена." },
          { path: "auth/security/JwtService.java", description: "Создаёт и проверяет подписанный HS256 access JWT." },
          { path: "auth/security/JwtAuthenticationFilter.java", description: "Читает Bearer token, проверяет его и кладёт userId в SecurityContext." },
          { path: "config/SecurityConfig.java", description: "Подключает фильтр и оставляет публичными только health и базовые auth-операции." },
        ],
        note: "Access JWT не хранится в базе. Refresh-токен не является JWT и после успешного обновления немедленно отзывается.",
      },
      {
        id: "service",
        title: "Сценарии и HTTP",
        entries: [
          { path: "auth/application/AuthService.java", description: "register, login, refresh, logout, me; BCrypt, выпуск JWT и ротация refresh-токена." },
          { path: "auth/web/AuthController.java", description: "Маршруты /api/v1/auth/* и получение userId текущей сессии." },
          { path: "auth/web/dto/RegisterRequest.java", description: "Email, пароль и displayName новой регистрации." },
          { path: "auth/web/dto/LoginRequest.java", description: "Email и пароль для входа." },
          { path: "auth/web/dto/RefreshRequest.java", description: "Refresh-токен для обновления или выхода." },
          { path: "auth/web/dto/AuthResponse.java", description: "Access token, refresh token и безопасная информация о пользователе." },
          { path: "auth/web/dto/UserResponse.java", description: "id, email и displayName без хэша пароля." },
        ],
      },
      {
        id: "errors",
        title: "Ошибки",
        entries: [
          { path: "EmailAlreadyExistsException.java", description: "Регистрация с уже занятым email → 409." },
          { path: "InvalidCredentialsException.java", description: "Одинаковая ошибка для неизвестного email и неверного пароля → 401." },
          { path: "InvalidRefreshTokenException.java", description: "Неизвестный, отозванный или истёкший refresh-токен → 401." },
        ],
      },
    ],
  },
  {
    slug: "backend-market",
    order: 8,
    group: "Сервер",
    eyebrow: "Сервер · рынок",
    title: "Котировки, свечи и WebSocket",
    description: "Рынок полностью воспроизводим: provider создаёт детерминированные цены, tick engine обновляет минутную свечу, REST отдаёт историю, WebSocket — новые тики.",
    readTime: "12 минут",
    sections: [
      {
        id: "domain",
        title: "Доменные файлы",
        entries: [
          { path: "market/domain/Instrument.java", description: "Акция или индекс: тикер, название, биржа, тип и валюта." },
          { path: "market/domain/InstrumentType.java", description: "Допустимые типы инструмента." },
          { path: "market/domain/Candle.java", description: "OHLCV-свеча; incorporateTick обновляет high, low, close и volume." },
          { path: "market/domain/IndexQuote.java", description: "Отдельная короткая котировка фондового индекса." },
          { path: "market/domain/Timeframe.java", description: "Поддерживаемые интервалы свечей и их разбор из URL." },
        ],
      },
      {
        id: "engine",
        title: "Поставщик и движок",
        entries: [
          { path: "market/provider/MarketDataProvider.java", description: "Контракт источника цены, объёма и начальных данных." },
          { path: "market/provider/SyntheticMarketDataProvider.java", description: "Повторяемая синтетическая история и live-сценарий без внешнего API." },
          { path: "market/application/MarketDataBootstrapper.java", description: "Заполняет инструменты и начальные свечи при пустой базе." },
          { path: "market/application/MarketService.java", description: "Инструменты, котировки, свечи и применение нового тика." },
          { path: "market/application/MarketTickEngine.java", description: "По расписанию двигает рынок и уведомляет торговлю, агентов и WebSocket." },
          { path: "market/application/QuoteSnapshot.java", description: "Неизменяемый снимок цены, изменения, объёма и времени." },
        ],
      },
      {
        id: "transport",
        title: "REST и WebSocket",
        entries: [
          { path: "market/web/InstrumentController.java", description: "Список инструментов, детали, quote, candles и news." },
          { path: "market/web/MarketController.java", description: "Сводные индексы рынка." },
          { path: "market/websocket/MarketWebSocketHandler.java", description: "Подписка на конкретный тикер и отправка начальной/новой котировки." },
          { path: "market/web/dto/InstrumentResponse.java", description: "Короткая строка инструмента для каталога." },
          { path: "market/web/dto/InstrumentDetailsResponse.java", description: "Расширенные данные одного инструмента." },
          { path: "market/web/dto/QuoteResponse.java · MarketTickResponse.java", description: "REST-снимок и live-событие цены." },
          { path: "market/web/dto/CandleResponse.java", description: "OHLCV-точка графика." },
          { path: "market/web/dto/IndexQuoteResponse.java", description: "Значение и изменение индекса." },
          { path: "market/web/dto/MetricResponse.java · NewsItemResponse.java", description: "Метрики карточки и учебная новость." },
        ],
      },
      {
        id: "storage",
        title: "Репозитории и ошибки",
        entries: [
          { path: "InstrumentRepository.java", description: "Инструменты по тикеру и сортированный список." },
          { path: "CandleRepository.java", description: "Последняя свеча, история по timeframe и конкретный временной bucket." },
          { path: "IndexQuoteRepository.java", description: "Индексы в заданном порядке отображения." },
          { path: "InstrumentNotFoundException.java", description: "Неизвестный тикер." },
          { path: "InvalidTimeframeException.java", description: "Неподдерживаемый интервал свечи." },
        ],
      },
    ],
  },
  {
    slug: "backend-trading",
    order: 9,
    group: "Сервер",
    eyebrow: "Сервер · торговля",
    title: "Заявки, сделки и портфель",
    description: "Заявка проходит проверку, расчёт и исполнение. Исполненная сделка меняет учебный баланс и среднюю цену позиции в одной транзакции.",
    readTime: "14 минут",
    sections: [
      {
        id: "domain",
        title: "Доменные сущности",
        entries: [
          { path: "trading/domain/Order.java", description: "Заявка: направление, тип, количество, лимитная цена, статус, источник и время исполнения." },
          { path: "OrderSide.java", description: "BUY или SELL." },
          { path: "OrderType.java", description: "MARKET исполняется сразу; LIMIT ждёт подходящую цену." },
          { path: "OrderStatus.java", description: "Состояния жизненного цикла заявки." },
          { path: "OrderSource.java", description: "Кто создал заявку: пользователь или агент." },
          { path: "Trade.java", description: "Факт исполнения с ценой, количеством и комиссией." },
          { path: "Position.java", description: "Количество акции и средняя цена на счёте." },
          { path: "PositionId.java", description: "Составной ключ позиции: accountId + instrumentId." },
        ],
      },
      {
        id: "calculation",
        title: "Расчёт и сценарий",
        entries: [
          { path: "application/OrderAnchor.java", description: "Что ввёл пользователь: количество акций или сумму." },
          { path: "application/OrderCalculation.java", description: "Результат расчёта: quantity, gross, commission, total и valid." },
          { path: "application/OrderCalculator.java", description: "Чистая математика заявки и округление комиссии 0,1%." },
          { path: "application/TradingService.java", description: "Предпросмотр, создание, исполнение, отмена, портфель, статистика и лимитные заявки." },
        ],
        note: "Деньги всегда BigDecimal. double запрещён: он даёт ошибки двоичной точности.",
      },
      {
        id: "repositories",
        title: "Хранение",
        entries: [
          { path: "repository/OrderRepository.java", description: "Заявки пользователя, открытые заявки и поиск с учётом владельца." },
          { path: "repository/TradeRepository.java", description: "История сделок, курсор по времени и агрегаты." },
          { path: "repository/PositionRepository.java", description: "Позиции счёта и поиск конкретного инструмента." },
        ],
      },
      {
        id: "web",
        title: "HTTP-контракт",
        entries: [
          { path: "web/TradingController.java", description: "Маршруты preview, orders, trades, stats и portfolio." },
          { path: "dto/PreviewOrderRequest.java", description: "Данные быстрого расчёта до отправки заявки." },
          { path: "dto/CreateOrderRequest.java", description: "Тикер, side, type и ровно одно из quantity/amount." },
          { path: "dto/OrderCalculationResponse.java", description: "Количество, стоимость, комиссия и итог." },
          { path: "dto/OrderResponse.java", description: "Состояние сохранённой заявки." },
          { path: "dto/TradeResponse.java · TradeStatsResponse.java", description: "Одна сделка и сводные показатели." },
          { path: "dto/PortfolioResponse.java", description: "Баланс, позиции и общая стоимость." },
          { path: "dto/HoldingResponse.java · PositionResponse.java", description: "Строка портфеля и подробная позиция." },
        ],
      },
      {
        id: "errors",
        title: "Защитные ошибки",
        entries: [
          { path: "InsufficientFundsException.java", description: "Недостаточно учебного денежного баланса." },
          { path: "InsufficientPositionException.java", description: "Недостаточно акций для продажи." },
          { path: "InvalidOrderException.java", description: "Неверное направление, тип, цена или входное значение." },
          { path: "OrderNotFoundException.java", description: "Заявка не существует или принадлежит другому счёту." },
          { path: "OrderStateException.java", description: "Операция запрещена в текущем состоянии заявки." },
        ],
      },
    ],
  },
  {
    slug: "backend-agents",
    order: 10,
    group: "Сервер",
    eyebrow: "Сервер · агенты",
    title: "Стратегии и журнал решений",
    description: "Агент принадлежит учебному счёту, получает одинаковый рыночный tick, сравнивает изменение цены со своим сигналом и сохраняет объяснение решения.",
    readTime: "12 минут",
    sections: [
      {
        id: "domain",
        title: "Модель агента",
        entries: [
          { path: "agents/domain/Agent.java", description: "Имя, стратегия, статус, риск и индивидуальный порог сигнала." },
          { path: "AgentStrategy.java", description: "AGGRESSIVE, CAREFUL или RANDOM; выбирает профиль стратегии." },
          { path: "StrategyProfile.java", description: "Диапазон сигнала, название риска и правило совпадения с изменением цены." },
          { path: "AgentStatus.java", description: "ACTIVE, PAUSED или ERROR." },
          { path: "AgentAction.java", description: "BUY, SELL или WAIT в журнале решения." },
          { path: "AgentConfig.java", description: "JSON-настройки характера, бюджета и навыков." },
          { path: "AgentDecisionLog.java", description: "Действие, объяснение, проверенные правила, заявка и время." },
        ],
      },
      {
        id: "service",
        title: "Сервис и алгоритм",
        entries: [
          { path: "agents/application/AgentService.java", description: "CRUD агента, конфигурация, журнал и обработка каждого рыночного тика." },
          { path: "AgentRepository.java", description: "Агенты пользователя и список активных агентов." },
          { path: "AgentConfigRepository.java", description: "Настройки агента по его id." },
          { path: "AgentDecisionLogRepository.java", description: "Последние решения и проверка, совершал ли агент покупку." },
        ],
        bullets: [
          "MarketTickEngine вызывает AgentService.onTick.",
          "Пауза и уже выполненная покупка защищают от повторного действия.",
          "StrategyProfile сравнивает changePercent с персональным triggerPercent.",
          "При BUY TradingService создаёт настоящую учебную сделку от имени агента.",
          "Любой результат сохраняется в AgentDecisionLog с человекочитаемой причиной.",
        ],
      },
      {
        id: "web",
        title: "API агентов",
        entries: [
          { path: "agents/web/AgentController.java", description: "Создание, список, карточка, статус, удаление, конфигурация и журнал." },
          { path: "dto/CreateAgentRequest.java", description: "Имя и строковое название стратегии." },
          { path: "dto/AgentResponse.java", description: "Публичные данные агента без внутренних JPA-полей." },
          { path: "dto/DecisionResponse.java", description: "Одно объяснённое решение для журнала." },
        ],
      },
      {
        id: "limitations",
        title: "Текущие ограничения",
        bullets: [
          "Сейчас агент покупает фиксированные 0,1 акции и не выполняет автоматическую продажу.",
          "После первой успешной покупки агент больше не покупает повторно.",
          "character, budget и skills уже хранятся, но пока не меняют решение стратегии.",
          "Симуляционный модуль удалён из текущего исходного кода; документация не должна обещать несуществующий API backtest.",
        ],
      },
    ],
  },
  {
    slug: "data-and-tests",
    order: 11,
    group: "Сервер",
    eyebrow: "Сервер · данные",
    title: "База, миграции и тесты",
    description: "Flyway единолично меняет схему. Hibernate только проверяет соответствие сущностей таблицам, а тесты защищают самые рискованные расчёты и правила.",
    readTime: "11 минут",
    sections: [
      {
        id: "config",
        title: "Конфигурация и ресурсы",
        entries: [
          { path: "src/main/resources/application.yml", description: "DB_URL, DB_USER, DB_PASSWORD, Flyway, порт 8080, JWT и CORS." },
          { path: "src/main/resources/README.md", description: "Объясняет назначение ресурсов приложения." },
          { path: "db/migration/README.md", description: "Правила добавления и именования миграций." },
          { path: ".env", description: "Локальные секреты и адреса. Никогда не коммитится." },
          { path: ".env.example", description: "Безопасный шаблон обязательных переменных без реальных секретов." },
        ],
      },
      {
        id: "migrations",
        title: "Миграции по порядку",
        entries: [
          { path: "V1__init.sql", description: "Базовая точка истории схемы." },
          { path: "V2__auth.sql", description: "users, accounts и refresh_tokens." },
          { path: "V3__market.sql", description: "instruments, candles, index_quotes и начальные данные." },
          { path: "V4__fix_instrument_currency_type.sql", description: "Приводит тип currency к JPA-модели." },
          { path: "V5__trading.sql", description: "orders, trades и positions." },
          { path: "V6__agents_and_simulations.sql", description: "Исходные таблицы агентов и прежней симуляции." },
          { path: "V7__remove_demo_balances.sql", description: "Удаляет устаревшие демонстрационные балансы." },
          { path: "V8__fund_all_accounts.sql", description: "Пополняет учебные счета для рабочих сценариев." },
          { path: "V9__remove_simulations.sql", description: "Удаляет больше не используемые таблицы симуляций." },
          { path: "V10__assign_agent_signals.sql", description: "Добавляет и заполняет индивидуальные сигналы агентов." },
        ],
        note: "Нельзя изменять уже применённую миграцию. Любое изменение схемы оформляется новым V11, V12 и далее.",
      },
      {
        id: "tests",
        title: "Автоматические тесты",
        entries: [
          { path: "BackendApplicationTests.java", description: "Проверяет, что Spring-контекст собирается." },
          { path: "SyntheticMarketDataProviderTest.java", description: "Детерминированность синтетических цен и объёма." },
          { path: "OrderCalculatorTest.java", description: "Финансовая математика, округления и ошибочные значения." },
          { path: "StrategyProfileTest.java", description: "Диапазоны сигналов и правила стратегий агентов." },
          { path: "src/test/.../README.md", description: "Правила расположения и запуска backend-тестов." },
        ],
        code: "# тесты сервера\ncd apps/backend\n./mvnw test\n\n# проверка интерфейса\ncd ../web\nnpm run build",
      },
      {
        id: "docs",
        title: "Технические документы apps/backend/docs",
        entries: [
          { path: "00-overview.md", description: "Общая архитектура, стек и оценка объёма." },
          { path: "01-data-model.md", description: "Сущности, поля и связи базы." },
          { path: "02-api-contract.md", description: "REST и WebSocket по сценариям интерфейса." },
          { path: "03-market-data-and-agents-engine.md", description: "Источник рынка и логика агентов." },
          { path: "04-roadmap.md", description: "История фаз и план развития." },
          { path: "05-frontend-integration.md", description: "Переход интерфейса с тестовых данных на API." },
          { path: "06-phase-2-market.md", description: "Подробное объяснение рынка." },
          { path: "07-phase-3-trading.md", description: "Подробное объяснение торговли." },
          { path: "08-phase-4-agents.md", description: "Подробное объяснение агентов." },
          { path: "09-terminal-and-agents.md", description: "Актуальная связка терминала и агентских сигналов." },
        ],
      },
    ],
  },
  {
    slug: "team-workflow",
    order: 12,
    group: "Процессы",
    eyebrow: "Командная работа",
    title: "Как безопасно менять проект",
    description: "Короткие правила для разработки, review и постановки задач. Они помогают следующему человеку понять изменение без устного контекста.",
    readTime: "9 минут",
    sections: [
      {
        id: "code",
        title: "Правила кода",
        bullets: [
          "Один компонент или класс — одна ответственность и одна причина изменения.",
          "Композиция небольших модулей предпочтительнее наследования и больших универсальных файлов.",
          "Новый UI собирается из components/ui; новый запрос — из lib/api; бизнес-правило — в application.",
          "Финансовые значения на сервере хранятся в BigDecimal, время — Instant, идентификаторы — UUID.",
          "В интерфейсе используются только Hugeicons. Новые библиотеки анимаций не добавляются.",
          "Нет мёртвого кода, временных заглушек, закомментированных реализаций и секретов в репозитории.",
        ],
      },
      {
        id: "task",
        title: "Хорошая задача содержит",
        entries: [
          { path: "Контекст", description: "Что сейчас происходит и почему изменение нужно пользователю или команде." },
          { path: "Ожидаемый результат", description: "Наблюдаемое поведение после завершения." },
          { path: "Границы", description: "Что входит и что намеренно не входит в задачу." },
          { path: "Критерии приёмки", description: "Проверяемые пункты без слов «красиво» и «работает нормально»." },
          { path: "Риск", description: "Авторизация, деньги, миграции, удаление данных или изменение контракта API." },
          { path: "Материалы", description: "Макет, endpoint, связанный файл, скриншот или решение ADR." },
        ],
      },
      {
        id: "workflow",
        title: "Путь изменения",
        bullets: [
          "Создайте небольшую ветку от актуального состояния проекта.",
          "Сначала зафиксируйте контракт и риск, затем меняйте минимально необходимый слой.",
          "Добавьте или обновите тест для изменённого поведения.",
          "Запустите build/test и проверьте основной сценарий вручную.",
          "Обновите документацию и lib/changelog.json простым русским текстом.",
          "В PR объясните решение, способ проверки и известные ограничения.",
        ],
      },
      {
        id: "done",
        title: "Когда задача готова",
        bullets: [
          "Код компилируется, тесты и TypeScript проходят.",
          "Нет ошибок браузерной консоли и горизонтального скролла на мобильном экране.",
          "API не раскрывает passwordHash, tokenHash и внутренние JPA-структуры.",
          "Миграция добавлена новым файлом и проверена на чистой базе.",
          "Клавиатурный focus виден, интерактивные элементы имеют понятные названия.",
          "README, docs и changelog соответствуют фактическому поведению.",
        ],
        note: "Задача не завершена, если код написан, но следующий разработчик не понимает, как проверить результат.",
      },
    ],
  },
];

export const docsGroups = ["Начало", "Интерфейс", "Сервер", "Процессы"] as const;

export function getDocPage(slug?: string): DocPage | undefined {
  return docsPages.find((page) => page.slug === (slug ?? "overview"));
}

export function getAdjacentPages(page: DocPage) {
  const index = docsPages.findIndex((candidate) => candidate.slug === page.slug);
  return {
    previous: index > 0 ? docsPages[index - 1] : undefined,
    next: index < docsPages.length - 1 ? docsPages[index + 1] : undefined,
  };
}
