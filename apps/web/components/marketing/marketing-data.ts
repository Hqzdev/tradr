export interface MarketingLink {
  readonly href: string;
  readonly label: string;
}

export interface FooterGroup {
  readonly title: string;
  readonly links: readonly MarketingLink[];
}

export interface JobRole {
  readonly title: string;
  readonly location: string;
  readonly href: string;
}

export interface JobDepartment {
  readonly title: string;
  readonly roles: readonly JobRole[];
}

export interface BenefitGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface InfoCard {
  readonly title: string;
  readonly description: string;
  readonly href: string;
}

export interface GovernancePhase {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export interface DeveloperGuide {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly tone: "pink" | "blue" | "green" | "orange" | "violet";
}

export interface HelpArticle {
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
}

export interface PrivacySection {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export const marketingNavigation: readonly MarketingLink[] = [
  { href: "/about", label: "О TRADR" },
  { href: "/careers", label: "Карьера" },
  { href: "/governance", label: "Управление" },
  { href: "/developers", label: "Разработчикам" },
  { href: "/help", label: "Помощь" },
] as const;

export const footerGroups: readonly FooterGroup[] = [
  {
    title: "Платформа",
    links: [
      { href: "/market", label: "Рынок" },
      { href: "/terminal", label: "Терминал" },
      { href: "/portfolio", label: "Портфель" },
      { href: "/agents", label: "Агенты" },
    ],
  },
  {
    title: "Обучение",
    links: [
      { href: "/catalog", label: "Материалы" },
      { href: "/docs", label: "Документация" },
      { href: "/journal", label: "Журнал" },
      { href: "/history", label: "История" },
    ],
  },
  {
    title: "Компания",
    links: [
      { href: "/about", label: "О TRADR" },
      { href: "/careers", label: "Карьера" },
      { href: "/governance", label: "Управление" },
    ],
  },
  {
    title: "Помощь",
    links: [
      { href: "/developers", label: "Разработчикам" },
      { href: "/help", label: "Центр помощи" },
      { href: "/contact", label: "Связаться с нами" },
      { href: "/privacy", label: "Конфиденциальность" },
    ],
  },
] as const;

export const jobDepartments: readonly JobDepartment[] = [
  {
    title: "Дизайн",
    roles: [{ title: "Продуктовый дизайнер", location: "Удалённо · Россия", href: "/contact?topic=career-design" }],
  },
  {
    title: "Образование",
    roles: [{ title: "Автор учебных сценариев", location: "Удалённо", href: "/contact?topic=career-education" }],
  },
  {
    title: "Разработка",
    roles: [
      { title: "Frontend-инженер", location: "Удалённо · Россия", href: "/contact?topic=career-frontend" },
      { title: "Backend-инженер", location: "Удалённо · Россия", href: "/contact?topic=career-backend" },
      { title: "Инженер данных", location: "Удалённо", href: "/contact?topic=career-data" },
    ],
  },
] as const;

export const benefitGroups: readonly BenefitGroup[] = [
  { title: "Рост", items: ["Бюджет на обучение", "Внутренние разборы", "Профильные конференции"] },
  { title: "Рабочая среда", items: ["Удалённый формат", "Гибкое начало дня", "Современные инструменты"] },
  { title: "Здоровье", items: ["Расширенная страховка", "Дни восстановления", "Поддержка спорта"] },
  { title: "Команда", items: ["Общие продуктовые сессии", "Очные встречи", "Открытая обратная связь"] },
] as const;

export const governanceResources: readonly InfoCard[] = [
  { title: "Предложить изменение", description: "Опишите проблему, цель и ожидаемый эффект для учебной платформы.", href: "/contact?topic=proposal" },
  { title: "Обсудить идею", description: "Сверьте предложение с участниками сообщества до формального рассмотрения.", href: "/teams" },
  { title: "Изучить решения", description: "Посмотрите историю изменений продукта и аргументы команды.", href: "/history" },
  { title: "Проверить документацию", description: "Уточните устройство платформы, данные и ограничения симуляции.", href: "/docs" },
] as const;

export const governancePhases: readonly GovernancePhase[] = [
  { number: "01", title: "Контекст", description: "Инициатор описывает наблюдение, проблему и пользователей, которых затронет изменение." },
  { number: "02", title: "Обсуждение", description: "Команда и сообщество проверяют предпосылки, риски, доступность и учебную ценность идеи." },
  { number: "03", title: "Решение", description: "Фиксируется итог, ответственные и критерии результата. После выпуска эффект попадает в историю изменений." },
] as const;

export const developerGuides: readonly DeveloperGuide[] = [
  { title: "Получить рыночные данные", description: "Разберитесь в структуре котировок и инструментов.", href: "/docs/backend-market", tone: "pink" },
  { title: "Работать с заявками", description: "Изучите учебный жизненный цикл сделки.", href: "/docs/backend-trading", tone: "blue" },
  { title: "Создать агента", description: "Настройте характер и ограничения стратегии.", href: "/docs/backend-agents", tone: "green" },
  { title: "Разобрать результат", description: "Свяжите сигналы, решения и итог портфеля.", href: "/docs/data-and-tests", tone: "orange" },
  { title: "Подключить команду", description: "Организуйте совместный учебный сценарий.", href: "/docs/team-workflow", tone: "violet" },
] as const;

export const helpTopics: readonly InfoCard[] = [
  { title: "Первые шаги", description: "Создание демо-счёта и первый учебный сценарий.", href: "/docs" },
  { title: "Терминал", description: "Заявки, графики и контроль учебного бюджета.", href: "/docs/backend-trading" },
  { title: "Торговые агенты", description: "Характеры, решения и сравнение стратегий.", href: "/docs/backend-agents" },
  { title: "Нужна помощь", description: "Опишите вопрос — команда подскажет направление.", href: "/contact" },
] as const;

export const helpArticles: readonly HelpArticle[] = [
  { title: "Как начать обучение?", description: "Создайте демо-счёт, выберите инструмент и проведите первую сделку без реальных денег.", tags: ["старт", "обучение"] },
  { title: "Что такое учебный бюджет?", description: "Это виртуальный баланс для практики. Он не связан с банковским счётом или реальными активами.", tags: ["счёт", "риск"] },
  { title: "Почему агенты принимают разные решения?", description: "Каждый агент интерпретирует один и тот же рынок через собственные правила риска и поведения.", tags: ["агенты", "стратегия"] },
  { title: "Как работает рыночная заявка?", description: "Симуляция использует доступную учебную цену и сразу показывает влияние сделки на портфель.", tags: ["заявки", "терминал"] },
  { title: "Где найти историю решений?", description: "Журнал сохраняет сигнал, действие, размер позиции и результат каждого шага.", tags: ["журнал", "история"] },
  { title: "Можно ли потерять реальные деньги?", description: "Нет. TRADR — учебная среда и не выполняет операции с реальными средствами.", tags: ["безопасность", "риск"] },
  { title: "Как сравнить агентов?", description: "Откройте раздел агентов и сопоставьте их действия на одинаковом временном отрезке.", tags: ["агенты", "сравнение"] },
  { title: "Почему котировка изменилась?", description: "Цена отражает движение учебного рынка; подробный контекст доступен на странице инструмента.", tags: ["рынок", "котировки"] },
] as const;

export const privacySections: readonly PrivacySection[] = [
  {
    id: "summary",
    title: "Коротко",
    paragraphs: ["Эта политика объясняет, какие данные могут обрабатываться при использовании сайта и учебной платформы TRADR, зачем это необходимо и какие возможности контроля доступны пользователю."],
    bullets: ["Мы собираем только данные, необходимые для работы учебных функций.", "TRADR не продаёт персональные данные.", "Учебные сделки не являются реальными финансовыми операциями.", "По вопросам данных можно обратиться через форму связи."],
  },
  {
    id: "data",
    title: "Какие данные мы обрабатываем",
    paragraphs: ["При регистрации могут обрабатываться адрес электронной почты, имя профиля и технические сведения, необходимые для входа и защиты аккаунта. Платформа сохраняет созданных агентов, учебные заявки, портфель и журнал решений.", "Также могут обрабатываться обезличенные технические события: тип устройства, версия браузера, время ответа интерфейса и сведения об ошибках."],
  },
  {
    id: "use",
    title: "Как используются данные",
    paragraphs: ["Данные используются для предоставления функций TRADR, сохранения прогресса, поддержки пользователей, обеспечения безопасности и улучшения качества учебных сценариев."],
    bullets: ["Работа аккаунта и синхронизация прогресса.", "Отображение учебных сделок и результатов агентов.", "Диагностика ошибок и предотвращение злоупотреблений.", "Ответы на обращения в службу поддержки."],
  },
  {
    id: "sharing",
    title: "Передача данных",
    paragraphs: ["Мы можем привлекать инфраструктурных поставщиков для размещения приложения, доставки сообщений и анализа стабильности. Они получают только необходимый объём данных и обязаны защищать его. Передача также возможна, когда этого требует применимое законодательство."],
  },
  {
    id: "retention",
    title: "Хранение и удаление",
    paragraphs: ["Данные хранятся, пока аккаунт активен или пока это необходимо для работы сервиса и выполнения законных обязательств. Запрос на исправление или удаление можно направить через страницу связи."],
  },
  {
    id: "security",
    title: "Безопасность",
    paragraphs: ["TRADR применяет организационные и технические меры защиты. При этом ни один способ передачи и хранения данных не гарантирует абсолютную безопасность; пользователь отвечает за сохранность своих данных для входа."],
  },
  {
    id: "rights",
    title: "Ваши права",
    paragraphs: ["В зависимости от применимого законодательства вы можете запросить доступ, исправление, перенос или удаление персональных данных, а также ограничить отдельные способы их обработки."],
  },
  {
    id: "changes",
    title: "Изменения политики",
    paragraphs: ["При существенных изменениях мы обновим эту страницу и дату редакции. Продолжая пользоваться сервисом после публикации изменений, пользователь подтверждает ознакомление с новой редакцией."],
  },
  {
    id: "contact",
    title: "Связаться с нами",
    paragraphs: ["Вопросы о конфиденциальности и запросы, связанные с данными, можно направить через форму обратной связи, выбрав тему «Конфиденциальность»."],
  },
] as const;
