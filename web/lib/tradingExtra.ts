// Fixture data for the "trading loop" screen cluster: stock card, position
// detail, open orders, trade history, simulation (setup / data / live /
// results / export), and agent comparison / ranking. Mirrors design.pen
// node content (see the frame ids in comments) — aggressive/AAPL numbers
// match the design 1:1, the rest are original, internally-consistent
// extrapolations in the same style.

import type { AgentStrategy } from "./types";

// ---------- 13 Акция / Карточка (z1Zj1) ----------

export interface StockMetric {
  label: string;
  value: string;
}

export interface NewsItem {
  source: string;
  time: string;
  headline: string;
}

export interface StockCardInfo {
  ticker: string;
  name: string;
  price: string;
  dayChangePercent: number;
  volumeLabel: string;
  metrics: StockMetric[][]; // rows of 3
  news: NewsItem[];
}

export const stockCards: Record<string, StockCardInfo> = {
  AAPL: {
    ticker: "AAPL",
    name: "Apple Inc. · NASDAQ",
    price: "$192,45",
    dayChangePercent: 1.84,
    volumeLabel: "46,2M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "2,98 трлн $" },
        { label: "P/E", value: "31,4" },
        { label: "EPS", value: "6,13 $" },
      ],
      [
        { label: "Диапазон дня", value: "191,80 – 193,12" },
        { label: "52 недели", value: "164,08 – 199,62" },
        { label: "Дивиденды", value: "0,58%" },
      ],
      [
        { label: "Бета", value: "1,21" },
        { label: "Объём (ср. 30д)", value: "52,6М" },
        { label: "Free float", value: "98,7%" },
      ],
    ],
    news: [
      {
        source: "Reuters",
        time: "2 ч назад",
        headline:
          "Apple увеличивает заказы на компоненты для новых iPhone на фоне сильного спроса в Азии",
      },
      {
        source: "Bloomberg",
        time: "5 ч назад",
        headline:
          "Аналитики Morgan Stanley повысили целевую цену AAPL до 210 $ перед отчётом за квартал",
      },
      {
        source: "CNBC",
        time: "1 день назад",
        headline: "Apple объявила о buyback на 90 млрд $, акции выросли на 1,8%",
      },
      {
        source: "MarketWatch",
        time: "1 день назад",
        headline: "Поставщики сообщают о задержках в производстве Vision Pro второго поколения",
      },
    ],
  },
  NVDA: {
    ticker: "NVDA",
    name: "NVIDIA Corporation · NASDAQ",
    price: "$138,72",
    dayChangePercent: 2.1,
    volumeLabel: "58,9M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "3,41 трлн $" },
        { label: "P/E", value: "54,2" },
        { label: "EPS", value: "2,56 $" },
      ],
      [
        { label: "Диапазон дня", value: "135,90 – 139,40" },
        { label: "52 недели", value: "86,62 – 152,89" },
        { label: "Дивиденды", value: "0,03%" },
      ],
      [
        { label: "Бета", value: "1,68" },
        { label: "Объём (ср. 30д)", value: "210М" },
        { label: "Free float", value: "99,1%" },
      ],
    ],
    news: [
      {
        source: "Reuters",
        time: "1 ч назад",
        headline: "NVIDIA расширяет производство чипов Blackwell на новых мощностях TSMC",
      },
      {
        source: "Bloomberg",
        time: "4 ч назад",
        headline: "Спрос дата-центров на GPU превышает прогнозы третий квартал подряд",
      },
      {
        source: "CNBC",
        time: "1 день назад",
        headline: "NVIDIA и партнёры анонсировали новые контракты на 12 млрд $",
      },
    ],
  },
  TSLA: {
    ticker: "TSLA",
    name: "Tesla, Inc. · NASDAQ",
    price: "$247,18",
    dayChangePercent: -0.62,
    volumeLabel: "71,4M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "788 млрд $" },
        { label: "P/E", value: "68,9" },
        { label: "EPS", value: "3,59 $" },
      ],
      [
        { label: "Диапазон дня", value: "244,10 – 249,80" },
        { label: "52 недели", value: "138,80 – 271,40" },
        { label: "Дивиденды", value: "—" },
      ],
      [
        { label: "Бета", value: "2,04" },
        { label: "Объём (ср. 30д)", value: "89,3М" },
        { label: "Free float", value: "87,4%" },
      ],
    ],
    news: [
      {
        source: "Reuters",
        time: "3 ч назад",
        headline: "Tesla снизила цены на Model Y в Европе на фоне усиления конкуренции",
      },
      {
        source: "MarketWatch",
        time: "6 ч назад",
        headline: "Аналитики спорят о темпах роста поставок Tesla в четвёртом квартале",
      },
    ],
  },
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation · NASDAQ",
    price: "$428,76",
    dayChangePercent: 0.48,
    volumeLabel: "19,8M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "3,19 трлн $" },
        { label: "P/E", value: "36,1" },
        { label: "EPS", value: "11,88 $" },
      ],
      [
        { label: "Диапазон дня", value: "425,90 – 430,10" },
        { label: "52 недели", value: "362,90 – 468,35" },
        { label: "Дивиденды", value: "0,71%" },
      ],
      [
        { label: "Бета", value: "0,90" },
        { label: "Объём (ср. 30д)", value: "21,4М" },
        { label: "Free float", value: "99,8%" },
      ],
    ],
    news: [
      {
        source: "Bloomberg",
        time: "3 ч назад",
        headline: "Microsoft увеличивает инвестиции в дата-центры Azure AI на 20 млрд $",
      },
      {
        source: "Reuters",
        time: "8 ч назад",
        headline: "Copilot набирает 400 млн активных пользователей в корпоративном сегменте",
      },
    ],
  },
  AMZN: {
    ticker: "AMZN",
    name: "Amazon.com, Inc. · NASDAQ",
    price: "$186,42",
    dayChangePercent: 1.06,
    volumeLabel: "34,1M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "1,96 трлн $" },
        { label: "P/E", value: "42,8" },
        { label: "EPS", value: "4,36 $" },
      ],
      [
        { label: "Диапазон дня", value: "184,50 – 187,90" },
        { label: "52 недели", value: "142,10 – 201,20" },
        { label: "Дивиденды", value: "—" },
      ],
      [
        { label: "Бета", value: "1,15" },
        { label: "Объём (ср. 30д)", value: "38,7М" },
        { label: "Free float", value: "89,9%" },
      ],
    ],
    news: [
      {
        source: "CNBC",
        time: "2 ч назад",
        headline: "AWS объявила о новых регионах дата-центров в Юго-Восточной Азии",
      },
      {
        source: "MarketWatch",
        time: "7 ч назад",
        headline: "Amazon расширяет сеть доставки в день заказа ещё на 15 городов",
      },
    ],
  },
  GOOGL: {
    ticker: "GOOGL",
    name: "Alphabet Inc. · NASDAQ",
    price: "$167,28",
    dayChangePercent: -0.31,
    volumeLabel: "22,6M",
    metrics: [
      [
        { label: "Рыночная кап.", value: "2,07 трлн $" },
        { label: "P/E", value: "24,6" },
        { label: "EPS", value: "6,80 $" },
      ],
      [
        { label: "Диапазон дня", value: "165,80 – 168,40" },
        { label: "52 недели", value: "130,70 – 178,90" },
        { label: "Дивиденды", value: "0,45%" },
      ],
      [
        { label: "Бета", value: "1,04" },
        { label: "Объём (ср. 30д)", value: "26,9М" },
        { label: "Free float", value: "98,4%" },
      ],
    ],
    news: [
      {
        source: "Reuters",
        time: "4 ч назад",
        headline: "Google представил новую версию Gemini для корпоративных клиентов",
      },
      {
        source: "Bloomberg",
        time: "9 ч назад",
        headline: "Регуляторы ЕС продолжают расследование в отношении рекламных практик Alphabet",
      },
    ],
  },
};

