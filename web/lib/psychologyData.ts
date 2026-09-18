import type { AgentStrategy } from "./types";

// Persona identity layer for the "agent psychology" screens (character,
// budget, skills, team, log). The trading fixtures elsewhere keep the
// strategy-style names (Агрессивный/Осторожный/Случайный); these screens
// additionally give each agent a personal name, matching design.pen.
export const PERSONA: Record<AgentStrategy, { name: string; initial: string; typeLabel: string }> = {
  aggressive: { name: "Искра", initial: "И", typeLabel: "Агрессивный" },
  careful: { name: "Оскар", initial: "О", typeLabel: "Стабильный" },
  random: { name: "Кира", initial: "К", typeLabel: "Рискованный" },
};

export interface CharacterInfo {
  temperLabel: string;
  strengths: { title: string; note: string }[];
  weaknesses: { title: string; note: string }[];
  footNote: string;
  relations: {
    kind: "friend" | "neutral" | "conflict";
    mark: string;
    name: string;
    tag: string;
    impact: string;
  }[];
  trendBars: number[];
  trendCaption: string;
  feePercent: string;
  sessionSpend: string;
  bankFeePercent: string;
  feeNoteText: string;
}

export const characterInfo: Record<AgentStrategy, CharacterInfo> = {
  aggressive: {
    temperLabel: "Импульсивный",
    strengths: [
      { title: "Быстрая реакция", note: "входит в движение раньше рынка" },
      { title: "Смелое исполнение", note: "не пропускает сильные сигналы" },
    ],
    weaknesses: [
      { title: "Низкая терпеливость", note: "может закрыть позицию рано" },
      { title: "Переоценка импульса", note: "игнорирует слабые стоп-сигналы" },
    ],
    footNote: "Интеллект 78 · риск 86 · 8 сделок сегодня",
    relations: [
      { kind: "friend", mark: "О", name: "Оскар", tag: "Союзник · стабильный", impact: "+12% к дисциплине" },
      { kind: "neutral", mark: "К", name: "Кира", tag: "Нейтрально · рискованный", impact: "не меняет стратегию" },
      { kind: "conflict", mark: "Р", name: "Роман", tag: "Конфликт · агрессивный", impact: "−8% к концентрации" },
    ],
    trendBars: [42, 68, 48, 82],
    trendCaption: "Влияние команды за текущую сессию",
    feePercent: "2,4%",
    sessionSpend: "1 280 ₽",
    bankFeePercent: "0,15%",
    feeNoteText: "При прибыли 10 000 ₽ Искра получит 240 ₽.",
  },
  careful: {
    temperLabel: "Хладнокровный",
    strengths: [
      { title: "Строгая дисциплина", note: "держит стоп-лимит без исключений" },
      { title: "Терпеливый вход", note: "ждёт подтверждения перед сделкой" },
    ],
    weaknesses: [
      { title: "Медленная реакция", note: "может упустить короткий импульс" },
      { title: "Излишняя осторожность", note: "закрывает позиции раньше цели" },
    ],
    footNote: "Интеллект 71 · риск 24 · 3 сделки сегодня",
    relations: [
      { kind: "friend", mark: "И", name: "Искра", tag: "Союзник · агрессивный", impact: "+9% к точности Искры" },
      { kind: "neutral", mark: "К", name: "Кира", tag: "Нейтрально · рискованный", impact: "не меняет стратегию" },
      { kind: "friend", mark: "Л", name: "Лев", tag: "Союзник · рискованный", impact: "+6% к дисциплине Льва" },
    ],
    trendBars: [58, 62, 60, 71],
    trendCaption: "Влияние команды за текущую сессию",
    feePercent: "1,6%",
    sessionSpend: "410 ₽",
    bankFeePercent: "0,15%",
    feeNoteText: "При прибыли 10 000 ₽ Оскар получит 160 ₽.",
  },
  random: {
    temperLabel: "Непредсказуемый",
    strengths: [
      { title: "Широкий охват", note: "пробует активы, которые другие игнорируют" },
      { title: "Нет привязанности к позиции", note: "легко признаёт ошибку и выходит" },
    ],
    weaknesses: [
      { title: "Слабая система входа", note: "решения не всегда опираются на сигнал" },
      { title: "Непостоянный риск", note: "размер позиции скачет от сделки к сделке" },
    ],
    footNote: "Интеллект 64 · риск 91 · 11 сделок сегодня",
    relations: [
      { kind: "neutral", mark: "И", name: "Искра", tag: "Нейтрально · агрессивный", impact: "не меняет стратегию" },
      { kind: "conflict", mark: "Р", name: "Роман", tag: "Конфликт · агрессивный", impact: "−5% к точности" },
      { kind: "friend", mark: "Л", name: "Лев", tag: "Союзник · рискованный", impact: "+7% к охвату" },
    ],
    trendBars: [30, 54, 26, 60],
    trendCaption: "Влияние команды за текущую сессию",
    feePercent: "2,0%",
    sessionSpend: "890 ₽",
    bankFeePercent: "0,15%",
    feeNoteText: "При прибыли 10 000 ₽ Кира получит 200 ₽.",
  },
};

