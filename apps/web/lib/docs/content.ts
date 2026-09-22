export interface DocEntry {
  path: string;
  description: string;
  href?: string;
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

export const docsGroups = ["Начало", "Задачи", "Frontend", "Backend", "Данные и разработка"] as const;
export type DocsGroup = (typeof docsGroups)[number];

export interface DocPage {
  slug: string;
  order: number;
  group: DocsGroup;
  eyebrow: string;
  title: string;
  description: string;
  readTime: string;
  sections: DocSection[];
  kind?: "article" | "task";
}

const taskCodeStyle: DocSection = {
  id: "code-style",
  title: "Сначала прочитайте кодстайл",
  description: "Эти правила обязательны для каждой задачи. Они также попадут в буфер обмена вместе с техническим заданием.",
  bullets: [
    "Перед изменением frontend откройте apps/web/CLAUDE.md. Там зафиксированы правила иконок, анимаций, дизайна и changelog.",
    "Один файл или класс отвечает за одну понятную вещь. Новую механику собирайте из небольших частей, а не добавляйте всё в один экран или сервис.",
    "Сохраняйте типы, проверяйте входные данные на сервере и не оставляйте неиспользуемый код, заглушки или копии одной и той же логики.",
    "Новые таблицы и поля добавляйте только отдельной Flyway-миграцией. Уже применённые миграции не переписывают.",
    "Создавайте feature/*, fix/*, docs/* или chore/* от develop. Не работайте прямо в main и не смешивайте несколько задач в одной ветке.",
    "Коммит описывает одно законченное изменение в формате feat(scope): действие. Перед Pull Request укажите проверки и откройте его в develop.",
    "Перед завершением запустите тесты нужного приложения, production build frontend и обновите apps/web/lib/changelog.json.",
  ],
  note: "TRADR остаётся учебной платформой. В задачах ниже используются только учебные деньги; реальные платежи, брокеры и вывод средств не добавляются.",
};

function taskPage(page: Omit<DocPage, "group" | "kind" | "sections"> & { sections: DocSection[] }): DocPage {
  return {
    ...page,
    group: "Задачи",
    kind: "task",
    sections: [taskCodeStyle, ...page.sections],
  };
}

export const docsPages: DocPage[] = [
  {
    slug: "overview",
    order: 1,
    group: "Начало",
    eyebrow: "О продукте",
    title: "Что такое TRADR",
    description: "TRADR — учебная среда, где автономные агенты сами покупают и продают акции. Пользователь задаёт цель, распределяет учебные деньги и наблюдает за объяснимыми решениями.",
    readTime: "6 минут",
    sections: [
      {
        id: "short",
        title: "Коротко",
        bullets: [
          "Каждый новый пользователь получает учебный счёт на $100 000. Это не реальные деньги.",
          "Главная цель по умолчанию — увеличить общий капитал до $110 000, то есть заработать 10%.",
          "Торговать вручную нельзя. Все покупки и продажи выполняют только агенты.",
          "Пользователь выбирает стратегию и бюджет агента, запускает его и следит за результатом.",
          "Каждое решение сохраняется: видно, что агент сделал, с какой акцией и по какой причине.",
        ],
        note: "TRADR показывает механику торговли и риск, но не обещает прибыль и не даёт инвестиционных рекомендаций.",
      },
      {
        id: "goal",
        title: "Что видит пользователь",
        entries: [
          { path: "Общий капитал", description: "Резерв пользователя плюс деньги и текущая стоимость позиций всех агентов." },
          { path: "Прибыль или убыток", description: "Разница между текущим капиталом и стартовыми $100 000." },
          { path: "Прогресс цели", description: "Насколько пользователь приблизился к выбранной сумме или проценту роста." },
          { path: "Лента решений", description: "Анализ, ожидание, покупка и продажа с именем ответственного агента." },
        ],
      },
      {
        id: "parts",
        title: "Из каких частей состоит система",
        entries: [
          { path: "apps/web", description: "Next.js-интерфейс: страницы, формы, графики и работа с API.", tag: "Frontend" },
          { path: "apps/backend", description: "Java и Spring Boot: правила, авторизация, агенты и торговля.", tag: "Backend" },
          { path: "PostgreSQL", description: "Пользователи, счета, агенты, позиции, сделки и история решений.", tag: "Данные" },
          { path: "Flyway", description: "Последовательно обновляет структуру базы при запуске.", tag: "Миграции" },
        ],
      },
      {
        id: "ready",
        title: "Что уже работает",
        bullets: [
          "Вход и пошаговая регистрация с обязательным созданием первого агента.",
          "Dashboard с целью, резервом, капиталом агентов и живой лентой.",
          "Три стратегии, отдельные кошельки и позиции агентов.",
          "Полный цикл: анализ → покупка → удержание → продажа → изменение результата.",
          "Комиссия, take-profit, stop-loss, выход по времени и пауза между сделками.",
          "Синтетический воспроизводимый рынок из 18 акций NASDAQ и NYSE.",
        ],
      },
      {
        id: "not-ready",
        title: "Что пока не подключено",
        bullets: [
          "Реальные биржевые котировки: текущий MarketDataProvider использует только синтетические данные.",
          "Кастомные агенты с JSON-профилем: фиксированным именем, статами и уникальным навыком.",
          "Стабильные и рискованные акции, а также понятная оценка возможного результата до решения агента.",
          "Команды агентов-друзей, их совместные действия и дружеское соревнование.",
          "Time Skip, Google-вход, расширенные настройки и учебные переводы между кошельками агентов одного пользователя.",
          "Сценарий нулевого бюджета: завершение агента и создание нового.",
        ],
        note: "Все будущие возможности описаны отдельными статьями в блоке «Задачи» sidebar. Каждая статья содержит файлы, логику, критерии проверки и кнопку копирования задания.",
      },
    ],
  },
  {
    slug: "quick-start",
    order: 2,
    group: "Начало",
    eyebrow: "Первый запуск",
    title: "Как запустить проект локально",
    description: "Пошаговый запуск базы, backend и frontend. Подходит человеку, который раньше не запускал Java-проект.",
    readTime: "8 минут",
    sections: [
      {
        id: "requirements",
        title: "Что нужно установить",
        bullets: [
          "Node.js 20 или новее — запускает frontend и общие npm-команды.",
          "Java 21 — запускает backend. Java здесь является языком сервера, а не частью браузера.",
          "Docker или OrbStack — запускает PostgreSQL в изолированном контейнере.",
          "Git — хранит историю изменений проекта.",
        ],
      },
      {
        id: "environment",
        title: "Подготовьте настройки",
        code: "cp apps/backend/.env.example apps/backend/.env\ncp apps/web/.env.example apps/web/.env.local",
        note: "В JWT_SECRET поставьте свою случайную строку длиной не меньше 32 символов. Настоящие секреты нельзя отправлять в Git.",
      },
      {
        id: "database",
        title: "Запустите базу данных",
        description: "PostgreSQL будет доступен backend по адресу из DB_URL. При первом запуске Flyway сам создаст нужные таблицы.",
        code: "docker compose -f apps/backend/docker-compose.dev.yml up -d",
      },
      {
        id: "applications",
        title: "Запустите оба приложения",
        code: "# один раз установите зависимости\nnpm install\n\n# затем запускайте frontend и backend вместе\nnpm run dev",
        bullets: [
          "Frontend обычно открывается на http://localhost:3000.",
          "Backend слушает http://localhost:8080.",
          "Проверка backend доступна по http://localhost:8080/health.",
          "Для отдельного запуска есть npm run dev:web и npm run dev:backend.",
        ],
      },
      {
        id: "first-check",
        title: "Быстрая проверка",
        bullets: [
          "Откройте /register и создайте аккаунт.",
          "На третьем шаге оставьте стартовый бюджет $75 000 или выберите другой лимит.",
          "После перехода на Dashboard нажмите «Запустить агента».",
          "В ускоренном режиме первые решения должны появиться в течение нескольких визуальных тиков.",
        ],
      },
    ],
  },
  {
    slug: "repository",
    order: 3,
    group: "Начало",
    eyebrow: "Карта проекта",
    title: "Где что лежит",
    description: "Карта репозитория без сложных терминов: какие папки отвечают за страницы, сервер, базу, дизайн и проверки.",
    readTime: "7 минут",
    sections: [
      {
        id: "root",
        title: "Корень проекта",
        entries: [
          { path: "github.com/Hqzdev/tradr", description: "Основной GitHub-репозиторий проекта: ветки, Pull Request и история изменений.", href: "https://github.com/Hqzdev/tradr", tag: "GitHub" },
          { path: "README.md", description: "Короткое описание продукта и команды первого запуска." },
          { path: "ARCHITECTURE.md", description: "Схема связей frontend, backend и базы данных." },
          { path: "DEVELOPMENT.md", description: "Локальная разработка, команды и диагностика проблем." },
          { path: "CONTRIBUTING.md", description: "Правила веток, коммитов, Pull Request и проверок перед слиянием." },
          { path: "CHANGELOG.md", description: "Изменения репозитория, важные для разработчиков." },
          { path: "apps/", description: "Два рабочих приложения: web и backend." },
          { path: "design/ · qa/", description: "Макеты, изображения и результаты ручных проверок." },
        ],
      },
      {
        id: "web",
        title: "Frontend: apps/web",
        entries: [
          { path: "app/", description: "Маршруты Next.js. Структура папок превращается в адреса страниц." },
          { path: "components/", description: "Экранные и переиспользуемые React-компоненты." },
          { path: "lib/api/", description: "Функции, которые отправляют запросы в backend." },
          { path: "lib/docs/content.ts", description: "Источник статей, групп и содержания документации." },
          { path: "public/", description: "Локальные изображения и логотипы, доступные браузеру." },
        ],
      },
      {
        id: "backend",
        title: "Backend: apps/backend",
        entries: [
          { path: "src/main/java/", description: "Java-код сервера, разбитый по областям продукта." },
          { path: "src/main/resources/application.yml", description: "Связь Spring с переменными окружения." },
          { path: "src/main/resources/db/migration/", description: "SQL-миграции Flyway от V1 до V15." },
          { path: "src/test/", description: "Автоматические тесты backend." },
          { path: "docs/", description: "Подробная техническая документация backend." },
        ],
      },
      {
        id: "generated",
        title: "Что не редактируют вручную",
        entries: [
          { path: "apps/web/.next/", description: "Результат сборки Next.js.", warning: "Генерируется" },
          { path: "node_modules/", description: "Установленные npm-пакеты.", warning: "Генерируется" },
          { path: "apps/backend/target/", description: "Скомпилированные Java-файлы и отчёты Maven.", warning: "Генерируется" },
          { path: ".git/", description: "Внутренняя история Git.", warning: "Служебная папка" },
        ],
      },
    ],
  },
  {
    slug: "user-flow",
    order: 4,
    group: "Начало",
    eyebrow: "Путь пользователя",
    title: "От регистрации до первой продажи",
    description: "Полный пользовательский сценарий: от создания аккаунта до закрытия позиции агентом.",
    readTime: "7 минут",
    sections: [
      {
        id: "register",
        title: "1. Регистрация",
        bullets: [
          "Пользователь вводит имя и e-mail.",
          "Задаёт пароль длиной не меньше восьми символов и повторяет его.",
          "Даёт имя первому агенту, выбирает стратегию и бюджет.",
          "Backend одной транзакцией создаёт пользователя, счёт, остановленного агента, его кошелёк и токены.",
        ],
      },
      {
        id: "dashboard",
        title: "2. Первый Dashboard",
        bullets: [
          "Резерв показывает деньги, ещё не переданные агентам.",
          "Выделенный капитал показывает сумму начальных бюджетов агентов.",
          "Главная кнопка запускает первого агента. До нажатия он не торгует.",
          "Ускорение ×20 включено для нового счёта по умолчанию.",
        ],
      },
      {
        id: "decision",
        title: "3. Решение агента",
        bullets: [
          "На каждом разрешённом цикле агент проверяет все доступные акции.",
          "Если акция уже куплена, сначала проверяются прибыль, убыток и время удержания.",
          "Если позиции нет, стратегия решает, подходит ли текущий момент для покупки.",
          "BUY, SELL или WAIT попадает в журнал с понятной причиной.",
        ],
      },
      {
        id: "money",
        title: "4. Как меняются деньги",
        bullets: [
          "При покупке деньги и комиссия списываются только из кошелька конкретного агента.",
          "Купленная акция появляется в agent_positions.",
          "При продаже выручка после комиссии возвращается тому же агенту.",
          "Общий капитал равен резерву плюс текущая стоимость всех агентов.",
        ],
      },
      {
        id: "control",
        title: "5. Что может сделать пользователь",
        bullets: [
          "Запустить или поставить агента на паузу.",
          "Изменить выделенный капитал, когда агент остановлен.",
          "Изменить общую финансовую цель и скорость симуляции.",
          "Закрыть агента: сервер продаст позиции, вернёт деньги и сохранит историю.",
        ],
      },
    ],
  },
  {
    slug: "web-routes",
    order: 5,
    group: "Frontend",
    eyebrow: "Frontend · страницы",
    title: "Маршруты интерфейса",
    description: "Какая страница за что отвечает и куда ведут старые адреса после перехода на агентскую модель.",
    readTime: "8 минут",
    sections: [
      {
        id: "public",
        title: "Публичные страницы",
        entries: [
          { path: "/", description: "Лендинг с учебным симулятором и плавающими логотипами акций." },
          { path: "/docs", description: "Документация, поиск, левый сайдбар и содержание статьи." },
          { path: "/about · /developers · /help", description: "Информация о продукте, разработке и помощи." },
          { path: "/privacy · /governance · /contact", description: "Политика, управление проектом и форма связи." },
        ],
      },
      {
        id: "auth",
        title: "Вход и регистрация",
        entries: [
          { path: "/login", description: "E-mail, пароль, безопасная общая ошибка и возврат по разрешённому next." },
          { path: "/register", description: "Три шага: профиль, пароль и обязательный первый агент." },
        ],
      },
      {
        id: "main",
        title: "Основная рабочая среда",
        entries: [
          { path: "/dashboard", description: "Капитал, цель, резерв, скорость, главный агент и лента действий." },
          { path: "/agents", description: "Все активные и остановленные агенты пользователя." },
          { path: "/agents/[id]", description: "Кошелёк, позиции, доходность, кривая капитала и управление." },
          { path: "/history", description: "История сделок и действий с указанием имени агента." },
          { path: "/market", description: "Список акций, текущие цены и изменение рынка." },
          { path: "/market/[ticker]", description: "График и метрики без ручной кнопки покупки." },
        ],
      },
      {
        id: "redirects",
        title: "Старые адреса",
        entries: [
          { path: "/terminal", description: "Перенаправляет на /dashboard: ручной терминал больше не используется." },
          { path: "/portfolio", description: "Перенаправляет на /dashboard: капитал собран вокруг агентов." },
          { path: "/orders", description: "Сохраняется только для совместимого просмотра старых данных." },
        ],
        note: "Наличие старого компонента в components/screens не означает, что он доступен пользователю. Источник правды — файлы app/**/page.tsx.",
      },
      {
        id: "navigation",
        title: "Основная навигация",
        bullets: [
          "Обзор — результат и следующий шаг.",
          "Агенты — управление исполнителями и их капиталом.",
          "Активность — сделки и объяснения действий.",
          "Рынок — аналитика без ручной торговли.",
        ],
      },
    ],
  },
  {
    slug: "web-auth",
    order: 6,
    group: "Frontend",
    eyebrow: "Frontend · авторизация",
    title: "Вход и мастер регистрации",
    description: "Как устроена авторизация в интерфейсе, зачем нужны три шага и как пользователь безопасно возвращается на нужную страницу.",
    readTime: "9 минут",
    sections: [
      {
        id: "shell",
        title: "Общая оболочка",
        entries: [
          { path: "components/auth/AuthShell.tsx", description: "Фон, логотип, возврат на лендинг и декоративные акции." },
          { path: "components/auth/AuthCard.tsx", description: "Белая центральная карточка входа и регистрации." },
          { path: "components/auth/AuthField.tsx", description: "Поле с подписью, ошибкой и доступным focus-состоянием." },
          { path: "components/auth/AuthStepFrame.tsx", description: "Плавно меняет шаг и высоту карточки без скачка." },
        ],
      },
      {
        id: "login",
        title: "Сценарий входа",
        bullets: [
          "Форма проверяет формат e-mail и наличие пароля.",
          "Кнопка блокируется во время запроса, поэтому двойного submit нет.",
          "При неверных данных показывается одна безопасная ошибка без подтверждения существования e-mail.",
          "После успеха пользователь попадает на безопасный next или на /dashboard.",
        ],
      },
      {
        id: "wizard",
        title: "Три шага регистрации",
        bullets: [
          "Шаг 1: имя и e-mail.",
          "Шаг 2: пароль и подтверждение с живой проверкой длины и совпадения.",
          "Шаг 3: имя агента, стратегия и бюджет от $1 000 до $100 000.",
          "При движении назад значения не теряются. API вызывается только на последнем шаге.",
        ],
      },
      {
        id: "state",
        title: "Где хранится состояние",
        entries: [
          { path: "lib/AuthWizard.ts", description: "Логика шагов, валидации и итогового payload без визуальных деталей." },
          { path: "components/screens/RegisterScreen.tsx", description: "Связывает AuthWizard с полями, анимацией и API." },
          { path: "lib/authRedirect.ts", description: "Не разрешает внешний или опасный next-адрес." },
          { path: "lib/auth.ts", description: "Хранит access и refresh токены для запросов." },
        ],
      },
      {
        id: "motion",
        title: "Движение и доступность",
        bullets: [
          "Карточка появляется с небольшим подъёмом и blur-to-focus.",
          "Шаги смещаются в направлении перехода.",
          "Декоративные сферы не перехватывают клики и скрыты от экранных дикторов.",
          "При prefers-reduced-motion остаются только короткие изменения прозрачности.",
        ],
      },
    ],
  },
  {
    slug: "web-components",
    order: 7,
    group: "Frontend",
    eyebrow: "Frontend · компоненты",
    title: "Как собран интерфейс",
    description: "Страницы выбирают экран, экран управляет сценарием, а UI-компонент отвечает за один визуальный элемент.",
    readTime: "9 минут",
    sections: [
      {
        id: "levels",
        title: "Три уровня",
        entries: [
          { path: "app/**/page.tsx", description: "Точка маршрута. Обычно только подключает нужный экран." },
          { path: "components/screens/", description: "Сценарий экрана: запросы, loading, ошибки и действия." },
          { path: "components/ui/", description: "Кнопка, карточка, поле, вкладки, toggle и другие блоки." },
        ],
      },
      {
        id: "product",
        title: "Главные экраны",
        entries: [
          { path: "DashboardScreen.tsx", description: "Загружает результат, редактирует цель и меняет ускорение." },
          { path: "AgentsListScreen.tsx", description: "Показывает агентов, статус и капитал." },
          { path: "AgentDetailScreen.tsx", description: "Позиции, доходность, журнал и управление агентом." },
          { path: "MarketScreen.tsx", description: "Каталог акций и переход к аналитике." },
          { path: "TradeHistoryScreen.tsx", description: "Read-only история действий агентов." },
        ],
      },
      {
        id: "shared",
        title: "Переиспользуемые элементы",
        entries: [
          { path: "Sidebar.tsx", description: "Навигация, профиль и версия из changelog." },
          { path: "ui/Button.tsx", description: "Кнопки, loading и disabled." },
          { path: "ui/Toggle.tsx", description: "Переключатель скорости." },
          { path: "charts/CapitalChart.tsx", description: "Кривая капитала агента." },
          { path: "market/StockMark.tsx", description: "Локальный логотип и обозначение акции." },
        ],
      },
      {
        id: "states",
        title: "Обязательные состояния",
        bullets: [
          "Loading показывает, что запрос выполняется.",
          "Error объясняет проблему и даёт повторить действие, когда это полезно.",
          "Empty объясняет, почему данных нет и как их создать.",
          "Success сразу отражает новый результат.",
          "Disabled честно показывает невозможное действие.",
        ],
      },
      {
        id: "style",
        title: "Типографика и движение",
        bullets: [
          "Продукт использует Basel-подобный профиль на базе Inter и tracking −0.02em.",
          "Веса 400, 485, 500 и 535 создают спокойную иерархию.",
          "Анимации написаны на CSS без отдельной motion-библиотеки.",
          "Hover и focus-visible обязательны для кликабельных элементов.",
        ],
      },
    ],
  },
  {
    slug: "web-data",
    order: 8,
    group: "Frontend",
    eyebrow: "Frontend · данные",
    title: "Как frontend разговаривает с backend",
    description: "Простой разбор запросов, токенов, типов и обновления живых данных.",
    readTime: "10 минут",
    sections: [
      {
        id: "client",
        title: "Один общий клиент",
        entries: [
          { path: "lib/api/client.ts", description: "Берёт URL, добавляет access token, отправляет fetch и приводит ошибки к одному виду." },
          { path: "NEXT_PUBLIC_API_BASE_URL", description: "REST API, например http://localhost:8080/api/v1." },
          { path: "NEXT_PUBLIC_WS_BASE_URL", description: "WebSocket, например ws://localhost:8080/ws." },
        ],
      },
      {
        id: "modules",
        title: "API разделён по областям",
        entries: [
          { path: "lib/api/auth.ts", description: "Регистрация, вход, токены и пользователь." },
          { path: "lib/api/dashboard.ts", description: "Капитал, цель, ускорение, агенты и события." },
          { path: "lib/api/agents.ts", description: "Создание, запуск, пауза, закрытие и performance." },
          { path: "lib/api/market.ts", description: "Инструменты, свечи, котировки и аналитика." },
          { path: "lib/api/trading.ts", description: "Только чтение заявок, сделок и совместимой статистики." },
        ],
      },
      {
        id: "request-flow",
        title: "Путь запроса",
        bullets: [
          "Экран вызывает функцию своего API-модуля.",
          "apiFetch добавляет Authorization: Bearer, если пользователь вошёл.",
          "Backend проверяет токен и возвращает JSON.",
          "TypeScript-тип помогает правильно прочитать поля ответа.",
          "При 401 клиент может обновить access token и повторить запрос.",
        ],
      },
      {
        id: "live",
        title: "Живые обновления",
        description: "Котировки могут приходить по WebSocket, а важные агрегаты Dashboard периодически перечитываются через REST. Это проще и надёжнее, чем передавать всё одним каналом.",
      },
      {
        id: "errors",
        title: "Ошибки",
        bullets: [
          "Backend возвращает { message }, а не HTML или внутренний stack trace.",
          "Интерфейс переводит ошибку в действие: повторить, исправить поле или войти заново.",
          "Сообщение не должно раскрывать чужой аккаунт, токен или устройство базы.",
        ],
      },
    ],
  },
  {
    slug: "backend-java",
    order: 9,
    group: "Backend",
    eyebrow: "Backend · основы",
    title: "Java и Spring простыми словами",
    description: "Минимальный словарь для чтения backend-кода. Знать Java заранее не обязательно.",
    readTime: "10 минут",
    sections: [
      {
        id: "java",
        title: "Что делает Java",
        bullets: [
          "Java-код компилируется в программу, которая постоянно работает на сервере.",
          "Класс описывает объект или сервис. Agent хранит состояние, AgentService выполняет сценарии.",
          "Метод — действие класса. start запускает агента, performance считает его результат.",
          "BigDecimal защищает финансовые расчёты от ошибок обычных дробных чисел.",
        ],
      },
      {
        id: "spring",
        title: "Что добавляет Spring Boot",
        bullets: [
          "@RestController превращает методы Java в HTTP-адреса.",
          "@Service обозначает класс с бизнес-правилами.",
          "Repository читает и сохраняет PostgreSQL без ручного SQL в каждом методе.",
          "@Transactional сохраняет несколько изменений как одно целое или откатывает их все.",
          "@Scheduled запускает tick-движок через заданный интервал.",
        ],
      },
      {
        id: "request",
        title: "Путь одного запроса",
        code: "Browser → Controller → Service → Repository → PostgreSQL\n                              ↓\n                         JSON response",
        note: "Controller не считает прибыль и не выбирает стратегию. Он принимает запрос и передаёт работу сервису.",
      },
      {
        id: "words",
        title: "Частые слова",
        entries: [
          { path: "Entity", description: "Java-объект, связанный с таблицей базы данных." },
          { path: "DTO", description: "Безопасная форма входного или выходного JSON." },
          { path: "UUID", description: "Уникальный идентификатор записи." },
          { path: "Optional", description: "Значение, которое может существовать или отсутствовать." },
          { path: "Enum", description: "Закрытый список, например ACTIVE, PAUSED и ARCHIVED." },
        ],
      },
      {
        id: "reading",
        title: "Как читать незнакомый модуль",
        bullets: [
          "Начните с Controller, чтобы увидеть адреса.",
          "Перейдите в Service и найдите бизнес-сценарий.",
          "Посмотрите Entity, чтобы понять хранимые поля.",
          "Посмотрите DTO, чтобы понять ответ frontend.",
          "В конце откройте тест: он часто показывает правило короче комментариев.",
        ],
      },
    ],
  },
  {
    slug: "backend-architecture",
    order: 10,
    group: "Backend",
    eyebrow: "Backend · архитектура",
    title: "Модули и ответственность",
    description: "Backend — один Spring Boot-процесс, но код разделён на независимые области продукта.",
    readTime: "9 минут",
    sections: [
      {
        id: "modules",
        title: "Области продукта",
        entries: [
          { path: "auth", description: "Пользователи, пароли, JWT, refresh token и учебный счёт." },
          { path: "dashboard", description: "Капитал, цель, резерв, ускорение и общая лента." },
          { path: "market", description: "Акции, свечи, котировки, генератор и WebSocket." },
          { path: "agents", description: "Создание, кошельки, позиции, стратегии и решения." },
          { path: "trading", description: "Агентские сделки, комиссия и read-only история." },
          { path: "common", description: "Единый формат ошибок и общие механизмы." },
        ],
      },
      {
        id: "inside",
        title: "Слои внутри области",
        entries: [
          { path: "domain", description: "Состояние и правила предметного объекта." },
          { path: "application", description: "Сценарий из нескольких шагов, например закрытие агента." },
          { path: "repository", description: "Чтение и запись данных." },
          { path: "web", description: "HTTP-маршруты и JSON-контракты." },
          { path: "exception", description: "Понятные ошибки конкретной области." },
        ],
      },
      {
        id: "principles",
        title: "Основные правила",
        bullets: [
          "Один класс отвечает за одну понятную задачу.",
          "Сервисы соединяются через композицию, а не глубокое наследование.",
          "Frontend не решает, можно ли купить акцию: это правило backend.",
          "Backend не возвращает JPA Entity напрямую: наружу выходят DTO.",
          "Схему базы меняет Flyway, Hibernate только проверяет её.",
        ],
      },
      {
        id: "transaction",
        title: "Почему важны транзакции",
        description: "Регистрация, перевод бюджета, покупка и закрытие агента меняют несколько записей. Если один шаг падает, транзакция возвращает базу к состоянию до начала операции.",
      },
      {
        id: "ownership",
        title: "Граница пользователя",
        bullets: [
          "JWT-фильтр кладёт UUID вошедшего пользователя в Authentication.",
          "Сервис ищет счёт и агента только внутри этого пользователя.",
          "Идентификатор в URL сам по себе не даёт доступ к чужому агенту.",
        ],
      },
    ],
  },
  {
    slug: "backend-auth",
    order: 11,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация на backend: папка auth",
    description: "Карта всего модуля входа: регистрация, токены, пользовательский счёт и граница защищённых запросов.",
    readTime: "8 минут",
    sections: [
      {
        id: "auth-folder",
        title: "Папка auth простыми словами",
        description: "Это весь модуль входа. Он создаёт учётную запись, проверяет пароль, выдаёт токены и сообщает остальному backend, кто сделал защищённый запрос.",
        entries: [
          { path: "auth/", description: "Корень модуля и README с картой подпапок.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth", tag: "Backend" },
          { path: "application · domain · exception", description: "Сценарии входа, хранимые данные и ожидаемые ошибки." },
          { path: "repository · security · web", description: "Доступ к базе, проверка JWT и HTTP-адреса с JSON-формами." },
        ],
        note: "Ниже в Backend у каждой подпапки auth есть отдельная статья с объяснением каждого файла.",
      },
      {
        id: "register",
        title: "Регистрация одной транзакцией",
        bullets: [
          "Проверяется уникальность e-mail.",
          "Пароль превращается в BCrypt-хэш. Исходный пароль в базе не хранится.",
          "Создаётся Account со стартовыми $100 000, целью $110 000 и ускорением.",
          "Если передан firstAgent, создаются Agent, AgentConfig, AgentWallet и первая точка капитала.",
          "Только после успешных шагов выдаются access и refresh токены.",
        ],
      },
      {
        id: "endpoints",
        title: "API авторизации",
        entries: [
          { path: "POST /api/v1/auth/register", description: "Создаёт пользователя, счёт и необязательного первого агента." },
          { path: "POST /api/v1/auth/login", description: "Проверяет данные и выдаёт новую пару токенов." },
          { path: "POST /api/v1/auth/refresh", description: "Отзывает старый refresh token и выдаёт новый." },
          { path: "POST /api/v1/auth/logout", description: "Отзывает refresh token; повторный вызов безопасен." },
          { path: "GET /api/v1/auth/me", description: "Возвращает текущего пользователя." },
        ],
      },
      {
        id: "tokens",
        title: "Два токена",
        entries: [
          { path: "Access token", description: "Короткоживущий JWT для защищённых запросов." },
          { path: "Refresh token", description: "Случайная длинная строка для получения новой сессии." },
          { path: "refresh_tokens.token_hash", description: "В базе хранится SHA-256-хэш, а не рабочий refresh token." },
        ],
      },
      {
        id: "first-agent",
        title: "Проверка firstAgent",
        bullets: [
          "Имя обязательно и ограничено по длине.",
          "Стратегия принимает careful, aggressive или random.",
          "Бюджет находится в диапазоне $1 000–100 000.",
          "Старый клиент может не передавать firstAgent: контракт остаётся совместимым.",
        ],
      },
      {
        id: "errors",
        title: "Безопасные ошибки",
        bullets: [
          "Неверный e-mail и неверный пароль дают одинаковое сообщение.",
          "В ответ не попадают passwordHash, tokenHash и внутренние Entity.",
          "Все ошибки API приводятся к формату { message }.",
        ],
      },
    ],
  },
  {
    slug: "backend-auth-application",
    order: 12,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка application",
    description: "Сценарии регистрации, входа, обновления токена, выхода и получения текущего пользователя.",
    readTime: "10 минут",
    sections: [
      {
        id: "folder",
        title: "Папка application",
        entries: [
          { path: "auth/application/", description: "Прикладная логика авторизации. Здесь соединяются базы, пароль, токены и создание первого агента, но нет HTTP-контроллеров.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/application", tag: "Backend" },
          { path: "AuthService.java", description: "Единственный сервис папки: реализует register, login, refresh, logout и me.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/application/AuthService.java" },
          { path: "README.md", description: "Короткая памятка: AuthService координирует сценарии и не зависит от HTTP-классов.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/application/README.md" },
        ],
      },
      {
        id: "register",
        title: "Регистрация одной транзакцией",
        bullets: [
          "Проверяется уникальность e-mail, а пароль превращается в BCrypt-хэш.",
          "Создаются User и учебный Account со стартовыми $100 000 в USD.",
          "Если пришёл firstAgent, AuthService передаёт его AgentProvisioner. Пользователь, счёт и первый агент создаются как одна операция.",
          "Только после успешного сохранения выдаются access и refresh-токены; ответ может содержать firstAgentId.",
        ],
      },
      {
        id: "sessions",
        title: "Вход и сессия",
        entries: [
          { path: "login", description: "Находит пользователя по e-mail и проверяет пароль через PasswordEncoder. Неверный пароль и неизвестный e-mail возвращают одинаковую ошибку." },
          { path: "refresh", description: "Находит SHA-256-хэш refresh-токена, проверяет срок и отзыв, отзывает старую запись и выпускает новую пару токенов." },
          { path: "logout", description: "Отзывает сохранённый refresh-токен. Повторный logout не считается ошибкой." },
          { path: "me", description: "По UUID, уже проверенному JWT-фильтром, возвращает безопасный UserResponse." },
        ],
        note: "Refresh-токен — случайная строка из 32 байт. В PostgreSQL хранится только её SHA-256-хэш, а не рабочий токен.",
      },
    ],
  },
  {
    slug: "backend-auth-domain",
    order: 13,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка domain",
    description: "Данные auth в PostgreSQL: пользователь, его учебный счёт и серверные записи refresh-токенов.",
    readTime: "9 минут",
    sections: [
      {
        id: "folder",
        title: "Папка domain",
        entries: [
          { path: "auth/domain/", description: "JPA-сущности auth. Названия таблиц и столбцов должны совпадать с Flyway-миграцией V2__auth.sql.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/domain", tag: "Backend" },
          { path: "README.md", description: "Напоминает, что здесь находятся User, Account и серверные RefreshToken-записи.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/domain/README.md" },
        ],
      },
      {
        id: "models",
        title: "Три модели",
        entries: [
          { path: "User.java", description: "Уникальный e-mail, BCrypt-хэш пароля, отображаемое имя и дата создания. passwordHash не выходит в API-ответы.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/domain/User.java" },
          { path: "Account.java", description: "Один учебный счёт на пользователя: резерв денег, стартовый баланс, валюта, цель капитала и настройка ускорения. debit и credit меняют только резерв.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/domain/Account.java" },
          { path: "RefreshToken.java", description: "ID пользователя, хэш refresh-токена, срок действия, дата отзыва и создания. revoke ставит время отзыва вместо удаления истории.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/domain/RefreshToken.java" },
        ],
      },
      {
        id: "relations",
        title: "Как связаны данные",
        code: "User 1 ── 1 Account\nUser 1 ── N RefreshToken",
        note: "У нового пользователя баланс $100 000, а цель по умолчанию равна 110% стартового баланса.",
      },
    ],
  },
  {
    slug: "backend-auth-exception",
    order: 14,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка exception",
    description: "Ожидаемые ошибки регистрации и сессии: понятный статус и сообщение без утечки лишних данных.",
    readTime: "6 минут",
    sections: [
      {
        id: "folder",
        title: "Папка exception",
        entries: [
          { path: "auth/exception/", description: "Ошибки, относящиеся только к регистрации и сессии.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/exception", tag: "Backend" },
          { path: "README.md", description: "Объясняет, что общий GlobalExceptionHandler превращает эти ошибки в API-ответы.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/exception/README.md" },
        ],
      },
      {
        id: "classes",
        title: "Каждый класс",
        entries: [
          { path: "EmailAlreadyExistsException.java", description: "Регистрация с занятым e-mail. GlobalExceptionHandler возвращает HTTP 409 Conflict.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/exception/EmailAlreadyExistsException.java" },
          { path: "InvalidCredentialsException.java", description: "Один ответ для неизвестного e-mail и неверного пароля: «Неверный e-mail или пароль». Так вход не раскрывает, зарегистрирован ли адрес.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/exception/InvalidCredentialsException.java" },
          { path: "InvalidRefreshTokenException.java", description: "Refresh-токен не найден, уже отозван или истёк. Backend возвращает HTTP 401, и frontend просит войти снова.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/exception/InvalidRefreshTokenException.java" },
        ],
      },
      {
        id: "response",
        title: "Единый ответ",
        code: "{ \"message\": \"Неверный e-mail или пароль\" }",
        description: "Контроллеры не повторяют try/catch. GlobalExceptionHandler собирает ошибки в одном месте и возвращает frontend стабильное поле message.",
      },
    ],
  },
  {
    slug: "backend-auth-repository",
    order: 15,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка repository",
    description: "Три интерфейса, через которые AuthService находит и сохраняет данные в PostgreSQL.",
    readTime: "6 минут",
    sections: [
      {
        id: "folder",
        title: "Папка repository",
        description: "Repository описывает нужные операции с базой. Spring Data создаёт реализацию сам; бизнес-решения остаются в application.",
        entries: [
          { path: "auth/repository/", description: "Интерфейсы доступа к User, Account и RefreshToken.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/repository", tag: "Backend" },
          { path: "README.md", description: "Фиксирует границу: запросы к базе здесь, решения в application.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/repository/README.md" },
        ],
      },
      {
        id: "interfaces",
        title: "Каждый интерфейс",
        entries: [
          { path: "UserRepository.java", description: "findByEmail нужен для входа, existsByEmail — для проверки регистрации. save и findById уже даёт JpaRepository.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/repository/UserRepository.java" },
          { path: "AccountRepository.java", description: "findByUserId находит единственный учебный счёт вошедшего пользователя.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/repository/AccountRepository.java" },
          { path: "RefreshTokenRepository.java", description: "findByTokenHash ищет хэш: AuthService сначала хэширует строку из запроса тем же способом, что при выдаче.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/repository/RefreshTokenRepository.java" },
        ],
      },
    ],
  },
  {
    slug: "backend-auth-security",
    order: 16,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка security",
    description: "Как создаётся JWT, откуда берутся его настройки и как backend узнаёт пользователя по заголовку Authorization.",
    readTime: "10 минут",
    sections: [
      {
        id: "folder",
        title: "Папка security",
        entries: [
          { path: "auth/security/", description: "JWT-сервис, его настройки и фильтр проверки запроса.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/security", tag: "Backend" },
          { path: "README.md", description: "Коротко описывает создание JWT, проверку bearer-токена и authenticated principal.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/security/README.md" },
        ],
      },
      {
        id: "jwt-service",
        title: "Создание и настройки JWT",
        entries: [
          { path: "JwtService.java", description: "Создаёт подписанный HS256 JWT с UUID пользователя, e-mail, временем выдачи и сроком действия. При проверке возвращает UUID из subject.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/security/JwtService.java" },
          { path: "JwtProperties.java", description: "Читает secret, accessTtlMinutes и refreshTtlDays из app.jwt. Значения приходят из переменных окружения, а не из frontend-кода.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/security/JwtProperties.java" },
        ],
        note: "JWT_SECRET должен быть случайным секретом длиной не менее 32 байт. Его нельзя добавлять в Git или NEXT_PUBLIC-переменные.",
      },
      {
        id: "filter",
        title: "JwtAuthenticationFilter.java — проверка каждого запроса",
        description: "Фильтр читает Authorization: Bearer <JWT>. При верной подписи и сроке действия кладёт UUID пользователя в SecurityContext. При битом токене очищает контекст: защищённый маршрут затем сам вернёт 401.",
        entries: [
          { path: "JwtAuthenticationFilter.java", description: "Выполняется один раз на запрос и работает до стандартной проверки Spring Security.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/security/JwtAuthenticationFilter.java" },
        ],
      },
      {
        id: "security-config",
        title: "Где задаётся доступ",
        description: "SecurityConfig лежит в соседней папке config. Он делает сервер stateless, подключает фильтр и определяет публичные пути: register, login, refresh, logout, health и публичные данные рынка. /auth/me в список публичных путей не входит.",
      },
    ],
  },
  {
    slug: "backend-auth-web",
    order: 17,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка web",
    description: "REST-граница auth: какие HTTP-запросы принимает backend и какие статусы возвращает.",
    readTime: "7 минут",
    sections: [
      {
        id: "folder",
        title: "Папка web",
        entries: [
          { path: "auth/web/", description: "Контроллер и вложенная папка DTO для JSON-запросов и ответов.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/web", tag: "Backend" },
          { path: "README.md", description: "Поясняет, что AuthController валидирует HTTP-вход и передаёт сценарий AuthService.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/README.md" },
        ],
      },
      {
        id: "controller",
        title: "AuthController.java — адреса",
        entries: [
          { path: "POST /api/v1/auth/register", description: "Проверяет RegisterRequest и при успехе возвращает HTTP 201 с токенами и данными пользователя." },
          { path: "POST /api/v1/auth/login", description: "Проверяет LoginRequest и возвращает новую пару токенов." },
          { path: "POST /api/v1/auth/refresh", description: "Принимает RefreshRequest и меняет старую refresh-сессию на новую." },
          { path: "POST /api/v1/auth/logout", description: "Отзывает refresh-токен и возвращает HTTP 204 без тела." },
          { path: "GET /api/v1/auth/me", description: "Берёт UUID из уже проверенного Authentication и возвращает UserResponse. Этот маршрут защищён." },
          { path: "AuthController.java", description: "Не хранит пароли, не подписывает токены и не делает SQL: это остаётся в AuthService и соседних папках.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/AuthController.java" },
        ],
      },
    ],
  },
  {
    slug: "backend-auth-web-dto",
    order: 18,
    group: "Backend",
    eyebrow: "Backend · авторизация",
    title: "Авторизация: папка web/dto",
    description: "JSON-формы, которые пересекают границу между браузером и backend. Они проверяют вход и не раскрывают внутренние поля базы.",
    readTime: "8 минут",
    sections: [
      {
        id: "folder",
        title: "Папка web/dto",
        entries: [
          { path: "auth/web/dto/", description: "Неизменяемые Java records для входящих и исходящих JSON-данных.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto", tag: "Backend" },
          { path: "README.md", description: "Фиксирует границу: DTO содержат проверки входа и не отдают JPA-сущности напрямую.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/README.md" },
        ],
      },
      {
        id: "requests",
        title: "Формы, которые присылает браузер",
        entries: [
          { path: "RegisterRequest.java", description: "e-mail, пароль от 8 символов, отображаемое имя и необязательный firstAgent. Вложенный firstAgent тоже проходит @Valid-проверку.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/RegisterRequest.java" },
          { path: "LoginRequest.java", description: "e-mail и пароль. Пароль существует только во время запроса и сверяется через BCrypt; в базу он не сохраняется как текст.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/LoginRequest.java" },
          { path: "RefreshRequest.java", description: "Один обязательный refreshToken. Используется и для обновления сессии, и для logout.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/RefreshRequest.java" },
        ],
      },
      {
        id: "responses",
        title: "Безопасные ответы",
        entries: [
          { path: "AuthResponse.java", description: "Выдаёт accessToken, refreshToken, UserResponse и, после регистрации с агентом, firstAgentId.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/AuthResponse.java" },
          { path: "UserResponse.java", description: "Только UUID, e-mail и отображаемое имя. В нём нет passwordHash, данных кошелька или внутренних JPA-полей.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/auth/web/dto/UserResponse.java" },
        ],
      },
    ],
  },
  {
    slug: "backend-common",
    order: 19,
    group: "Backend",
    eyebrow: "Backend · общая инфраструктура",
    title: "Backend: папка common",
    description: "Общий код, который не принадлежит только авторизации, рынку, торговле или агентам. Сейчас здесь находится единый контракт ошибок API.",
    readTime: "4 минуты",
    sections: [
      {
        id: "common-folder",
        title: "Папка common простыми словами",
        description: "Когда одной и той же вещью пользуются несколько модулей, её кладут в common. Так не появляется несколько несовместимых вариантов одной ошибки в разных папках.",
        entries: [
          { path: "common/", description: "Корень общего кода backend. Сейчас содержит только общую обработку HTTP-ошибок.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/common", tag: "Backend" },
          { path: "README.md", description: "Фиксирует правило: сюда попадает только код, который не относится к одной конкретной функции продукта.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/common/README.md" },
          { path: "api/", description: "Подпапка с единым JSON-ответом ошибки и его серверным обработчиком." },
        ],
      },
      {
        id: "boundary",
        title: "Что не должно попадать в common",
        bullets: [
          "Правила регистрации остаются в auth, потому что ими не пользуется рынок или торговля.",
          "Правила покупки и продажи остаются в trading, потому что они относятся к сделкам.",
          "Общий формат ответа ошибки подходит всем API-модулям, поэтому он находится в common/api.",
        ],
        note: "common не является папкой «для всего подряд». Если код нужен только одному модулю, он остаётся рядом с этим модулем.",
      },
    ],
  },
  {
    slug: "backend-common-api",
    order: 20,
    group: "Backend",
    eyebrow: "Backend · общая инфраструктура",
    title: "Backend: папка common/api",
    description: "Единый формат ошибок, благодаря которому frontend всегда получает понятное поле message вместо Java-стека или HTML-страницы ошибки.",
    readTime: "8 минут",
    sections: [
      {
        id: "api-folder",
        title: "Папка common/api",
        entries: [
          { path: "common/api/", description: "Общий контракт ошибок для всех HTTP-контроллеров backend.", href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/common/api", tag: "Backend" },
          { path: "README.md", description: "Коротко описывает ErrorResponse и GlobalExceptionHandler.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/common/api/README.md" },
        ],
      },
      {
        id: "response",
        title: "ErrorResponse.java — один формат",
        description: "Это маленький Java record с единственным полем message. Любая ожидаемая ошибка возвращается клиенту одинаково.",
        code: "{ \"message\": \"Недостаточно денег в резерве\" }",
        entries: [
          { path: "ErrorResponse.java", description: "Не отдаёт внутренние классы, стек вызовов или детали базы. Frontend всегда читает response.message.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/common/api/ErrorResponse.java" },
        ],
      },
      {
        id: "handler",
        title: "GlobalExceptionHandler.java — перевод ошибок в HTTP",
        description: "Аннотация @RestControllerAdvice подключает этот класс ко всем контроллерам. Сервис может выбросить понятное исключение, а обработчик один раз выбирает статус и ErrorResponse.",
        entries: [
          { path: "EmailAlreadyExistsException", description: "HTTP 409 Conflict: e-mail уже занят." },
          { path: "InvalidCredentialsException · InvalidRefreshTokenException", description: "HTTP 401 Unauthorized: неверные данные входа или недействительная сессия." },
          { path: "InstrumentNotFoundException", description: "HTTP 404 Not Found: запрошенной акции нет." },
          { path: "InvalidTimeframeException · InvalidOrderException", description: "HTTP 400 Bad Request: неправильный таймфрейм или параметры заявки." },
          { path: "InsufficientFundsException · InsufficientPositionException · AgentAllocationException", description: "HTTP 409 Conflict: действие противоречит текущему балансу, позиции или выделению денег агенту." },
          { path: "MethodArgumentNotValidException", description: "HTTP 400 Bad Request: @Valid собрал ошибки полей формы в одну строку message." },
          { path: "GlobalExceptionHandler.java", description: "Единственное место, где эти исключения становятся HTTP-ответами.", href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/common/api/GlobalExceptionHandler.java" },
        ],
      },
      {
        id: "path",
        title: "Как ошибка доходит до страницы",
        code: "Service → Exception → GlobalExceptionHandler\n  → HTTP status + { message } → apiFetch → текст рядом с полем или кнопкой",
        note: "Ожидаемая ошибка пользователя — например, недостаток учебных денег — не должна показываться как «сервер сломан». Её сообщение уже подготовлено для интерфейса.",
      },
    ],
  },
  {
    slug: "backend-dashboard",
    order: 21,
    group: "Backend",
    eyebrow: "Backend · dashboard",
    title: "Цель, капитал и общая лента",
    description: "Dashboard собирает данные из нескольких модулей и отвечает на главный вопрос: растёт ли учебный капитал.",
    readTime: "8 минут",
    sections: [
      {
        id: "response",
        title: "Что возвращает GET /dashboard",
        entries: [
          { path: "totalCapital", description: "Резерв плюс стоимость кошельков и позиций агентов." },
          { path: "reserveCash", description: "Деньги, ещё не распределённые агентам." },
          { path: "allocatedCapital", description: "Сумма стартовых бюджетов неархивных агентов." },
          { path: "profit · profitPercent", description: "Результат относительно стартовых $100 000." },
          { path: "goalValue · goalProgress", description: "Целевая сумма и процент пути к ней." },
          { path: "agents · activity", description: "Карточки агентов и последние действия." },
        ],
      },
      {
        id: "calculation",
        title: "Как считается капитал",
        code: "общий капитал = резерв аккаунта\n                + свободные деньги агентов\n                + текущая стоимость их акций",
        note: "Перевод между резервом и агентом не создаёт прибыль. Меняется место хранения денег, но не общая сумма.",
      },
      {
        id: "preferences",
        title: "Настройки счёта",
        entries: [
          { path: "PATCH /api/v1/account/preferences", description: "Меняет goalValue и/или accelerationEnabled." },
          { path: "goalValue", description: "Целевая сумма от $1 000 до $10 000 000." },
          { path: "accelerationEnabled", description: "Одна настройка для всех агентов аккаунта." },
        ],
      },
      {
        id: "activity",
        title: "Как строится лента",
        bullets: [
          "Источник — AgentDecisionLog, а не отдельная дублирующая таблица.",
          "Событие содержит agentId, имя, действие, причину и время.",
          "BUY, SELL и WAIT используют один контракт, но разные визуальные состояния.",
        ],
      },
    ],
  },
  {
    slug: "backend-market",
    order: 22,
    group: "Backend",
    eyebrow: "Backend · рынок",
    title: "Синтетические котировки и WebSocket",
    description: "Рынок создаётся внутри backend. Он воспроизводим, умеет расти, падать и двигаться вбок, но не является реальной биржей.",
    readTime: "11 минут",
    sections: [
      {
        id: "instruments",
        title: "Какие данные есть",
        bullets: [
          "18 акций NASDAQ и NYSE: AAPL, NVDA, TSLA, MSFT, AMZN, GOOGL, META, AMD, NFLX, INTC, AVGO, JPM, V, KO, DIS, PEP, BAC и XOM.",
          "Свечи 1m, 5m, 15m, 1h и 1d для графиков.",
          "Текущая цена, изменение, объём, биржа и валюта.",
          "Три учебных индекса для верхней сводки.",
        ],
      },
      {
        id: "provider",
        title: "Источник данных",
        entries: [
          { path: "MarketDataProvider", description: "Отделяет backend от конкретного источника цен." },
          { path: "SyntheticMarketDataProvider", description: "Единственная подключённая реализация: режимы роста, падения и бокового движения." },
          { path: "Реальный API", description: "Пока не реализован. Переменная FINNHUB_API_KEY сама его не включает.", warning: "В планах" },
        ],
      },
      {
        id: "tick",
        title: "Как работает tick-движок",
        bullets: [
          "MarketTickEngine запускается примерно каждые 2,6 секунды.",
          "За один визуальный тик выполняются четыре внутренних шага рынка.",
          "На каждом шаге обновляются цены и вызываются активные агенты.",
          "В WebSocket уходит последний шаг, чтобы не создавать лишний шум.",
          "Обычный режим разрешает анализ примерно раз в 23 визуальных тика — около минуты.",
        ],
      },
      {
        id: "api",
        title: "API рынка",
        entries: [
          { path: "GET /api/v1/market/indices", description: "Учебные индексы." },
          { path: "GET /api/v1/instruments", description: "Все акции с котировками." },
          { path: "GET /api/v1/instruments/{ticker}", description: "Карточка акции." },
          { path: "GET /api/v1/instruments/{ticker}/candles", description: "Свечи таймфрейма." },
          { path: "GET /api/v1/instruments/{ticker}/quote", description: "Текущая цена." },
          { path: "WS /ws/market/{ticker}", description: "Живой поток акции." },
        ],
      },
      {
        id: "real-data",
        title: "Как подключить реальный рынок",
        bullets: [
          "Добавить новую реализацию MarketDataProvider.",
          "Хранить ключ только на backend, не в NEXT_PUBLIC-переменной.",
          "Получать один поток, кэшировать его и рассылать пользователям.",
          "Проверить тариф, задержку и право коммерческого использования.",
        ],
      },
    ],
  },
  {
    slug: "backend-agents",
    order: 23,
    group: "Backend",
    eyebrow: "Backend · агенты",
    title: "Агенты на backend: папка application",
    description: "Простая карта серверного кода агентов: где создаётся агент, кто им управляет и по каким правилам он выбирает покупку или продажу.",
    readTime: "18 минут",
    sections: [
      {
        id: "application-folder",
        title: "Папка application простыми словами",
        description: "Это рабочий центр агента на сервере. В нём нет кнопок и страниц: сюда приходят команды из API и рыночные обновления, а отсюда уходят изменения в базу и в торговый модуль.",
        entries: [
          {
            path: "agents/application/",
            description: "Папка с прикладной логикой: она соединяет данные об агенте, счёте, рынке и сделках.",
            href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/agents/application",
            tag: "Backend",
          },
          {
            path: "AgentProvisioner.java",
            description: "Собирает нового агента и выделяет ему учебные деньги из резерва пользователя.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentProvisioner.java",
          },
          {
            path: "AgentService.java",
            description: "Принимает команды пользователя, запускает проверку рынка и записывает результат работы агента.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentService.java",
          },
          {
            path: "AgentTradingPolicy.java",
            description: "Небольшая таблица правил: сколько позиций держать, какую долю кошелька вложить и когда закрыть сделку.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentTradingPolicy.java",
          },
          {
            path: "README.md",
            description: "Короткая памятка разработчику о назначении трёх классов и главных ограничениях торгового цикла.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/application/README.md",
          },
        ],
        note: "Экран не покупает акции сам. Он вызывает API, API вызывает AgentService, а тот передаёт разрешённую покупку или продажу в TradingService.",
      },
      {
        id: "provisioner-code",
        title: "AgentProvisioner.java — как появляется агент",
        description: "Этот класс нужен в момент создания агента. Его метод provision получает аккаунт и данные формы: имя, стратегию и бюджетный лимит.",
        bullets: [
          "Проверяет, что стратегия написана верно: careful, aggressive или random. Неизвестную стратегию сервер не примет.",
          "Берёт для стратегии профиль и случайный стартовый сигнал. Это начальные параметры конкретного агента.",
          "Проверяет резерв счёта. Если пользователь пытается отдать агенту больше свободных учебных денег, создание отменяется с понятной ошибкой.",
          "Создаёт сразу четыре связанных записи: самого агента, его настройки, отдельный кошелёк и первую точку стоимости капитала.",
          "Списывает выделенный бюджет из резерва только вместе с созданием кошелька.",
        ],
        note: "Метод помечен @Transactional. Если любая из записей не сохранится, Spring отменит всю операцию: не останется агента без кошелька или пропавших денег.",
      },
      {
        id: "service-code",
        title: "AgentService.java — диспетчер агентов",
        description: "Это самый большой класс папки. Он отвечает за то, что пользователь может сделать с агентом, и за реакцию активного агента на очередное обновление рынка.",
        entries: [
          { path: "create", description: "Находит счёт пользователя и передаёт создание в AgentProvisioner." },
          { path: "start / pause", description: "Меняет состояние агента и добавляет запись в журнал. Пауза сохраняет уже купленные акции." },
          { path: "allocation", description: "Меняет выделенный бюджет только на паузе. Нельзя забрать деньги, которые уже находятся в открытых позициях." },
          { path: "close", description: "Сначала продаёт все позиции через TradingService, затем возвращает деньги в резерв и архивирует агента." },
          { path: "performance / log", description: "Собирает кошелёк, текущую цену позиций, прибыль или убыток, кривую капитала и журнал решений для интерфейса." },
        ],
      },
      {
        id: "tick-code",
        title: "Что происходит на одном шаге рынка",
        bullets: [
          "MarketService передаёт AgentService акцию, новую котировку и номер симулированного шага через метод onTick.",
          "Сервис берёт только активных агентов и проверяет скорость счёта: без ускорения агент работает лишь на обычном цикле.",
          "Если агент уже держит эту акцию, сначала проверяется прибыль, ограничение убытка и время удержания. При срабатывании условия вызывается продажа.",
          "Если позиции нет, сервис проверяет паузу после прошлой сделки, лимит числа позиций и сигнал из AgentTradingPolicy.",
          "При успешной покупке или продаже TradingService создаёт сделку. AgentService сохраняет понятную запись в журнале и новую точку стоимости кошелька.",
        ],
        note: "Проверка принадлежности в методе owned не даёт одному пользователю открыть, изменить или закрыть агента другого пользователя.",
      },
      {
        id: "policy-code",
        title: "AgentTradingPolicy.java — правила, а не торговый интерфейс",
        description: "В этом классе нет доступа к базе и нет вызовов API. Он только возвращает числа и отвечает на вопрос: подходит ли момент для покупки.",
        entries: [
          { path: "Осторожный", description: "До 4 позиций; около 20% полной стоимости кошелька на новую позицию; фиксация прибыли при +2%, ограничение убытка при −1%." },
          { path: "Агрессивный", description: "До 5 позиций; около 17% на позицию; фиксация прибыли при +4%, ограничение убытка при −3%." },
          { path: "Случайный", description: "До 4 позиций; около 20% на позицию; фиксация прибыли при +3%, ограничение убытка при −2%." },
        ],
        bullets: [
          "orderBudget считает размер покупки от свободных денег плюс текущей стоимости позиций, но никогда не тратит больше свободных денег кошелька.",
          "shouldBuy использует изменение цены и повторяемое правило из номера шага и тикера. Поэтому учебная симуляция воспроизводима: один и тот же сценарий не зависит от настоящего случайного генератора.",
        ],
      },
      {
        id: "readme-code",
        title: "README.md — зачем он лежит рядом с кодом",
        description: "README не участвует в работе приложения. Это короткий ориентир для разработчика, который впервые открывает папку: он объясняет назначение классов, порядок «продажа раньше покупки», cooldown в 10 шагов и выход по времени через 390 шагов.",
        note: "Когда меняются правила этих трёх классов, README нужно обновить в той же задаче. Тогда описание рядом с кодом не устареет.",
      },
      {
        id: "lifecycle",
        title: "Жизненный цикл",
        entries: [
          { path: "PAUSED", description: "Не анализирует рынок. Можно изменить бюджет." },
          { path: "ACTIVE", description: "Получает разрешённые тики и может торговать." },
          { path: "ARCHIVED", description: "Позиции закрыты, деньги возвращены, история сохранена." },
        ],
      },
      {
        id: "strategies",
        title: "Три стратегии",
        entries: [
          { path: "Осторожный", description: "До 4 позиций, 20% стоимости на позицию, цель +2%, stop-loss −1%." },
          { path: "Агрессивный", description: "До 5 позиций, 17% на позицию, цель +4%, stop-loss −3%." },
          { path: "Случайный", description: "До 4 позиций, 20% на позицию, цель +3%, stop-loss −2%." },
        ],
        note: "Стратегии могут направить в рынок примерно 80–85% кошелька, но сумма зависит от денег и найденных сигналов.",
      },
      {
        id: "cycle",
        title: "Порядок проверки",
        bullets: [
          "Для открытой позиции сначала проверяются take-profit, stop-loss и срок удержания.",
          "Если сработал выход, продаётся вся позиция.",
          "Для новой покупки проверяются cooldown, лимит позиций и сигнал.",
          "Бюджет считается от полной стоимости кошелька, а не уменьшающегося остатка.",
          "После сделки сохраняются Order, Trade, кошелёк, позиция, журнал и снимок капитала.",
        ],
      },
      {
        id: "limits",
        title: "Защита от бесконечной торговли",
        entries: [
          { path: "Cooldown", description: "10 симулированных шагов до повторной сделки по акции." },
          { path: "Выход по времени", description: "Закрытие после 390 симулированных шагов." },
          { path: "Без займа", description: "Нельзя потратить больше свободных денег или открыть short." },
          { path: "Комиссия", description: "0,1% учитывается в количестве и результате." },
        ],
      },
      {
        id: "api",
        title: "API агентов",
        entries: [
          { path: "POST /api/v1/agents", description: "Создаёт остановленного агента и переводит бюджет." },
          { path: "POST /api/v1/agents/{id}/start", description: "Запускает анализ." },
          { path: "POST /api/v1/agents/{id}/pause", description: "Останавливает решения, но не продаёт позиции." },
          { path: "PATCH /api/v1/agents/{id}/allocation", description: "Меняет бюджет остановленного агента." },
          { path: "GET /api/v1/agents/{id}/performance", description: "Кошелёк, позиции, P&L и кривая." },
          { path: "GET /api/v1/agents/{id}/log", description: "Последние решения." },
          { path: "POST /api/v1/agents/{id}/close", description: "Продаёт позиции, возвращает деньги и архивирует." },
        ],
      },
    ],
  },
  {
    slug: "backend-agents-domain",
    order: 24,
    group: "Backend",
    eyebrow: "Backend · агенты",
    title: "Агенты на backend: папка domain",
    description: "Простая карта данных агента: кто он, где лежат его деньги и позиции, как сохраняются решения и какие ограничения проверяются до сделки.",
    readTime: "16 минут",
    sections: [
      {
        id: "domain-folder",
        title: "Папка domain простыми словами",
        description: "Здесь лежат модели данных агента. Они описывают факты: имя, состояние, деньги, купленные акции и историю. Решение «купить или продать» принимает application, а domain хранит результат и не даёт нарушить базовые правила денег.",
        entries: [
          {
            path: "agents/domain/",
            description: "Папка с Java-моделями, которые Spring сохраняет в таблицы PostgreSQL или использует как строгие списки и небольшие правила.",
            href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain",
            tag: "Backend",
          },
          {
            path: "README.md",
            description: "Коротко объясняет три главные модели: агент, его настройки и журнал решений.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/README.md",
          },
        ],
        note: "Domain не создаёт HTTP-адреса и не рисует интерфейс. Он даёт остальному backend единый, безопасный язык для работы с данными агента.",
      },
      {
        id: "agent-model",
        title: "Agent.java — карточка самого агента",
        description: "Это основная запись таблицы agents. В ней находится то, что идентифицирует агента и нужно для его жизненного цикла.",
        entries: [
          {
            path: "Agent.java",
            description: "Хранит ID, владельца-счёт, имя, стратегию, состояние, уровень риска, стартовый сигнал и дату создания. Новый агент появляется в состоянии PAUSED, поэтому не начнёт торговать без явного запуска.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/Agent.java",
          },
          {
            path: "AgentStatus.java",
            description: "Закрытый список состояний: ACTIVE — работает, PAUSED — остановлен, ERROR — требует внимания, ARCHIVED — завершён и сохранён в истории.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentStatus.java",
          },
          {
            path: "AgentStrategy.java",
            description: "Закрытый список стратегий AGGRESSIVE, CAREFUL и RANDOM. Каждая стратегия содержит свой стартовый StrategyProfile.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentStrategy.java",
          },
          {
            path: "StrategyProfile.java",
            description: "Описывает имя стратегии, её диапазон изменений и допустимые стартовые сигналы. Выбирает один сигнал и проверяет, достигло ли изменение цены этого сигнала.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/StrategyProfile.java",
          },
        ],
      },
      {
        id: "settings-money",
        title: "Настройки и деньги агента",
        entries: [
          {
            path: "AgentConfig.java",
            description: "Отдельно хранит настраиваемые данные агента в JSON: характер, бюджет и навыки. Это позволяет менять конфигурацию, не раздувая таблицу agents новыми столбцами.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentConfig.java",
          },
          {
            path: "AgentBudget.java",
            description: "Проверяет бюджетный лимит. Сейчас допустимы только USD и сумма от $1 000 до $100 000; если бюджет не передан, берётся $75 000.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentBudget.java",
          },
          {
            path: "AgentWallet.java",
            description: "Отдельный кошелёк агента. Хранит начальное выделение, свободные деньги и валюту; умеет списывать, зачислять, увеличивать или возвращать выделение, не позволяя уйти в минус.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentWallet.java",
          },
        ],
        note: "Деньги в AgentWallet — учебные. Класс округляет каждую сумму до двух знаков, чтобы на счёте не появлялись дроби цента.",
      },
      {
        id: "positions",
        title: "Купленные акции и пауза после сделки",
        entries: [
          {
            path: "AgentPosition.java",
            description: "Одна открытая позиция агента по одной акции: количество, средняя цена покупки, шаг открытия и время последнего обновления.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentPosition.java",
          },
          {
            path: "AgentPositionId.java",
            description: "Составной ID из agentId и instrumentId. Он не даёт создать две разные строки одной и той же позиции для одного агента и одной акции.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentPositionId.java",
          },
          {
            path: "AgentMarketState.java",
            description: "Запоминает номер шага последней сделки агента по конкретной акции. AgentService использует это значение для cooldown, чтобы агент не покупал и не продавал одну акцию слишком часто.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentMarketState.java",
          },
        ],
      },
      {
        id: "history",
        title: "История решений и кривая результата",
        entries: [
          {
            path: "AgentDecisionLog.java",
            description: "Строка журнала одного решения: BUY, SELL или WAIT, причина, проверенные правила, связанная заявка и время. По этим строкам интерфейс строит ленту активности.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentDecisionLog.java",
          },
          {
            path: "AgentAction.java",
            description: "Строгий список действий для журнала: BUY — покупка, SELL — продажа, WAIT — решение подождать или информационная запись о состоянии агента.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentAction.java",
          },
          {
            path: "AgentEquityPoint.java",
            description: "Снимок стоимости агента в конкретный момент: свободные деньги, стоимость позиций и их общая сумма. Из этих снимков получается график капитала и P&L.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentEquityPoint.java",
          },
        ],
      },
      {
        id: "how-connected",
        title: "Как эти файлы работают вместе",
        code: "Создание: Agent + AgentConfig + AgentWallet + AgentEquityPoint\nПокупка: AgentWallet → AgentPosition → AgentMarketState → AgentDecisionLog\nПродажа: AgentPosition → AgentWallet → AgentMarketState → AgentDecisionLog → AgentEquityPoint",
        bullets: [
          "AgentService не меняет случайные строки вручную: он вызывает методы кошелька и сохраняет связанные модели в нужном порядке.",
          "Таблицы разделены, поэтому кошелёк, позиция и история не смешиваются в одной большой записи агента.",
          "У каждого агента свой кошелёк и свой набор позиций. Деньги одного агента не могут оплатить покупку другого.",
        ],
        note: "Если нужно понять, что делает бизнес-логика с этими данными, откройте предыдущую статью про папку application.",
      },
      {
        id: "readme",
        title: "README.md — краткая памятка рядом с моделями",
        description: "README не выполняется сервером. Он напоминает, что Agent хранит имя, стратегию и состояние, AgentConfig — JSON-настройки мастера создания, а AgentDecisionLog — историю решений и связанную сделку.",
      },
    ],
  },
  {
    slug: "backend-agents-exception",
    order: 25,
    group: "Backend",
    eyebrow: "Backend · агенты",
    title: "Агенты на backend: папка exception",
    description: "Как backend останавливает недопустимое действие с агентом и возвращает интерфейсу короткое понятное сообщение вместо технической ошибки.",
    readTime: "6 минут",
    sections: [
      {
        id: "exception-folder",
        title: "Папка exception простыми словами",
        description: "В этой папке лежат исключения — специальные Java-ошибки для ожидаемых проблем. Это не поломка сервера, а способ сказать: действие сейчас нельзя выполнить по правилам продукта.",
        entries: [
          {
            path: "agents/exception/",
            description: "Небольшая папка с ошибками, относящимися только к агентам.",
            href: "https://github.com/Hqzdev/tradr/tree/main/apps/backend/src/main/java/dev/tradr/backend/agents/exception",
            tag: "Backend",
          },
          {
            path: "AgentAllocationException.java",
            description: "Одна ошибка для ситуаций, когда нельзя выделить, вернуть или использовать деньги агента по текущим правилам.",
            href: "https://github.com/Hqzdev/tradr/blob/main/apps/backend/src/main/java/dev/tradr/backend/agents/exception/AgentAllocationException.java",
          },
        ],
      },
      {
        id: "class",
        title: "AgentAllocationException.java — что делает этот класс",
        description: "Класс наследует RuntimeException и принимает готовое сообщение. Сам он не считает деньги и не меняет базу: он передаёт причину туда, где ошибка будет обработана единообразно.",
        code: "throw new AgentAllocationException(\n  \"Недостаточно денег в резерве\"\n);",
        note: "Название allocation означает «выделение бюджета агенту». Поэтому эта ошибка относится к бюджету, резерву счёта и допустимому состоянию агента, а не к цене конкретной акции.",
      },
      {
        id: "when",
        title: "Когда backend возвращает эту ошибку",
        entries: [
          { path: "Создание агента", description: "В резерве счёта меньше учебных денег, чем пользователь хочет выделить новому агенту." },
          { path: "Запуск", description: "Пользователь пытается снова запустить уже архивного агента." },
          { path: "Изменение бюджета", description: "Агент не поставлен на паузу. Бюджет разрешено менять только у остановленного агента." },
          { path: "Увеличение бюджета", description: "В резерве пользователя не хватает свободных денег для дополнительного выделения." },
          { path: "Возврат денег", description: "Пользователь пытается забрать из кошелька сумму, которая уже вложена в открытые позиции." },
        ],
      },
      {
        id: "path",
        title: "Как ошибка доходит до интерфейса",
        code: "AgentService или AgentProvisioner\n  → AgentAllocationException\n  → GlobalExceptionHandler\n  → HTTP 409 Conflict\n  → { \"message\": \"понятная причина\" }\n  → frontend показывает сообщение",
        bullets: [
          "GlobalExceptionHandler находится в common/api и обрабатывает AgentAllocationException вместе с ошибками недостатка денег и позиции.",
          "Frontend получает стабильный формат с полем message. Ему не нужно разбирать Java-стек или угадывать вид ошибки.",
          "HTTP 409 означает конфликт с текущим состоянием: запрос понятен, но выполнить его сейчас нельзя.",
        ],
      },
      {
        id: "why",
        title: "Почему это полезно",
        bullets: [
          "Правила проверяются на сервере, поэтому их нельзя обойти изменением кнопок или прямым запросом к API.",
          "Контроллеры не повторяют одинаковые try/catch. Они вызывают сервис, а единый обработчик выбирает статус и ответ.",
          "Пользователь видит причину: например, что нужно поставить агента на паузу или оставить больше денег в резерве.",
        ],
        note: "Это ожидаемая ошибка действия, а не запись о падении приложения. Не стоит показывать её как «неизвестную ошибку сервера».",
      },
    ],
  },
  {
    slug: "backend-trading",
    order: 26,
    group: "Backend",
    eyebrow: "Backend · торговля",
    title: "Сделки без ручной торговли",
    description: "Торговый модуль исполняет команды агентов и отдаёт историю. Пользователь не может создать ручную заявку.",
    readTime: "10 минут",
    sections: [
      {
        id: "rule",
        title: "Главное правило",
        bullets: [
          "Создание и preview ручных заявок не опубликованы в TradingController.",
          "Новая сделка обязательно получает agentId и принадлежит агенту.",
          "Старые ручные сделки остаются в истории, но повторить их нельзя.",
          "Рынок и история работают только на чтение.",
        ],
      },
      {
        id: "buy",
        title: "Покупка",
        bullets: [
          "Проверяется принадлежность агента аккаунту.",
          "К стоимости добавляется комиссия 0,1%.",
          "При нехватке денег операция отклоняется целиком.",
          "Создаются Order и Trade, меняются AgentWallet и AgentPosition.",
        ],
      },
      {
        id: "sell",
        title: "Продажа",
        bullets: [
          "Проверяется, что агент держит нужное количество.",
          "Из выручки вычитается комиссия.",
          "Деньги возвращаются в AgentWallet.",
          "После полной продажи позиция удаляется, а история остаётся.",
        ],
      },
      {
        id: "read-api",
        title: "Read-only API",
        entries: [
          { path: "GET /api/v1/orders", description: "Заявки с фильтром по status и agentId." },
          { path: "GET /api/v1/trades", description: "Сделки с пагинацией и фильтром." },
          { path: "GET /api/v1/trades/stats", description: "Сводные показатели." },
          { path: "GET /api/v1/portfolio", description: "Совместимый общий снимок." },
          { path: "GET /api/v1/portfolio/{ticker}", description: "Совместимый просмотр позиции." },
        ],
      },
      {
        id: "money",
        title: "Точность денег",
        bullets: [
          "Java использует BigDecimal, PostgreSQL — numeric.",
          "Деньги округляются до двух знаков, количество — до восьми.",
          "double и float не используются для финансовых правил.",
        ],
      },
    ],
  },
  {
    slug: "data-and-migrations",
    order: 27,
    group: "Данные и разработка",
    eyebrow: "Данные",
    title: "База данных и миграции",
    description: "Что хранит PostgreSQL, как Flyway меняет схему и почему старые миграции нельзя переписывать.",
    readTime: "12 минут",
    sections: [
      {
        id: "core",
        title: "Основные таблицы",
        entries: [
          { path: "users · refresh_tokens", description: "Аккаунт пользователя и безопасные сессии." },
          { path: "accounts", description: "Резерв, валюта, цель и ускорение." },
          { path: "instruments · candles · index_quotes", description: "Акции и история учебного рынка." },
          { path: "agents · agent_configs", description: "Стратегия, статус и настройки агента." },
          { path: "agent_wallets · agent_positions", description: "Деньги и акции каждого агента." },
          { path: "orders · trades", description: "Аудит каждой покупки и продажи." },
          { path: "agent_decision_logs · agent_equity_points", description: "Объяснения и история капитала." },
        ],
      },
      {
        id: "ownership",
        title: "Кому принадлежат деньги",
        code: "User\n └─ Account (резерв)\n     └─ Agent\n         ├─ AgentWallet (свободные деньги)\n         └─ AgentPosition[] (купленные акции)",
        note: "Резерв, деньги агентов и стоимость их позиций образуют общий капитал пользователя.",
      },
      {
        id: "history",
        title: "История миграций",
        entries: [
          { path: "V1–V4", description: "Основа, авторизация, рынок и исправление валюты." },
          { path: "V5–V10", description: "Торговля, агенты, удаление старых симуляций и сигналы." },
          { path: "V11", description: "Добавляет ещё 12 инструментов — всего 18 акций." },
          { path: "V12", description: "Бюджет в JSON { limit, currency }." },
          { path: "V13", description: "Цель, ускорение, кошельки, позиции, market state и кривая капитала." },
          { path: "V14", description: "Пополняет существующих стартовых агентов без изменения капитала." },
          { path: "V15", description: "Увеличивает основной бюджет до $75 000, если резерв позволяет." },
        ],
      },
      {
        id: "rules",
        title: "Правила миграций",
        bullets: [
          "Применённый файл V13 нельзя менять задним числом.",
          "Новое изменение получает следующий номер, например V16.",
          "Миграция должна работать на чистой базе и на базе с данными.",
          "Перенос денег обязан сохранять общую сумму капитала.",
          "Hibernate не создаёт таблицы: ddl-auto установлен в validate.",
        ],
      },
      {
        id: "legacy",
        title: "Старые данные",
        bullets: [
          "Незаполненные ручные заявки были отменены.",
          "Старые сделки не удалены и остаются историей до перехода на агентов.",
          "Существующим пользователям назначен стартовый агент, если его не было.",
          "Начальная стоимость выставлена без искусственного создания прибыли.",
        ],
      },
    ],
  },
  {
    slug: "testing",
    order: 28,
    group: "Данные и разработка",
    eyebrow: "Качество",
    title: "Как проверять изменения",
    description: "Автоматические и ручные проверки, которые защищают деньги, авторизацию и основной пользовательский путь.",
    readTime: "9 минут",
    sections: [
      {
        id: "frontend",
        title: "Frontend-тесты",
        entries: [
          { path: "AuthWizard.test.ts", description: "Шаги регистрации, сохранение данных и firstAgent payload." },
          { path: "authRedirect.test.ts", description: "Запрещает опасные внешние next-адреса." },
          { path: "agentSimulator.test.ts", description: "Решение hero-симулятора и бюджет." },
        ],
        code: "npm run test:web\nnpm run build --workspace=tradr-web",
      },
      {
        id: "backend",
        title: "Backend-тесты",
        bullets: [
          "Регистрация пользователя и первого агента одной транзакцией.",
          "Сохранение суммы при переводе между резервом и агентом.",
          "Покупка, take-profit, stop-loss, выход по времени и cooldown.",
          "Комиссия, границы бюджета и запрет ручных операций.",
          "Закрытие агента с продажей позиций и возвратом денег.",
        ],
        code: "npm run test:backend\n# или\ncd apps/backend && ./mvnw test",
      },
      {
        id: "browser",
        title: "Проверка браузера",
        bullets: [
          "1440×900: все три колонки документации и экраны без перекрытий.",
          "820×900: сайдбар открывается поверх страницы, правое содержание скрыто.",
          "390×844: нет горизонтального скролла, форма и кнопки доступны.",
          "Клавиатура: виден focus, порядок логичный, Escape закрывает панели.",
          "prefers-reduced-motion: смысл не зависит от движения.",
        ],
      },
      {
        id: "acceptance",
        title: "Главная приёмка",
        bullets: [
          "Новый пользователь понимает цель и видит одну главную кнопку запуска.",
          "Один агент способен сам купить и продать акцию.",
          "После сделки меняются кошелёк, позиции, P&L и лента.",
          "У каждой новой сделки есть agentId.",
          "На рынке нет кнопок ручной покупки и продажи.",
        ],
      },
    ],
  },
  {
    slug: "deployment",
    order: 29,
    group: "Данные и разработка",
    eyebrow: "Деплой",
    title: "Как выложить TRADR",
    description: "Frontend, backend и база разворачиваются как три связанные части. Одного DATABASE_URL недостаточно, если приложение ожидает отдельные переменные.",
    readTime: "10 минут",
    sections: [
      {
        id: "topology",
        title: "Схема продакшена",
        code: "Vercel (Next.js)\n      ↓ HTTPS / WSS\nBackend host (Spring Boot + Java 21)\n      ↓ JDBC\nManaged PostgreSQL",
        note: "Backend постоянно выполняет tick-движок и держит WebSocket. Обычный Vercel Functions-деплой для него не подходит.",
      },
      {
        id: "frontend-env",
        title: "Переменные Vercel",
        entries: [
          { path: "NEXT_PUBLIC_API_BASE_URL", description: "Публичный HTTPS-адрес backend с /api/v1." },
          { path: "NEXT_PUBLIC_WS_BASE_URL", description: "Публичный WSS-адрес backend с /ws." },
        ],
      },
      {
        id: "backend-env",
        title: "Переменные backend",
        entries: [
          { path: "DB_URL", description: "JDBC-адрес: jdbc:postgresql://host:5432/database." },
          { path: "DB_USER", description: "Пользователь PostgreSQL." },
          { path: "DB_PASSWORD", description: "Пароль PostgreSQL." },
          { path: "JWT_SECRET", description: "Случайная строка не короче 32 символов." },
          { path: "JWT_ACCESS_TTL_MIN", description: "Access token; по умолчанию 15 минут." },
          { path: "JWT_REFRESH_TTL_DAYS", description: "Refresh token; по умолчанию 30 дней." },
          { path: "CORS_ALLOWED_ORIGINS", description: "Точный HTTPS-домен frontend." },
        ],
      },
      {
        id: "database-url",
        title: "Почему не всегда хватает DATABASE_URL",
        description: "Провайдер часто выдаёт postgresql://user:password@host/database. Текущая конфигурация читает три переменные и требует JDBC-префикс. Нужно разложить строку на DB_URL, DB_USER и DB_PASSWORD или изменить application.yml для единого DATABASE_URL.",
      },
      {
        id: "checklist",
        title: "Проверка после деплоя",
        bullets: [
          "GET /health отвечает 200.",
          "Flyway применил V1–V15 без ошибок.",
          "Регистрация создаёт счёт и первого агента.",
          "Dashboard открывается с домена Vercel без CORS-ошибки.",
          "WebSocket использует wss:// на HTTPS-странице.",
          "JWT_SECRET и пароль базы не попали в frontend или Git.",
        ],
      },
    ],
  },
  taskPage({
    slug: "task-agent-profile",
    order: 30,
    eyebrow: "Задача · агенты",
    title: "Кастомный агент: JSON-профиль и навыки",
    description: "Сделать особого агента отдельным JSON-профилем с фиксированным именем, статами и одним уникальным навыком. Он сильнее базового агента, но не получает гарантированную прибыль.",
    readTime: "9 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "Кастомный агент создаётся из JSON-профиля: в нём уже зафиксированы имя, тип, темперамент, статы и уникальный навык.",
          "Обычный агент остаётся доступен с выбором типа: агрессивный, стабильный или рискованный. Кастомный агент — улучшенная учебная версия с заранее заданным профилем.",
          "Агрессивный агент действует резко и чаще; стабильный ищет спокойные сценарии; рискованный выбирает более волатильные акции, но не становится импульсивным.",
          "У всех типов есть анализ, дисциплина, терпение и контроль риска. У кастомного агента их значения фиксированы в JSON и могут быть выше диапазона обычного агента.",
          "Уникальный навык задаёт ограниченный бонус: доход успешного учебного цикла увеличивается максимум на 15%, а расходы вроде учебной комиссии уменьшаются максимум на 15%.",
          "В карточке агента видны имя, тип, темперамент, статы, уникальный навык и точный бонус. Пользователь понимает, почему этот агент сильнее обычного.",
        ],
      },
      {
        id: "profile-json",
        title: "Как выглядит JSON-профиль",
        description: "Это серверный формат хранения. Пользователь видит красивую карточку, а не обязан вводить JSON вручную.",
        code: "{\n  \"schemaVersion\": 1,\n  \"name\": \"Nova\",\n  \"avatarId\": \"nova-orbit\",\n  \"type\": \"RISK\",\n  \"temperament\": \"calm\",\n  \"stats\": {\n    \"analysis\": 88,\n    \"discipline\": 84,\n    \"patience\": 72,\n    \"riskControl\": 76\n  },\n  \"uniqueSkill\": {\n    \"id\": \"efficient_execution\",\n    \"title\": \"Точное исполнение\",\n    \"incomeBonusPercent\": 10,\n    \"expenseDiscountPercent\": 12\n  }\n}",
        note: "Бонус применяется только в учебной симуляции после обычного расчёта сделки. Он не меняет цену акции, не отменяет убыток и не складывается бесконечно с другими бонусами.",
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/web/components/screens/CreateAgentScreen.tsx", description: "Разделить обычного и кастомного агента; показать выбранный серверный профиль без ручного редактирования JSON." },
          { path: "apps/web/components/screens/AgentDetailScreen.tsx", description: "Показать имя, фиксированные статы, уникальный навык, бонус к доходу и скидку на расходы." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentStrategy.java", description: "Описать агрессивную, стабильную и рискованную стратегию без неявной смены поведения." },
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/agents/domain/CustomAgentProfile.java", description: "Типизированная модель JSON-профиля, статов и единственного уникального навыка." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentConfig.java", description: "Хранить проверенный JSON-профиль и его schemaVersion вместе с настройками агента." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentTradingPolicy.java", description: "Применять ограниченный бонус после базового расчёта, не обходя лимит бюджета, stop-loss и риск-правила." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V16__add_custom_agent_profile.sql", description: "Добавить JSON-профиль, версию схемы и безопасный default для уже созданных агентов." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Backend валидирует JSON по версии схемы и сохраняет его один раз. Frontend не передаёт случайные числа и не может поднять бонус выше лимита.",
          "У кастомного агента всегда одно уникальное умение. incomeBonusPercent находится в диапазоне 0–15, expenseDiscountPercent — 0–15; бонусы не суммируются между собой бесконечно.",
          "Сначала рассчитываются цена, количество, комиссия, лимиты и риск. Затем применяется бонус к учебному результату. Если базовая сделка убыточна, бонус не превращает её в гарантированную прибыль.",
          "Добавить unit-тесты JSON-схемы, границ бонусов, неизменности профиля после перезагрузки, расчёта дохода/расхода и сериализации ответа API.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-stock-risk",
    order: 31,
    eyebrow: "Задача · рынок",
    title: "Стабильные и рискованные акции",
    description: "Научить рынок различать риск активов, а агента — выбирать акцию самостоятельно по своему типу и текущей ситуации.",
    readTime: "8 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "У каждой акции есть учебный уровень риска: стабильная, умеренная или рискованная.",
          "Агенты сами выбирают акции: стабильный чаще выбирает спокойные, рискованный допускает более резкие, а агрессивный быстрее реагирует на сигнал.",
          "Перед действием интерфейс показывает учебную вероятность успеха и диапазон возможного результата: сколько агент может получить или потерять. Это оценка модели, а не обещание.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/backend/src/main/java/dev/tradr/backend/market/domain/Instrument.java", description: "Добавить уровень учебного риска и данные для его расчёта." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/market/provider/SyntheticMarketDataProvider.java", description: "Задать воспроизводимые режимы и волатильность для каждого инструмента." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentTradingPolicy.java", description: "Учитывать риск акции, характер и лимит кошелька при выборе позиции." },
          { path: "apps/web/components/screens/MarketScreen.tsx", description: "Показать риск и учебный сценарий без кнопок ручной покупки." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V17__add_instrument_risk_profile.sql", description: "Сохранить риск-профили всех текущих акций." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Вероятность строится из режима рынка, риска акции, параметров агента и комиссии; число всегда сопровождается формулировкой «учебная оценка».",
          "Ни один тип агента не получает гарантированную прибыль. Даже стабильная акция может принести убыток.",
          "Проверить, что рискованный агент чаще допускает рискованные инструменты, а стабильный не нарушает свой лимит риска.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-agent-teams",
    order: 32,
    eyebrow: "Задача · команды",
    title: "Команды и кланы агентов-друзей",
    description: "Добавить учебные команды, в которых агенты наблюдают за результатами друг друга и получают дополнительный стимул, не копируя сделки вслепую.",
    readTime: "10 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "Агенты могут создавать или вступать в небольшие команды внутри одного учебного аккаунта.",
          "Они обмениваются только учебными сигналами и итогами: поддерживают, соревнуются, предлагают сравнить решение. У них нет оскорблений, давления или токсичных реплик.",
          "Командное событие может немного менять мотивацию: например, повышать желание завершить анализ, но не отменяет лимиты, риск-профиль и правила стратегии.",
          "В ленте видно, какое решение было личным, а какой контекст пришёл от команды.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentTeam.java", description: "Сущность команды и её принадлежность учебному аккаунту." },
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentRelationship.java", description: "Дружеская связь, конкуренция и безопасные типы взаимодействий." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentTradingPolicy.java", description: "Применять к решению ограниченный коэффициент мотивации, не обходя риск-лимиты." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/web/AgentController.java", description: "Добавить API создания команды, состава и ленты взаимодействий." },
          { path: "apps/web/components/screens/AgentDetailScreen.tsx", description: "Показать команду, дружеские события и источник сигнала." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V18__add_agent_teams.sql", description: "Создать таблицы команд, участников и событий без связи между разными пользователями." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Команда не даёт доступ к чужому счёту и не переводит деньги между пользователями.",
          "У взаимодействий есть белый список шаблонов и лимит частоты, чтобы лента не превращалась в поток сообщений.",
          "Покрыть тестами изоляцию аккаунтов, неизменность торговых ограничений и прозрачную пометку командного влияния.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-time-skip",
    order: 33,
    eyebrow: "Задача · время",
    title: "Time Skip без смены стратегии",
    description: "Сделать меню ускоренного прохождения учебного времени: рынок движется быстрее, но агент не меняет свой характер и не получает защиту от убытка.",
    readTime: "7 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "В Dashboard появляется меню Time Skip с понятными вариантами времени и предупреждением о риске открытых позиций.",
          "Во время пропуска агент удерживает выбранную стратегию, характер и действующие позиции. Он не подстраивается задним числом под результат рынка.",
          "Если рынок падает, пользователь видит реальный учебный убыток. Если сработали существующие условия продажи, они исполняются по обычным правилам.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/web/components/screens/DashboardScreen.tsx", description: "Добавить меню, предупреждение и отображение хода пропуска времени." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/dashboard/web/DashboardController.java", description: "Принять команду Time Skip только для владельца учебного счёта." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/market/application/MarketTickEngine.java", description: "Прогнать строго заданное количество последовательных тиков в одной контролируемой операции." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentTradingPolicy.java", description: "Использовать обычные правила решения без переключения стратегии в режиме пропуска." },
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/dashboard/web/dto/TimeSkipRequest.java", description: "Описать допустимую длительность и исключить произвольное ускорение от клиента." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Операция должна быть последовательной: каждый тик видит результат предыдущего, а баланс не может уйти ниже нуля.",
          "Для крупных пропусков отправлять агрегированный прогресс, а не сотни одинаковых событий в браузер.",
          "Проверить прибыльный сценарий, падение рынка, срабатывание stop-loss и неизменность стратегии до и после Time Skip.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-agent-budget",
    order: 34,
    eyebrow: "Задача · бюджет",
    title: "Нулевой бюджет и завершение агента",
    description: "Дать пользователю понятный сценарий, когда агент потратил или потерял весь выделенный учебный бюджет: завершить его или создать нового.",
    readTime: "8 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "Агент тратит только деньги своего кошелька и не может использовать резерв или капитал другого агента без явного действия пользователя.",
          "Когда доступный капитал стал нулевым и открытых позиций нет, статус становится «бюджет исчерпан».",
          "Пользователь видит два безопасных действия: завершить агента с сохранением истории или создать нового с новым учебным бюджетом.",
          "Пополнение разрешено только как прозрачное перемещение учебных денег из резерва в остановленный кошелёк агента.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentStatus.java", description: "Добавить состояние исчерпанного бюджета и архивный статус." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentWallet.java", description: "Сделать проверку доступных учебных средств единственным источником истины." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentService.java", description: "Атомарно завершать агента, возвращать свободный остаток в резерв и сохранять историю." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/web/AgentController.java", description: "Добавить команды завершения, пополнения и создания нового агента." },
          { path: "apps/web/components/screens/AgentDetailScreen.tsx", description: "Показать понятное пустое состояние и доступные действия без ручной торговли." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V19__add_agent_budget_exhausted_status.sql", description: "Добавить новые статусы без потери старой истории." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Перед любой сделкой проверять кошелёк, комиссию и лимит позиции. Заёмных денег нет.",
          "Завершение с открытыми позициями сначала закрывает их по текущей учебной цене, затем возвращает остаток в резерв.",
          "Проверить сохранение общей суммы учебного капитала, повторное нажатие команды и сохранность журнала закрытого агента.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-settings-transfers",
    order: 35,
    eyebrow: "Задача · настройки",
    title: "Настройки и учебные переводы",
    description: "Собрать настройки аккаунта в одном месте и сделать понятное перемещение учебного бюджета между резервом и кошельками агентов одного владельца.",
    readTime: "8 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "В настройках можно менять цель, ускорение, отображение сумм и правила уведомлений без редактирования кода.",
          "Пользователь переводит только учебные деньги: из своего резерва в остановленного агента или обратно. Между разными пользователями переводов нет.",
          "Каждое перемещение имеет дату, сумму, отправителя, получателя и объяснение в истории. Реальных платежей, карт и вывода средств нет.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/web/components/screens/SettingsScreen.tsx", description: "Собрать настройки в ясные разделы и добавить историю учебных переводов." },
          { path: "apps/web/components/screens/AgentDetailScreen.tsx", description: "Дать остановленному агенту действие «изменить бюджет» с подтверждением суммы." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/auth/domain/Account.java", description: "Хранить настройки аккаунта и резерв учебных денег." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/agents/application/AgentService.java", description: "Проводить перевод одной транзакцией и запрещать превышение доступного резерва." },
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/agents/domain/AgentWalletTransfer.java", description: "Хранить прозрачную историю перемещений между резервом и кошельками." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V20__add_wallet_transfer_history.sql", description: "Добавить журнал учебных переводов и необходимые ограничения." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Сумма перевода валидируется на backend; browser показывает только результат API.",
          "Нельзя забрать деньги у активного агента или обнулить его средства так, чтобы сломать уже открытую позицию.",
          "Проверить границы суммы, параллельные запросы, целостность остатка и историю каждого перевода.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-google-login",
    order: 36,
    eyebrow: "Задача · вход",
    title: "Вход через Google",
    description: "Добавить Google как дополнительный способ входа, не ломая текущую регистрацию по e-mail и паролю.",
    readTime: "9 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "На входе и регистрации есть кнопка «Продолжить с Google» с понятным текстом о переходе к Google.",
          "После подтверждения backend связывает проверенный Google-идентификатор с одним пользователем и выдаёт те же токены, что при обычном входе.",
          "Если e-mail уже существует, пользователь видит безопасный сценарий привязки, а не получает второй аккаунт.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/web/components/auth/AuthShell.tsx", description: "Добавить общую кнопку Google и состояния загрузки/ошибки." },
          { path: "apps/web/app/(auth)/login/page.tsx", description: "Запустить OAuth-редирект и сохранить безопасный параметр next." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/auth/web/AuthController.java", description: "Добавить начало OAuth-потока и безопасный callback." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/auth/application/AuthService.java", description: "Проверить identity token, связать пользователя и выпустить существующую пару токенов." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/config/SecurityConfig.java", description: "Разрешить только нужные callback-маршруты и сохранить защиту остальных API." },
          { path: "apps/backend/.env.example", description: "Описать GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET и точный callback URL без реальных значений." },
          { path: "Новый: apps/backend/src/main/resources/db/migration/V21__add_oauth_identity.sql", description: "Хранить провайдера и неизменяемый внешний идентификатор с уникальным ограничением." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Не доверять данным из браузера: проверять подпись, issuer, audience, срок действия и nonce на сервере.",
          "Не передавать Google-секреты в frontend и не писать токены провайдера в логи.",
          "Проверить новый вход, повторный вход, существующий e-mail, отмену на стороне Google и безопасный next.",
        ],
      },
    ],
  }),
  taskPage({
    slug: "task-live-market-data",
    order: 37,
    eyebrow: "Задача · данные",
    title: "Реальные котировки для просмотра",
    description: "Подключить внешний источник цен для экрана рынка, сохранив учебный торговый движок и полный отказ от настоящих денег.",
    readTime: "8 минут",
    sections: [
      {
        id: "result",
        title: "Что должно появиться",
        bullets: [
          "Страница рынка получает актуальные цены от выбранного провайдера и честно показывает время последнего обновления.",
          "Агенты продолжают работать в учебном режиме на отдельном воспроизводимом потоке, пока не будет отдельно утверждена синхронизация с внешними ценами.",
          "При недоступности провайдера интерфейс показывает время последней цены или учебный источник, а не выдумывает актуальную котировку.",
        ],
      },
      {
        id: "files",
        title: "Какие файлы изменить",
        entries: [
          { path: "apps/backend/src/main/java/dev/tradr/backend/market/provider/MarketDataProvider.java", description: "Сохранить общий контракт, чтобы экран не зависел от конкретного API." },
          { path: "Новый: apps/backend/src/main/java/dev/tradr/backend/market/provider/LiveMarketDataProvider.java", description: "Запрашивать внешний API, нормализовать цены и обрабатывать лимиты/ошибки." },
          { path: "apps/backend/src/main/java/dev/tradr/backend/market/application/MarketService.java", description: "Выбирать источник по конфигурации и отдавать метаданные свежести." },
          { path: "apps/backend/.env.example", description: "Добавить имя провайдера и ключ без реального ключа в репозитории." },
          { path: "apps/web/components/screens/MarketScreen.tsx", description: "Показать источник, время обновления и состояние недоступности данных." },
        ],
      },
      {
        id: "logic",
        title: "Логика и проверка",
        bullets: [
          "Ключ провайдера остаётся только на backend. В браузер не попадают секреты и прямые запросы к платному API.",
          "Добавить кэш, ограничение частоты и понятный fallback на синтетический учебный рынок.",
          "Проверить нормализацию валюты, устаревшую цену, исчерпанный лимит API и отсутствие влияния на учебный кошелёк.",
        ],
      },
    ],
  }),
  {
    slug: "git-workflow",
    order: 38,
    group: "Данные и разработка",
    eyebrow: "Разработка · Git",
    title: "Git, коммиты и Pull Request",
    description: "Единый рабочий процесс для TRADR: от создания ветки до понятного Pull Request, который можно безопасно проверить и объединить.",
    readTime: "7 минут",
    sections: [
      {
        id: "repository",
        title: "Репозиторий",
        entries: [
          { path: "github.com/Hqzdev/tradr", description: "Официальный репозиторий TRADR. Здесь находятся исходный код, ветки и Pull Request.", href: "https://github.com/Hqzdev/tradr", tag: "GitHub" },
          { path: "CONTRIBUTING.md", description: "Полные правила участия: кодстайл, ветки, коммиты, проверки и описание Pull Request." },
          { path: "apps/web/CLAUDE.md", description: "Обязательно прочитайте перед frontend-задачей: иконки, анимации, дизайн и changelog." },
        ],
      },
      {
        id: "branches",
        title: "Правила веток",
        entries: [
          { path: "main", description: "Стабильная релизная ветка. В неё не пушат напрямую." },
          { path: "develop", description: "Общая ветка интеграции. Все новые рабочие ветки создаются от неё." },
          { path: "feature/<краткое-имя>", description: "Новая возможность: feature/custom-agent-profile." },
          { path: "fix/<краткое-имя>", description: "Исправление ошибки: fix/dashboard-empty-state." },
          { path: "docs/<краткое-имя> · chore/<краткое-имя>", description: "Документация или служебная работа. Одна ветка решает одну задачу." },
        ],
        note: "Ветка develop уже создана в GitHub. Временные feature/*, fix/* и docs/* создаются только под реальную задачу и удаляются после слияния.",
      },
      {
        id: "commits",
        title: "Правила коммитов",
        description: "Один коммит — одно законченное изменение. Сообщение начинается с типа, области и короткого действия.",
        code: "feat(agents): add custom profile validation\nfix(market): preserve quote timestamp on fallback\ndocs(git): describe pull request workflow\nchore(web): update release notes",
        bullets: [
          "Используйте типы feat, fix, docs, refactor, test или chore.",
          "Не оставляйте в готовой истории сообщения fix, changes или wip без объяснения.",
          "Не коммитьте .env, токены, пароли, ключи API и пользовательские данные.",
        ],
      },
      {
        id: "pull-request",
        title: "Как открыть Pull Request",
        bullets: [
          "Откройте PR из рабочей ветки в develop. В main попадают только проверенные изменения из develop.",
          "Опишите цель, затронутые модули и API, проведённые проверки и известные ограничения.",
          "Для заметного UI-изменения приложите скриншот или короткую запись. Для изменения backend добавьте тесты соответствующей логики.",
          "Перед открытием выполните git diff --check, синхронизируйте ветку с develop и убедитесь, что в diff нет секретов.",
        ],
      },
      {
        id: "commands",
        title: "Минимальный набор команд",
        code: "git switch develop\ngit pull --ff-only origin develop\ngit switch -c feature/short-task-name\n\n# после проверки\ngit add <файлы>\ngit commit -m \"feat(scope): short action\"\ngit push -u origin feature/short-task-name",
      },
    ],
  },
];

export function getDocPage(slug?: string): DocPage | undefined {
  return docsPages.find((page) => page.slug === (slug ?? "overview"));
}

export function getCopyableDocText(page: DocPage): string {
  const lines = [
    `TRADR — ${page.kind === "task" ? "задача" : "статья"}`,
    page.title,
    "",
    page.description,
    "",
  ];

  for (const section of page.sections) {
    lines.push(section.title);
    if (section.description) lines.push(section.description);
    for (const item of section.bullets ?? []) lines.push(`• ${item}`);
    for (const entry of section.entries ?? []) lines.push(`• ${entry.path}: ${entry.description}`);
    if (section.code) lines.push(section.code);
    if (section.note) lines.push(`Важно: ${section.note}`);
    lines.push("");
  }

  return lines.join("\n").trim();
}

export function getAdjacentPages(page: DocPage) {
  const index = docsPages.findIndex((candidate) => candidate.slug === page.slug);
  return {
    previous: index > 0 ? docsPages[index - 1] : undefined,
    next: index < docsPages.length - 1 ? docsPages[index + 1] : undefined,
  };
}