// ---------- 14 Позиция / Детали (nxbsv) ----------

export interface PositionEntry {
  time: string;
  type: "ВХОД" | "ЧАСТ. ВЫХОД" | "ОТКРЫТА";
  price: string;
  qty: string;
  total: string;
  tone: "neutral" | "positive" | "info";
}

export interface PositionInfo {
  ticker: string;
  agentName: string;
  quantity: number;
  avgPrice: string;
  currentPrice: string;
  profit: string;
  profitPercent: number;
  portfolioSharePercent: number;
  openedDaysAgo: number;
  pnlSeries: number[]; // for the small area chart
  pnlStart: string;
  history: PositionEntry[];
}

export const positions: Record<string, PositionInfo> = {
  AAPL: {
    ticker: "AAPL",
    agentName: "Агрессивный агент",
    quantity: 80,
    avgPrice: "$180,45",
    currentPrice: "$192,45",
    profit: "+$1 140,00",
    profitPercent: 6.65,
    portfolioSharePercent: 12.2,
    openedDaysAgo: 3,
    pnlSeries: [-400, -180, 50, 500, 950, 1400, 1140],
    pnlStart: "+$1 140,00",
    history: [
      { time: "10:42", type: "ВХОД", price: "$178,20", qty: "40", total: "—", tone: "info" },
      { time: "11:15", type: "ВХОД", price: "$179,80", qty: "40", total: "—", tone: "info" },
      { time: "13:02", type: "ЧАСТ. ВЫХОД", price: "$186,40", qty: "-20", total: "+$328,00", tone: "positive" },
      { time: "14:30", type: "ВХОД", price: "$183,10", qty: "20", total: "—", tone: "info" },
      { time: "Сейчас", type: "ОТКРЫТА", price: "$192,45", qty: "80", total: "+$1 140,00", tone: "positive" },
    ],
  },
  MSFT: {
    ticker: "MSFT",
    agentName: "Ручной портфель",
    quantity: 40,
    avgPrice: "$418,90",
    currentPrice: "$428,76",
    profit: "+$394,40",
    profitPercent: 2.35,
    portfolioSharePercent: 4.5,
    openedDaysAgo: 12,
    pnlSeries: [-60, 40, 120, 260, 180, 320, 394],
    pnlStart: "+$394,40",
    history: [
      { time: "3 сент, 09:40", type: "ВХОД", price: "$418,90", qty: "40", total: "—", tone: "info" },
      { time: "Сейчас", type: "ОТКРЫТА", price: "$428,76", qty: "40", total: "+$394,40", tone: "positive" },
    ],
  },
};