export interface BudgetInfo {
  sessionLabel: string;
  capitalWorking: string;
  capitalOutOf: string;
  free: string;
  freePercentOfLimit: string;
  pnl: string;
  pnlPercent: string;
  riskUsedPercent: string;
  suggestedAmount: string;
  quickAmounts: { label: string; highlight?: boolean }[];
  balanceAfter: string;
  tradeLimitLabel: string;
  tradeLimitValue: string;
  tradeLimitPercent: number;
  stopLimitLabel: string;
  stopLimitValue: string;
  stopLimitPercent: number;
  stopNote: string;
  ledger: { date: string; event: string; sum: string; negative: boolean }[];
}

export const budgetInfo: Record<AgentStrategy, BudgetInfo> = {
  aggressive: {
    sessionLabel: "Сессия #04 · активно",
    capitalWorking: "75 000 ₽",
    capitalOutOf: "из выданных 100 000 ₽",
    free: "18 480 ₽",
    freePercentOfLimit: "18,5% от лимита",
    pnl: "+6 240 ₽",
    pnlPercent: "+6,2% за сессию",
    riskUsedPercent: "68%",
    suggestedAmount: "25 000",
    quickAmounts: [{ label: "+5 000" }, { label: "+10 000" }, { label: "+25 000", highlight: true }, { label: "До лимита" }],
    balanceAfter: "100 000 ₽",
    tradeLimitLabel: "На одну сделку",
    tradeLimitValue: "25 000 ₽",
    tradeLimitPercent: 59,
    stopLimitLabel: "Стоп-лимит за день",
    stopLimitValue: "−8 000 ₽",
    stopLimitPercent: 68,
    stopNote: "Использовано 5 440 ₽ · осталось 2 560 ₽",
    ledger: [
      { date: "Сегодня, 11:32", event: "Покупка NVDA · 12 акций", sum: "−10 920 ₽", negative: true },
      { date: "Сегодня, 11:18", event: "Продажа AAPL · 18 акций", sum: "+16 480 ₽", negative: false },
      { date: "Вчера, 16:05", event: "Комиссия агента", sum: "−240 ₽", negative: true },
    ],
  },
  careful: {
    sessionLabel: "Сессия #04 · активно",
    capitalWorking: "52 000 ₽",
    capitalOutOf: "из выданных 60 000 ₽",
    free: "8 000 ₽",
    freePercentOfLimit: "13,3% от лимита",
    pnl: "+1 860 ₽",
    pnlPercent: "+3,1% за сессию",
    riskUsedPercent: "22%",
    suggestedAmount: "10 000",
    quickAmounts: [{ label: "+2 000" }, { label: "+5 000", highlight: true }, { label: "+10 000" }, { label: "До лимита" }],
    balanceAfter: "60 000 ₽",
    tradeLimitLabel: "На одну сделку",
    tradeLimitValue: "8 000 ₽",
    tradeLimitPercent: 30,
    stopLimitLabel: "Стоп-лимит за день",
    stopLimitValue: "−2 500 ₽",
    stopLimitPercent: 24,
    stopNote: "Использовано 600 ₽ · осталось 1 900 ₽",
    ledger: [
      { date: "Сегодня, 10:52", event: "Покупка MSFT · 5 акций", sum: "−2 144 ₽", negative: true },
      { date: "Вчера, 15:40", event: "Продажа GOOGL · 4 акции", sum: "+3 020 ₽", negative: false },
      { date: "Вчера, 09:12", event: "Комиссия агента", sum: "−96 ₽", negative: true },
    ],
  },
  random: {
    sessionLabel: "Сессия #04 · активно",
    capitalWorking: "38 000 ₽",
    capitalOutOf: "из выданных 50 000 ₽",
    free: "12 000 ₽",
    freePercentOfLimit: "24% от лимита",
    pnl: "−1 120 ₽",
    pnlPercent: "−2,2% за сессию",
    riskUsedPercent: "81%",
    suggestedAmount: "15 000",
    quickAmounts: [{ label: "+3 000" }, { label: "+7 500" }, { label: "+15 000", highlight: true }, { label: "До лимита" }],
    balanceAfter: "50 000 ₽",
    tradeLimitLabel: "На одну сделку",
    tradeLimitValue: "12 000 ₽",
    tradeLimitPercent: 72,
    stopLimitLabel: "Стоп-лимит за день",
    stopLimitValue: "−6 000 ₽",
    stopLimitPercent: 81,
    stopNote: "Использовано 4 860 ₽ · осталось 1 140 ₽",
    ledger: [
      { date: "Сегодня, 12:05", event: "Покупка TSLA · 3 акции", sum: "−741 ₽", negative: true },
      { date: "Сегодня, 09:47", event: "Продажа META · 6 акций", sum: "+2 760 ₽", negative: false },
      { date: "Вчера, 17:22", event: "Комиссия агента", sum: "−178 ₽", negative: true },
    ],
  },
};

