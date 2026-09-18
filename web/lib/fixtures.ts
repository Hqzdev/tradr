import type {
  Agent,
  Asset,
  Candle,
  EquityPoint,
  Holding,
  IndexQuote,
  OrderRow,
} from "./types";

export const indices: IndexQuote[] = [
  { name: "S&P 500", value: "5 782,76", changePercent: 0.64 },
  { name: "NASDAQ", value: "18 271,32", changePercent: 1.12 },
  { name: "DOW JONES", value: "42 628,18", changePercent: -0.18 },
];

export const assets: Asset[] = [
  { ticker: "AAPL", name: "Apple Inc.", price: 192.45, changePercent: 1.84, volumeLabel: "$8,4 млрд" },
  { ticker: "NVDA", name: "NVIDIA", price: 138.72, changePercent: 2.1, volumeLabel: "$19,2 млрд" },
  { ticker: "TSLA", name: "Tesla", price: 247.18, changePercent: -0.62, volumeLabel: "$11,6 млрд" },
  { ticker: "MSFT", name: "Microsoft", price: 428.76, changePercent: 0.48, volumeLabel: "$5,1 млрд" },
  { ticker: "AMZN", name: "Amazon", price: 186.42, changePercent: 1.06, volumeLabel: "$4,8 млрд" },
  { ticker: "GOOGL", name: "Alphabet", price: 167.28, changePercent: -0.31, volumeLabel: "$3,2 млрд" },
];

export const agents: Agent[] = [
  {
    id: "aggressive",
    name: "Агрессивный",
    strategy: "aggressive",
    subtitle: "AAPL · импульсная стратегия",
    capital: 128460,
    pnlPercent: 28.46,
    lastAction: "Покупка 18 AAPL",
    status: "active",
    trades: 68,
    maxDrawdownPercent: -3.0,
  },
  {
    id: "careful",
    name: "Осторожный",
    strategy: "careful",
    subtitle: "AAPL · контроль риска",
    capital: 109820,
    pnlPercent: 9.82,
    lastAction: "Ожидает сигнал",
    status: "active",
    trades: 24,
    maxDrawdownPercent: -0.95,
  },
  {
    id: "random",
    name: "Случайный",
    strategy: "random",
    subtitle: "AAPL · случайные сделки",
    capital: 96740,
    pnlPercent: -3.26,
    lastAction: "Продажа 12 AAPL",
    status: "active",
    trades: 91,
    maxDrawdownPercent: -7.39,
  },
];

export const totalCapital = 377830.5;
export const freeCash = 10264.1;

export const manualHoldings: Holding[] = [
  { ticker: "AAPL", quantity: 80, value: 15396.0 },
  { ticker: "MSFT", quantity: 40, value: 17150.4 },
];
export const manualPortfolioValue = 42810.5;
export const manualPortfolioReturnPercent = 4.42;

export const orderRows: OrderRow[] = [
  { time: "10:42", source: "Агрессивный", action: "buy", quantity: 18, price: 192.45, amount: 3464.1 },
  { time: "10:38", source: "Случайный", action: "sell", quantity: 12, price: 190.12, amount: 2281.44 },
  { time: "10:31", source: "Вы · вручную", action: "buy", quantity: 80, price: 185.2, amount: 14816.0 },
];

// Deterministic 5-minute candles for AAPL, 08:45 -> 10:40 (24 bars).
// Small, tight-range deltas so the session stays coherent with the
// $192.45 quote shown everywhere else in the demo.
function buildCandles(): Candle[] {
  const start = 8 * 60 + 45;
  const targetClose = 192.45;
  const deltas = [
    0.08, 0.06, -0.03, 0.09, 0.05, -0.04, 0.1, 0.06, -0.02, 0.08, 0.04, -0.03,
    0.07, 0.05, -0.04, 0.07, 0.04, -0.05, 0.11, 0.04, -0.07, 0.06, -0.08, 0.08,
  ];
  const sum = deltas.reduce((a, b) => a + b, 0);
  const base = targetClose - sum;

  let price = base;
  const candles: Candle[] = [];
  for (let i = 0; i < deltas.length; i++) {
    const open = price;
    const close = open + deltas[i];
    const high = Math.max(open, close) + Math.abs(deltas[i]) * 0.35 + 0.03;
    const low = Math.min(open, close) - Math.abs(deltas[i]) * 0.3 - 0.02;
    const minutes = start + i * 5;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    candles.push({
      time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: 30000 + ((i * 8237) % 62000),
    });
    price = close;
  }
  // Force the exact closing tick so every screen agrees on $192.45.
  candles[candles.length - 1].close = targetClose;
  candles[candles.length - 1].high = Math.max(
    candles[candles.length - 1].high,
    targetClose
  );
  return candles;
}

export const candles = buildCandles();
export const lastPrice = candles[candles.length - 1].close; // 192.45
export const dayOpen = candles[0].open;
export const dayHigh = Math.max(...candles.map((c) => c.high));
export const dayLow = Math.min(...candles.map((c) => c.low));
export const dayVolumeLabel = "1,24 млн";

export const timeframes = ["1м", "5м", "15м", "1ч", "1д"] as const;

// Deterministic 100-day equity curves for the three agents, starting at 100 000
function buildEquity(): EquityPoint[] {
  const points: EquityPoint[] = [];
  let a = 100000;
  let c = 100000;
  let r = 100000;
  for (let day = 0; day <= 100; day++) {
    const wobbleA = Math.sin(day / 5.2) * 900 + Math.sin(day / 1.7) * 300;
    const wobbleC = Math.sin(day / 8.4 + 1.1) * 260;
    const wobbleR = Math.sin(day / 3.1 + 2.4) * 700 + Math.cos(day / 6.6) * 420;
    const targetA = 100000 + (128460 - 100000) * (day / 100);
    const targetC = 100000 + (109820 - 100000) * (day / 100);
    const targetR = 100000 + (96740 - 100000) * (day / 100);
    a = targetA + wobbleA;
    c = targetC + wobbleC;
    r = targetR + wobbleR;
    points.push({ day, aggressive: a, careful: c, random: r });
  }
  // Force exact endpoints to match headline figures
  points[points.length - 1] = { day: 100, aggressive: 128460, careful: 109820, random: 96740 };
  points[0] = { day: 0, aggressive: 100000, careful: 100000, random: 100000 };
  return points;
}

export const equityCurve = buildEquity();

export const numberFmt = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatMoney(value: number, withCents = false): string {
  const fmt = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });
  return `$${fmt.format(value)}`;
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  const abs = Math.abs(value);
  const fmt = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${fmt.format(abs)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}
