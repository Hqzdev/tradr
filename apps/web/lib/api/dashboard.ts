import { apiFetch } from "@/lib/api/client";
import type { ApiAgent } from "@/lib/api/agents";

export interface DashboardActivity {
  id: number;
  agentId: string;
  agentName: string;
  action: "buy" | "sell" | "wait";
  reason: string;
  timestamp: string;
}

export interface Dashboard {
  startingCapital: number;
  totalWealth: number;
  reserveCash: number;
  allocatedCapital: number;
  profit: number;
  profitPercent: number;
  goalValue: number;
  goalProgress: number;
  accelerationEnabled: boolean;
  agents: ApiAgent[];
  activity: DashboardActivity[];
}

export const getDashboard = () => apiFetch<Dashboard>("/dashboard");
export const updatePreferences = (input: { goalValue?: number; accelerationEnabled?: boolean }) =>
  apiFetch<Dashboard>("/account/preferences", { method: "PATCH", body: JSON.stringify(input) });