export interface SkillRow {
  key: string;
  label: string;
  sub: string;
  score: number;
  effect: string;
  tone: "good" | "warn" | "bad" | "brand";
}

export interface SkillsInfo {
  decisionSummary: string;
  overallLevel: number;
  rangeLabel: string;
  suggestionText: string;
  rows: SkillRow[];
}

export const skillsInfo: Record<AgentStrategy, SkillsInfo> = {
  aggressive: {
    decisionSummary: "Искра сильнее всего в скорости реакции. Дисциплину поддерживает работа с Оскаром.",
    overallLevel: 74,
    rangeLabel: "Агрессивный: 45–95",
    suggestionText: "Дисциплина и риск — слабые точки Искры. Связка с Оскаром снижает вероятность нарушения стопа.",
    rows: [
      { key: "signals", label: "Анализ сигналов", sub: "распознаёт условия входа", score: 86, effect: "точнее выбирает точку входа", tone: "good" },
      { key: "discipline", label: "Дисциплина", sub: "следует правилам и стоп-лимитам", score: 54, effect: "может нарушить стоп при импульсе", tone: "warn" },
      { key: "timing", label: "Тайминг", sub: "выбирает момент исполнения", score: 79, effect: "быстрее фиксирует выгодную цену", tone: "good" },
      { key: "risk", label: "Управление риском", sub: "соотносит размер позиции и риск", score: 47, effect: "нужен строгий лимит на сделку", tone: "bad" },
      { key: "endurance", label: "Выносливость", sub: "сохраняет качество в длинной сессии", score: 68, effect: "снижение точности после 8 сделок", tone: "brand" },
    ],
  },
  careful: {
    decisionSummary: "Оскар сильнее всего в дисциплине. Скорость реакции — его главное ограничение.",
    overallLevel: 69,
    rangeLabel: "Стабильный: 30–75",
    suggestionText: "Тайминг у Оскара ниже среднего — команда с Искрой компенсирует это скоростью входа.",
    rows: [
      { key: "signals", label: "Анализ сигналов", sub: "распознаёт условия входа", score: 61, effect: "реже ловит ранние сигналы", tone: "warn" },
      { key: "discipline", label: "Дисциплина", sub: "следует правилам и стоп-лимитам", score: 91, effect: "почти никогда не нарушает стоп", tone: "good" },
      { key: "timing", label: "Тайминг", sub: "выбирает момент исполнения", score: 42, effect: "входит позже оптимальной точки", tone: "bad" },
      { key: "risk", label: "Управление риском", sub: "соотносит размер позиции и риск", score: 83, effect: "стабильно держит риск в рамках", tone: "good" },
      { key: "endurance", label: "Выносливость", sub: "сохраняет качество в длинной сессии", score: 77, effect: "почти не теряет точность к концу", tone: "brand" },
    ],
  },
  random: {
    decisionSummary: "Кира берёт широту охвата — но система входа пока самая слабая среди агентов.",
    overallLevel: 58,
    rangeLabel: "Рискованный: 20–90",
    suggestionText: "Дисциплина и сигналы — узкое место Киры. Пара с Оскаром снижает риск лишних входов.",
    rows: [
      { key: "signals", label: "Анализ сигналов", sub: "распознаёт условия входа", score: 48, effect: "чаще входит без подтверждения", tone: "bad" },
      { key: "discipline", label: "Дисциплина", sub: "следует правилам и стоп-лимитам", score: 39, effect: "склонна нарушать стоп-лимит", tone: "bad" },
      { key: "timing", label: "Тайминг", sub: "выбирает момент исполнения", score: 66, effect: "неровный, но иногда точный вход", tone: "warn" },
      { key: "risk", label: "Управление риском", sub: "соотносит размер позиции и риск", score: 44, effect: "размер позиции скачет от сделки", tone: "bad" },
      { key: "endurance", label: "Выносливость", sub: "сохраняет качество в длинной сессии", score: 81, effect: "не устаёт даже в длинной сессии", tone: "brand" },
    ],
  },
};

