import { apiFetch } from "@/lib/api/client";

export interface Instrument {
  ticker: string;
  name: string;
  exchange: string;
  type: string;
  currency: string;
  price: number;
  changePercent: number;
  volume: number;
  updatedAt: string;
}

export interface InstrumentMetric {
  label: string;
  value: string;
}

export interface InstrumentNewsItem {
  source: string;
  time: string;
  headline: string;
}

export interface InstrumentDetails {
  instrument: Instrument;
  metrics: InstrumentMetric[];
  news: InstrumentNewsItem[];
}

export interface MarketCandle {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type MarketTimeframe = "1m" | "5m" | "15m" | "1h" | "1d";

export function getInstruments(): Promise<Instrument[]> {
  return apiFetch<Instrument[]>("/instruments");
}

export function getInstrumentDetails(ticker: string): Promise<InstrumentDetails> {
  return apiFetch<InstrumentDetails>(`/instruments/${encodeURIComponent(ticker)}`);
}

export function getCandles(ticker: string, timeframe: MarketTimeframe, limit = 120): Promise<MarketCandle[]> {
  return apiFetch<MarketCandle[]>(`/instruments/${encodeURIComponent(ticker)}/candles?timeframe=${timeframe}&limit=${limit}`);
}