// ---------- 15 Заявки / Открытые (w9UuM) ----------

export interface OpenOrderRow {
  instrument: string;
  type: string;
  side: "buy" | "sell";
  priceLabel: string;
  qtyLabel: string;
  filledLabel: string;
  status: "Ожидает" | "Частично" | "Исполнена";
}

export const openOrders: OpenOrderRow[] = [
  { instrument: "AAPL · Apple Inc.", type: "Лимит", side: "buy", priceLabel: "$188,50", qtyLabel: "40 акций", filledLabel: "0 из 40", status: "Ожидает" },
  { instrument: "TSLA · Tesla Inc.", type: "Рынок", side: "sell", priceLabel: "По рынку", qtyLabel: "15 акций", filledLabel: "0 из 15", status: "Ожидает" },
  { instrument: "NVDA · NVIDIA Corp.", type: "Лимит", side: "buy", priceLabel: "$118,20", qtyLabel: "60 акций", filledLabel: "25 из 60", status: "Частично" },
  { instrument: "MSFT · Microsoft Corp.", type: "Стоп-лимит", side: "sell", priceLabel: "$410,00", qtyLabel: "30 акций", filledLabel: "0 из 30", status: "Ожидает" },
  { instrument: "AMZN · Amazon.com", type: "Лимит", side: "buy", priceLabel: "$178,90", qtyLabel: "22 акции", filledLabel: "0 из 22", status: "Ожидает" },
];