export interface TeamMember {
  id: AgentStrategy;
  name: string;
  role: string;
  roleColor: "magenta" | "positive" | "warning";
}

export interface TeamInfo {
  id: string;
  name: string;
  statusLabel: string;
  pnlLabel: string;
  members: TeamMember[];
  strategyName: string;
  strategyText: string;
  contribution: { name: string; percent: number; color: string }[];
  conflict?: { pair: string; text: string };
}

export const teams: TeamInfo[] = [
  {
    id: "sever",
    name: "«Север»",
    statusLabel: "Совместная стратегия · активна 4 дня",
    pnlLabel: "+8,4%",
    members: [
      { id: "aggressive", name: "Искра", role: "вход в импульс", roleColor: "magenta" },
      { id: "careful", name: "Оскар", role: "подтверждает выход", roleColor: "positive" },
      { id: "random", name: "Кира", role: "отсекает риск", roleColor: "warning" },
    ],
    strategyName: "«Вход импульсом, выход по тренду»",
    strategyText:
      "Искра ищет импульс, Кира отсекает рискованные активы, Оскар удерживает позицию до подтверждения выхода.",
    contribution: [
      { name: "Искра", percent: 40, color: "#E91BAC" },
      { name: "Оскар", percent: 35, color: "#00856F" },
      { name: "Кира", percent: 25, color: "#C9670A" },
    ],
    conflict: { pair: "Искра ↔ Роман", text: "Спорят о выходе из позиции. Концентрация Искры −8%." },
  },
  {
    id: "tihiy-rost",
    name: "«Тихий рост»",
    statusLabel: "Совместная стратегия · активна 11 дней",
    pnlLabel: "+3,1%",
    members: [
      { id: "careful", name: "Саша", role: "фильтр входа", roleColor: "positive" },
      { id: "careful", name: "Мира", role: "контроль риска", roleColor: "positive" },
    ],
    strategyName: "«Только стабильные акции, длинный горизонт»",
    strategyText: "Саша и Мира держат позиции неделями и заходят только после подтверждения тренда.",
    contribution: [
      { name: "Саша", percent: 55, color: "#00856F" },
      { name: "Мира", percent: 45, color: "#E91BAC" },
    ],
  },
  {
    id: "risk-lab",
    name: "«Риск-лаборатория»",
    statusLabel: "Совместная стратегия · активна 2 дня",
    pnlLabel: "−1,8%",
    members: [
      { id: "random", name: "Кира", role: "широкий охват", roleColor: "warning" },
      { id: "random", name: "Роман", role: "агрессивный вход", roleColor: "magenta" },
      { id: "random", name: "Лев", role: "фиксация прибыли", roleColor: "positive" },
    ],
    strategyName: "«Высокая волатильность, быстрый выход»",
    strategyText: "Кира, Роман и Лев тестируют рискованные активы с коротким горизонтом удержания.",
    contribution: [
      { name: "Кира", percent: 38, color: "#C9670A" },
      { name: "Роман", percent: 34, color: "#E91BAC" },
      { name: "Лев", percent: 28, color: "#00856F" },
    ],
  },
];

