// Shared copy for EmptyState instances, kept in one place so the same
// list type reads identically wherever it shows up empty across the app.
// The four "designed" variants (сделки/позиции/агенты/данные) come straight
// from design.pen (28 · Пустые состояния); the rest are original copy kept
// in the same voice for list types the spec didn't cover explicitly.

export const emptyStates = {
  trades: {
    title: "Нет сделок",
    description: "Здесь появятся сделки, как только вы или агент откроете первую позицию.",
  },
  positions: {
    title: "Нет позиций",
    description: "Откройте позицию на рынке или запустите агента, чтобы увидеть её здесь.",
  },
  agents: {
    title: "Нет агентов",
    description: "Создайте торгового агента, чтобы он начал работать по своей стратегии.",
  },
  data: {
    title: "Нет данных",
    description: "Загрузите исторические данные или дождитесь следующего обновления котировок.",
  },
  orders: {
    title: "Нет открытых заявок",
    description: "Выставленные заявки появятся здесь до момента исполнения или отмены.",
  },
  news: {
    title: "Нет новостей",
    description: "Пока нет свежих новостей по этому инструменту.",
  },
  journal: {
    title: "Журнал пуст",
    description: "Записи появятся здесь, когда агенты начнут принимать решения.",
  },
  teamsFeed: {
    title: "Лента пуста",
    description: "События команды появятся здесь по мере работы агентов.",
  },
  sessionLog: {
    title: "Лог пуст",
    description: "Действия агента за сессию появятся здесь в хронологическом порядке.",
  },
  search: {
    title: "Ничего не найдено",
    description: "Попробуйте изменить запрос или проверьте написание тикера.",
  },
  catalog: {
    title: "Нет инструментов",
    description: "Измените фильтр, чтобы увидеть другие бумаги в каталоге.",
  },
  comparison: {
    title: "Нечего сравнивать",
    description: "Выберите агентов, чтобы сопоставить их результаты.",
  },
  ranking: {
    title: "Рейтинг пока пуст",
    description: "Как только агенты начнут торговать, здесь появится таблица результатов.",
  },
} as const;

export type EmptyStateKey = keyof typeof emptyStates;
