import type { AgentStrategy } from "./types";

export interface AgentDetailInfo {
  id: string;
  riskLabel: "Высокий" | "Средний" | "Низкий";
  riskColor: string;
  createdLabel: string;
  description: string;
  profitAfterFees: number;
  decision: {
    action: "buy" | "sell" | "wait";
    label: string;
    price: string;
    reason: string;
    rules: { label: string; ok: boolean }[];
  };
  recentTrades: { time: string; action: "buy" | "sell"; qty: string; price: string; status: string; statusColor: string }[];
  allocation: { label: string; value: string; percent: number; color: string }[];
  capitalUsagePercent: number;
  drawdownAvgPercent: number;
  winRatePercent: number;
}

export const AGENT_CHART_COLOR: Record<AgentStrategy, string> = {
  aggressive: "#D85665",
  careful: "#00856F",
  random: "#8251FB",
};

export const AGENT_RISK_DOT: Record<AgentStrategy, string> = {
  aggressive: "#D85665",
  careful: "#00856F",
  random: "#8251FB",
};

export const agentActivity = [
  { time: "10:42", agent: "Агрессивный", text: "Купить · 18 AAPL · $192,45", color: "#00856F", dot: "#00856F" },
  { time: "10:38", agent: "Случайный", text: "Продать · 12 AAPL · $190,12", color: "#D85665", dot: "#D85665" },
  { time: "10:31", agent: "Осторожный", text: "Ждать · Цена выше лимита", color: "#77727D", dot: "#77727D" },
  { time: "10:24", agent: "Агрессивный", text: "Ждать · Недостаточный импульс", color: "#77727D", dot: "#77727D" },
];

export const agentDetails: Record<string, AgentDetailInfo> = {
  aggressive: {
    id: "aggressive",
    riskLabel: "Высокий",
    riskColor: "#D85665",
    createdLabel: "создан 12 сентября",
    description: "Импульсная стратегия · AAPL",
    profitAfterFees: 28460,
    decision: {
      action: "buy",
      label: "Купить 18 AAPL",
      price: "По лимиту $192,45",
      reason: "Цена выше средней за 20 дней на 2,8%, объём растёт второй интервал подряд.",
      rules: [
        { label: "Импульс цены", ok: true },
        { label: "Рост объёма", ok: true },
        { label: "Лимит риска", ok: true },
        { label: "Стоп-лосс", ok: false },
      ],
    },
    recentTrades: [
      { time: "10:42", action: "buy", qty: "18 AAPL", price: "$192,45", status: "Открыта", statusColor: "#8B8091" },
      { time: "09:58", action: "sell", qty: "24 AAPL", price: "$190,12", status: "+$84,20", statusColor: "#00856F" },
      { time: "09:21", action: "buy", qty: "24 AAPL", price: "$186,61", status: "Закрыта", statusColor: "#8B8091" },
    ],
    allocation: [
      { label: "AAPL", value: "$80 281 · 62,5%", percent: 62.5, color: "#E35AAE" },
      { label: "Деньги", value: "$48 179 · 37,5%", percent: 37.5, color: "#8B8091" },
    ],
    capitalUsagePercent: 72,
    drawdownAvgPercent: 5.14,
    winRatePercent: 61,
  },
  careful: {
    id: "careful",
    riskLabel: "Низкий",
    riskColor: "#00856F",
    createdLabel: "создан 12 сентября",
    description: "Контроль риска · AAPL",
    profitAfterFees: 9820,
    decision: {
      action: "wait",
      label: "Ждать сигнал",
      price: "Цена ниже подтверждённого уровня",
      reason: "Отклонение от средней всего 0,6% — недостаточно для входа по правилам агента.",
      rules: [
        { label: "Импульс цены", ok: false },
        { label: "Рост объёма", ok: true },
        { label: "Лимит риска", ok: true },
        { label: "Стоп-лосс", ok: true },
      ],
    },
    recentTrades: [
      { time: "09:15", action: "sell", qty: "10 AAPL", price: "$188,90", status: "+$41,00", statusColor: "#00856F" },
      { time: "08:52", action: "buy", qty: "10 AAPL", price: "$184,80", status: "Закрыта", statusColor: "#8B8091" },
      { time: "Вчера", action: "buy", qty: "14 AAPL", price: "$182,05", status: "Закрыта", statusColor: "#8B8091" },
    ],
    allocation: [
      { label: "AAPL", value: "$38 437 · 35,0%", percent: 35, color: "#E35AAE" },
      { label: "Деньги", value: "$71 383 · 65,0%", percent: 65, color: "#8B8091" },
    ],
    capitalUsagePercent: 35,
    drawdownAvgPercent: 0.95,
    winRatePercent: 74,
  },
  random: {
    id: "random",
    riskLabel: "Средний",
    riskColor: "#8251FB",
    createdLabel: "создан 12 сентября",
    description: "Случайные сделки · AAPL",
    profitAfterFees: -3260,
    decision: {
      action: "sell",
      label: "Продать 9 AAPL",
      price: "По рынку $192,30",
      reason: "Случайный выбор действия для контрольной группы, объём — 25% свободного капитала.",
      rules: [
        { label: "Импульс цены", ok: false },
        { label: "Рост объёма", ok: false },
        { label: "Лимит риска", ok: true },
        { label: "Стоп-лосс", ok: true },
      ],
    },
    recentTrades: [
      { time: "10:38", action: "sell", qty: "12 AAPL", price: "$190,12", status: "−$18,60", statusColor: "#D85665" },
      { time: "09:47", action: "buy", qty: "16 AAPL", price: "$191,40", status: "Закрыта", statusColor: "#8B8091" },
      { time: "09:02", action: "sell", qty: "8 AAPL", price: "$189,75", status: "−$9,80", statusColor: "#D85665" },
    ],
    allocation: [
      { label: "AAPL", value: "$27 087 · 28,0%", percent: 28, color: "#E35AAE" },
      { label: "Деньги", value: "$69 653 · 72,0%", percent: 72, color: "#8B8091" },
    ],
    capitalUsagePercent: 28,
    drawdownAvgPercent: 7.39,
    winRatePercent: 44,
  },
};

export function buildAgentCapitalSeries(finalValue: number, points = 30) {
  const start = finalValue > 100000 ? finalValue * 0.78 : finalValue - (finalValue - 100000) * 1.15;
  const series: { day: number; agent: number; nasdaq: number }[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const wobble = Math.sin(i / 3.4) * (finalValue * 0.012);
    const agentVal = start + (finalValue - start) * t + wobble;
    const nasdaqVal = start + (finalValue - start) * t * 0.45 + Math.sin(i / 4.1 + 1) * (finalValue * 0.006);
    series.push({ day: i, agent: agentVal, nasdaq: nasdaqVal });
  }
  series[series.length - 1].agent = finalValue;
  return series;
}