export const relationsSummary = {
  activeTeams: 3,
  friendLinks: 5,
  activeConflicts: 1,
  totalResult: "+8,4%",
  keyRelations: [
    { kind: "friend" as const, title: "Искра ↔ Оскар", note: "Дружба · +12% к дисциплине" },
    { kind: "conflict" as const, title: "Искра ↔ Роман", note: "Конфликт · −8% к концентрации" },
    { kind: "support" as const, title: "Кира → Искра", note: "Подсказка · риск ниже на 6%" },
  ],
};

export interface FeedEvent {
  time: string;
  title: string;
  copy: string;
  impact: string;
  tone: "positive" | "negative" | "warning" | "brand";
}

export const feedEvents: FeedEvent[] = [
  {
    time: "10:42",
    title: "Искра и Оскар договорились",
    copy: "Оскар подтвердил выход из AAPL после сигнала Искры.",
    impact: "+ дисциплина",
    tone: "positive",
  },
  {
    time: "10:28",
    title: "Искра поссорилась с Романом",
    copy: "Роман настаивал удерживать NVDA, Искра предложила закрыть позицию.",
    impact: "− концентрация",
    tone: "negative",
  },
  {
    time: "10:12",
    title: "Кира поддержала Искру",
    copy: "Кира отметила высокий риск входа и предложила уменьшить объём.",
    impact: "риск −6%",
    tone: "warning",
  },
  {
    time: "09:57",
    title: "Команда «Север» изменила правило",
    copy: "Добавили подтверждение объёма перед каждым входом.",
    impact: "точность +4%",
    tone: "positive",
  },
  {
    time: "09:41",
    title: "Роман повлиял на решение",
    copy: "Искра перенесла стоп-лимит по TSLA после спора.",
    impact: "лимит изменён",
    tone: "brand",
  },
];

export interface SessionLogRow {
  time: string;
  action: string;
  reason: string;
  asset: string;
  result: string;
  resultTone: "positive" | "negative" | "neutral" | "warning";
  team: string;
}