export const openOrdersStats = {
  activeCount: 12,
  lockedFunds: "$18 420",
  limitVsMarket: "9 / 3",
  nextFillEta: "~2 мин",
};

// ---------- 17 История сделок (WPli3) ----------

export interface HistoryTradeRow {
  time: string;
  agent: string;
  side: "Покупка" | "Продажа";
  volumeLabel: string;
  price: string;
  total: string;
  status: "Исполнена";
}

export const tradeHistoryRows: HistoryTradeRow[] = [
  { time: "10:42", agent: "Агрессивный", side: "Покупка", volumeLabel: "12 AAPL", price: "$194,28", total: "$2 331,40", status: "Исполнена" },
  { time: "10:31", agent: "Осторожный", side: "Продажа", volumeLabel: "6 AAPL", price: "$193,91", total: "$1 163,46", status: "Исполнена" },
  { time: "10:24", agent: "Случайный", side: "Покупка", volumeLabel: "8 AAPL", price: "$194,02", total: "$1 552,16", status: "Исполнена" },
  { time: "10:18", agent: "Вручную", side: "Покупка", volumeLabel: "4 AAPL", price: "$193,74", total: "$774,96", status: "Исполнена" },
  { time: "10:06", agent: "Агрессивный", side: "Покупка", volumeLabel: "10 AAPL", price: "$193,65", total: "$1 936,50", status: "Исполнена" },
  { time: "09:54", agent: "Осторожный", side: "Продажа", volumeLabel: "3 AAPL", price: "$193,30", total: "$579,90", status: "Исполнена" },
];

export const tradeHistoryStats = {
  tradesToday: 27,
  tradesNote: "19 покупок · 8 продаж",
  turnover: "$18 442",
  turnoverNote: "Средний чек $683",
  filledPercent: "96,4%",
  filledNote: "1 заявка ожидает",
  commission: "$18,44",
  commissionNote: "За текущую сессию",
};

export const tradeInspector = {
  title: "Покупка 12 AAPL",
  outcome: "Исполнена по $194,28",
  note: "Агрессивный агент подтвердил импульс цены и объёма. Решение принято на шаге 62.",
  details: ["Комиссия · $2,33", "Цена лимита · $194,40", "Позиция после · 42 AAPL"],
};

// ---------- 19 Симуляция / Новая настройка (i1G5BB) + 20 Исторические данные (D62KAQ) ----------

export const simSetupDefaults = {
  startingCapital: "$100 000",
  currency: "USD",
  period: "01.01.2024 — 31.12.2024",
  commissionPercent: "0,10%",
  slippagePercent: "0,05%",
  instrument: "AAPL · Apple Inc.",
  strategy: "Агрессивный · импульсная",
};

export interface Dataset {
  instrument: string;
  period: string;
  candles: string;
  gapsPercent: string;
  gapsWarn: boolean;
  size: string;
  status: "Готово" | "Проверка";
}

export const simDatasets: Dataset[] = [
  { instrument: "AAPL · Apple Inc.", period: "01.2015 — 08.2026", candles: "612 480", gapsPercent: "0,02%", gapsWarn: false, size: "48 МБ", status: "Готово" },
  { instrument: "NVDA · NVIDIA Corp.", period: "01.2015 — 08.2026", candles: "612 480", gapsPercent: "0,00%", gapsWarn: false, size: "51 МБ", status: "Готово" },
  { instrument: "Пользовательский · custom_btc.csv", period: "03.2018 — 06.2026", candles: "288 900", gapsPercent: "1,40%", gapsWarn: true, size: "19 МБ", status: "Проверка" },
  { instrument: "TSLA · Tesla Inc.", period: "06.2018 — 08.2026", candles: "510 200", gapsPercent: "0,08%", gapsWarn: false, size: "41 МБ", status: "Готово" },
  { instrument: "MSFT · Microsoft Corp.", period: "01.2015 — 08.2026", candles: "612 480", gapsPercent: "0,01%", gapsWarn: false, size: "49 МБ", status: "Готово" },
];

