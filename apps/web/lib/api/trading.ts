import { apiFetch } from "@/lib/api/client";

export interface Holding {
  ticker: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  marketValue: number;
  profit: number;
  profitPercent: number;
  portfolioSharePercent: number;
}

export interface Portfolio {
  cashBalance: number;
  holdingsValue: number;
  totalValue: number;
  holdings: Holding[];
}

export interface Order {
  id: string;
  ticker: string;
  side: string;
  orderType: string;
  quantity: number;
  limitPrice: number | null;
  status: string;
  source: string;
  createdAt: string;
  filledAt: string | null;
}

export interface Trade {
  id: string;
  ticker: string;
  side: string;
  quantity: number;
  price: number;
  gross: number;
  commission: number;
  total: number;
  executedAt: string;
}

export interface TradeStats {
  tradesToday: number;
  buyCount: number;
  sellCount: number;
  turnover: number;
  commission: number;
  openOrders: number;
}

export function getPortfolio(): Promise<Portfolio> {
  return apiFetch<Portfolio>("/portfolio");
}

export function getOrders(status?: string): Promise<Order[]> {
  return apiFetch<Order[]>(status ? `/orders?status=${encodeURIComponent(status)}` : "/orders");
}

export function cancelOrder(id: string): Promise<void> {
  return apiFetch<void>(`/orders/${id}`, { method: "DELETE" });
}

export function getTrades(): Promise<Trade[]> {
  return apiFetch<Trade[]>("/trades");
}

export function getTradeStats(): Promise<TradeStats> {
  return apiFetch<TradeStats>("/trades/stats");
}