export const agentSessionLog: Record<AgentStrategy, SessionLogRow[]> = {
  aggressive: [
    { time: "10:42", action: "Купить 12 шт.", reason: "Подтверждён рост объёма и сигнал команды.", asset: "AAPL", result: "+1 120 ₽", resultTone: "positive", team: "Оскар подтвердил" },
    { time: "10:28", action: "Продать 8 шт.", reason: "Риск лимита вырос; Кира предложила сократить объём.", asset: "NVDA", result: "−240 ₽", resultTone: "negative", team: "Кира поддержала" },
    { time: "10:14", action: "Ждать", reason: "Сигнал слабый, объём не подтверждён.", asset: "TSLA", result: "0 ₽", resultTone: "neutral", team: "правило «Север»" },
    { time: "09:57", action: "Купить 6 шт.", reason: "Импульс сильный, риск в пределах лимита.", asset: "MSFT", result: "+760 ₽", resultTone: "positive", team: "самостоятельно" },
    { time: "09:41", action: "Перенести стоп", reason: "Конфликт с Романом изменил уровень риска.", asset: "TSLA", result: "—", resultTone: "warning", team: "Роман повлиял" },
  ],
  careful: [
    { time: "10:35", action: "Купить 5 шт.", reason: "Тренд подтверждён третьей свечой подряд.", asset: "MSFT", result: "+420 ₽", resultTone: "positive", team: "самостоятельно" },
    { time: "10:02", action: "Ждать", reason: "Объём ниже среднего, сигнал не подтверждён.", asset: "AAPL", result: "0 ₽", resultTone: "neutral", team: "правило «Север»" },
    { time: "09:44", action: "Продать 4 шт.", reason: "Цель по прибыли достигнута.", asset: "GOOGL", result: "+310 ₽", resultTone: "positive", team: "самостоятельно" },
  ],
  random: [
    { time: "10:51", action: "Купить 3 шт.", reason: "Случайный сигнал совпал с ростом объёма.", asset: "TSLA", result: "−180 ₽", resultTone: "negative", team: "самостоятельно" },
    { time: "10:20", action: "Продать 6 шт.", reason: "Фиксация прибыли по таймеру сессии.", asset: "META", result: "+540 ₽", resultTone: "positive", team: "Лев поддержал" },
    { time: "09:58", action: "Купить 2 шт.", reason: "Вход без подтверждения сигнала.", asset: "NVDA", result: "−90 ₽", resultTone: "negative", team: "самостоятельно" },
  ],
};

export const journalEntries: {
  time: string;
  agent: string;
  action: string;
  asset: string;
  reason: string;
  result: string;
  resultTone: "positive" | "negative" | "neutral";
}[] = [
  { time: "10:42", agent: "Искра", action: "Покупка · 12 шт.", asset: "AAPL", reason: "рост объёма подтверждён", result: "+1 120 ₽", resultTone: "positive" },
  { time: "10:40", agent: "Оскар", action: "Ждать", asset: "AAPL", reason: "ожидает закрытия свечи", result: "0 ₽", resultTone: "neutral" },
  { time: "10:28", agent: "Кира", action: "Сократить позицию", asset: "NVDA", reason: "дневной риск приблизился к лимиту", result: "−240 ₽", resultTone: "negative" },
  { time: "10:17", agent: "Роман", action: "Удерживать", asset: "TSLA", reason: "ожидает продолжения тренда", result: "+310 ₽", resultTone: "positive" },
  { time: "09:57", agent: "Искра", action: "Покупка · 6 шт.", asset: "MSFT", reason: "импульс выше порога", result: "+760 ₽", resultTone: "positive" },
  { time: "09:41", agent: "Лев", action: "Продажа · 4 шт.", asset: "META", reason: "частичная фиксация прибыли", result: "+460 ₽", resultTone: "positive" },
];

export interface CatalogStock {
  ticker: string;
  name: string;
  type: "Стабильная" | "Нейтральная" | "Рискованная";
  chance: number;
  gain: string;
  loss: string;
}