export interface InstrumentSearchRow {
  letter: string;
  ticker: string;
  company: string;
  rangeLabel: string;
}

export const instrumentSearchRows: InstrumentSearchRow[] = [
  { letter: "A", ticker: "AAPL", company: "Apple Inc.", rangeLabel: "10 лет истории" },
  { letter: "N", ticker: "NVDA", company: "NVIDIA Corp.", rangeLabel: "10 лет истории" },
  { letter: "T", ticker: "TSLA", company: "Tesla Inc.", rangeLabel: "8 лет истории" },
  { letter: "B", ticker: "BTC/USD", company: "Bitcoin", rangeLabel: "6 лет истории" },
  { letter: "M", ticker: "MSFT", company: "Microsoft Corp.", rangeLabel: "10 лет истории" },
];

// ---------- 18 Симуляция в реальном времени (n3YpF) ----------

export const liveSimInfo = {
  sessionLabel: "СЕССИЯ · AAPL / 01 ИЮН — 15 СЕН",
  subtitle: "Рынок обновляется каждые 2 секунды. Агенты используют одни и те же данные.",
  currentDay: "62 / 100",
  daysLeft: "Осталось 38 шагов",
  price: "$194,28",
  priceStepNote: "+1,43% на шаге",
  totalCapital: "$117 820",
  totalCapitalNote: "+17,82% от старта",
  activeAgents: 3,
  activeAgentsNote: "2 ожидают сигнал",
  chartCaption: "Шаг 62 · последнее обновление 10:42:08",
  riskCurrent: 58,
  riskLimit: 60,
};

export interface LiveDecision {
  strategy: AgentStrategy;
  title: string;
  detail: string;
}

export const liveDecisions: LiveDecision[] = [
  { strategy: "aggressive", title: "Покупает 12 AAPL · 10:42", detail: "Рост +2,7% подтверждён объёмом" },
  { strategy: "careful", title: "Ожидает · 10:41", detail: "Сигнал роста ещё неустойчивый" },
  { strategy: "random", title: "Продаёт 8 AAPL · 10:40", detail: "Случайное действие · вероятность 34%" },
];

export const liveTimeline = [
  { color: "#00856F", time: "10:42", text: "Цена обновлена" },
  { color: "#E91BAC", time: "10:42", text: "3 сигнала" },
  { color: "#8251FB", time: "10:42", text: "1 заявка" },
  { color: "#E9D8E6", time: "10:44", text: "Следующий шаг" },
];

// ---------- 16 Симуляция / Результаты (LUlLE) ----------

export const simResults = {
  sessionLabel: "Сессия #248 · 24 янв 2026 · Агрессивный агент · 6 ч 42 мин",
  totalCapital: "$128 460,00",
  startCapital: "$100 000,00",
  cards: [
    { label: "Итоговая доходность", value: "+28,46%", sub: "$128 460,00", meaning: "Против стартового капитала", tone: "highlight" as const },
    { label: "Макс. просадка", value: "-4,12%", sub: "−$4 890", meaning: "14 фев, 11:20", tone: "default" as const },
    { label: "Всего сделок", value: "142", sub: "87 прибыльных", meaning: "Win rate 61,3%", tone: "default" as const },
  ],
  equitySeries: [100000, 101200, 99800, 104500, 108900, 112300, 109800, 116200, 121500, 118900, 124800, 128460],
  comparisonRows: [
    { instrument: "AAPL · Apple Inc.", ret: "+18,20%", drawdown: "−3,00%", trades: "64" },
    { instrument: "NVDA · NVIDIA Corp.", ret: "+9,40%", drawdown: "−0,95%", trades: "48" },
    { instrument: "TSLA · Tesla Inc.", ret: "+0,86%", drawdown: "−7,39%", trades: "30" },
  ],
  insightTitle: "Итог сессии",
  insightBody:
    "Агент удержал доходность выше рынка на протяжении всей сессии, наибольший вклад внёс AAPL (+18,20%).\n\nWin rate 61,3% при 142 сделках — на 6 п.п. выше средней по предыдущим 10 сессиям агента.",
  insightFootnote: "Полная история сделок доступна в журнале агента.",
};

