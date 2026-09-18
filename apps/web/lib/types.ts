export type AgentStrategy = "aggressive" | "careful" | "random";
export type AgentStatus = "active" | "paused" | "error";

export interface Agent {
  id: string;
  name: string;
  strategy: AgentStrategy;
  subtitle: string;
  capital: number;
  pnlPercent: number;
  lastAction: string;
  status: AgentStatus;
  trades: number;
  maxDrawdownPercent: number;
}

export interface Asset {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  volumeLabel: string;
}

export interface OrderRow {
  time: string;
  source: string;
  action: "buy" | "sell";
  quantity: number;
  price: number;
  amount: number;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndexQuote {
  name: string;
  value: string;
  changePercent: number;
}

export interface EquityPoint {
  day: number;
  aggressive: number;
  careful: number;
  random: number;
}

export interface Holding {
  ticker: string;
  quantity: number;
  value: number;
}

export interface ChangelogEntry {
  version: string;
  label: string;
  date: string;
  changes: string[];
}
