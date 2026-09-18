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

export function getInstruments(): Promise<Instrument[]> {
  return apiFetch<Instrument[]>("/instruments");
}