export const catalogStocks: CatalogStock[] = [
  { ticker: "AAPL", name: "Apple Inc.", type: "Стабильная", chance: 78, gain: "+4–8%", loss: "−2–4%" },
  { ticker: "MSFT", name: "Microsoft Corp.", type: "Стабильная", chance: 74, gain: "+3–7%", loss: "−2–5%" },
  { ticker: "GOOGL", name: "Alphabet Inc.", type: "Нейтральная", chance: 62, gain: "+6–12%", loss: "−5–8%" },
  { ticker: "META", name: "Meta Platforms", type: "Нейтральная", chance: 58, gain: "+7–14%", loss: "−6–10%" },
  { ticker: "NVDA", name: "NVIDIA Corp.", type: "Рискованная", chance: 47, gain: "+14–28%", loss: "−10–18%" },
  { ticker: "TSLA", name: "Tesla Inc.", type: "Рискованная", chance: 39, gain: "+18–36%", loss: "−14–24%" },
];

export const CATALOG_TYPE_STYLE: Record<CatalogStock["type"], { bg: string; text: string; bar: string }> = {
  Стабильная: { bg: "bg-positive-tint", text: "text-positive", bar: "#00856F" },
  Нейтральная: { bg: "bg-magenta-tint", text: "text-magenta-deep", bar: "#E91BAC" },
  Рискованная: { bg: "bg-warning-tint", text: "text-warning", bar: "#C9670A" },
};

// Agent creation flow (type -> randomly generated character preview)
export interface AgentTypeOption {
  id: AgentStrategy;
  title: string;
  subtitle: string;
  detail: string;
}

export const agentTypeOptions: AgentTypeOption[] = [
  { id: "aggressive", title: "Агрессивный", subtitle: "Действует быстро, часто входит в сделку", detail: "Высокий темп · риск 55–90" },
  { id: "careful", title: "Стабильный", subtitle: "Выбирает устойчивые акции и ждёт подтверждения", detail: "Низкий риск · горизонт 7–30 дней" },
  { id: "random", title: "Рискованный", subtitle: "Ищет рискованные акции, но действует расчётливо", detail: "Риск активов 60–95 · темп средний" },
];

export interface GeneratedCharacterPreview {
  name: string;
  temperament: string;
  temperamentNote: string;
  temperamentProbability: string;
  intellect: number;
  intellectRange: string;
  risk: number;
  riskRange: string;
  skills: { label: string; score: number }[];
}

export const generatedCharacterPreview: Record<AgentStrategy, GeneratedCharacterPreview> = {
  aggressive: {
    name: "Искра",
    temperament: "Импульсивный",
    temperamentNote: "Быстро меняет мнение при сильном сигнале.",
    temperamentProbability: "Вероятность: 35%",
    intellect: 78,
    intellectRange: "Диапазон типа: 45–95",
    risk: 86,
    riskRange: "Диапазон типа: 55–90",
    skills: [
      { label: "Сигналы рынка", score: 72 },
      { label: "Дисциплина", score: 44 },
      { label: "Тайминг", score: 81 },
    ],
  },
  careful: {
    name: "Оскар",
    temperament: "Хладнокровный",
    temperamentNote: "Почти не реагирует на кратковременный шум.",
    temperamentProbability: "Вероятность: 41%",
    intellect: 71,
    intellectRange: "Диапазон типа: 40–80",
    risk: 24,
    riskRange: "Диапазон типа: 10–35",
    skills: [
      { label: "Сигналы рынка", score: 61 },
      { label: "Дисциплина", score: 91 },
      { label: "Тайминг", score: 42 },
    ],
  },
  random: {
    name: "Кира",
    temperament: "Непредсказуемый",
    temperamentNote: "Решения слабо зависят от предыдущего результата.",
    temperamentProbability: "Вероятность: 29%",
    intellect: 64,
    intellectRange: "Диапазон типа: 35–85",
    risk: 91,
    riskRange: "Диапазон типа: 60–95",
    skills: [
      { label: "Сигналы рынка", score: 48 },
      { label: "Дисциплина", score: 39 },
      { label: "Тайминг", score: 66 },
    ],
  },
};