// ---------- 21 Отчёт / Экспорт (Ve1lK) ----------

export const exportContentOptions = [
  { label: "Сводка результатов сессии", checked: true },
  { label: "График динамики капитала", checked: true },
  { label: "История всех сделок", checked: true },
  { label: "Разбивка по инструментам", checked: true },
  { label: "Метрики риска (Sharpe, просадка)", checked: true },
  { label: "Журнал решений агента", checked: false },
  { label: "Комментарии и заметки", checked: false },
];

export const exportPreview = {
  brand: "TRADR",
  date: "24 января 2026",
  title: "Отчёт по сессии #248",
  subtitle: "Агрессивный агент · 24 янв 2026 · 6 ч 42 мин",
  metrics: [
    { label: "Итоговый капитал", value: "$128 460" },
    { label: "Доходность", value: "+28,46%" },
    { label: "Сделок", value: "142" },
  ],
  pageLabel: "Страница 1 из 4",
};

// ---------- 17 Агенты / Сравнение (Y5Dd7) ----------

export interface CompareRow {
  metric: string;
  aggressive: string;
  careful: string;
  random: string;
}

export const compareRows: CompareRow[] = [
  { metric: "Доходность", aggressive: "+28,46%", careful: "+9,82%", random: "−3,26%" },
  { metric: "Макс. просадка", aggressive: "−7,40%", careful: "−2,10%", random: "−11,80%" },
  { metric: "Win rate", aggressive: "58,4%", careful: "64,1%", random: "49,2%" },
  { metric: "Sharpe ratio", aggressive: "1,84", careful: "1,32", random: "0,41" },
  { metric: "Всего сделок", aggressive: "142", careful: "76", random: "118" },
  { metric: "Ср. время удержания", aggressive: "2 ч 10 мин", careful: "6 ч 40 мин", random: "1 ч 05 мин" },
  { metric: "Комиссии", aggressive: "$412,80", careful: "$198,40", random: "$356,90" },
];

// ---------- 18 Агенты / Рейтинг (bCMn6) ----------

export interface RankRow {
  rank: number;
  name: string;
  strategyLabel: string;
  capital: string;
  returnPercent: string;
  returnPositive: boolean;
  winRate: string;
  trades: string;
  status: "active" | "paused";
  own: boolean;
}

export const rankRows: RankRow[] = [
  { rank: 1, name: "Агрессивный", strategyLabel: "AAPL · импульс", capital: "$128 460", returnPercent: "+28,46%", returnPositive: true, winRate: "58,4%", trades: "142", status: "active", own: true },
  { rank: 2, name: "Ночной скальпер", strategyLabel: "BTC · скальпинг", capital: "$121 090", returnPercent: "+21,09%", returnPositive: true, winRate: "61,0%", trades: "310", status: "active", own: false },
  { rank: 3, name: "Тренд-следящий", strategyLabel: "QQQ · тренд", capital: "$117 640", returnPercent: "+17,64%", returnPositive: true, winRate: "55,2%", trades: "88", status: "active", own: false },
  { rank: 4, name: "Осторожный", strategyLabel: "MSFT · консервативная", capital: "$109 820", returnPercent: "+9,82%", returnPositive: true, winRate: "64,1%", trades: "76", status: "active", own: true },
  { rank: 5, name: "Парный трейдер", strategyLabel: "AAPL/MSFT · пары", capital: "$104 310", returnPercent: "+4,31%", returnPositive: true, winRate: "52,8%", trades: "64", status: "paused", own: false },
  { rank: 6, name: "Случайный", strategyLabel: "TSLA · контрольная", capital: "$96 740", returnPercent: "−3,26%", returnPositive: false, winRate: "49,2%", trades: "118", status: "active", own: true },
];
