import { apiFetch } from "@/lib/api/client";

export type AgentStatus = "active" | "paused" | "error";

export interface ApiAgent {
  id: string;
  name: string;
  strategy: string;
  status: AgentStatus;
  riskLevel: string | null;
  triggerPercent: number;
  budgetLimit: number;
  cashBalance: number;
  holdingsValue: number;
  totalValue: number;
  profit: number;
  positionCount: number;
  createdAt: string;
}

export interface CreateAgentInput {
  name: string;
  strategy: string;
  budgetLimit?: number;
}

export function listAgents(): Promise<ApiAgent[]> {
  return apiFetch<ApiAgent[]>("/agents");
}

export function createAgent(input: CreateAgentInput): Promise<ApiAgent> {
  return apiFetch<ApiAgent>("/agents", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getAgent(id: string): Promise<ApiAgent> {
  return apiFetch<ApiAgent>(`/agents/${id}`);
}

export function updateAgentStatus(id: string, status: "active" | "paused"): Promise<ApiAgent> {
  return apiFetch<ApiAgent>(`/agents/${id}/${status === "active" ? "start" : "pause"}`, { method: "POST" });
}

export interface AgentHolding { ticker: string; name: string; quantity: number; averagePrice: number; currentPrice: number; marketValue: number; profit: number; profitPercent: number; }
export interface AgentDecision { id: number; agentId: string; action: "buy" | "sell" | "wait"; reason: string; timestamp: string; }
export interface AgentPerformance { agentId: string; initialCapital: number; cashBalance: number; holdingsValue: number; totalValue: number; profit: number; profitPercent: number; positions: AgentHolding[]; equityCurve: { totalValue: number; capturedAt: string }[]; }
export const getAgentPerformance = (id: string) => apiFetch<AgentPerformance>(`/agents/${id}/performance`);
export const getAgentLog = (id: string, limit = 50) => apiFetch<AgentDecision[]>(`/agents/${id}/log?limit=${limit}`);
export const closeAgent = (id: string) => apiFetch<void>(`/agents/${id}/close`, { method: "POST" });
export const updateAgentAllocation = (id: string, budgetLimit: number) => apiFetch<ApiAgent>(`/agents/${id}/allocation`, { method: "PATCH", body: JSON.stringify({ budgetLimit }) });
