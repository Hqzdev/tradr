import { apiFetch } from "@/lib/api/client";

export type AgentStatus = "active" | "paused" | "error";

export interface ApiAgent {
  id: string;
  name: string;
  strategy: string;
  status: AgentStatus;
  riskLevel: string | null;
  createdAt: string;
}

export interface CreateAgentInput {
  name: string;
  strategy: string;
  riskLevel: string;
  character: string;
  budget: string;
  skills: string;
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
  return apiFetch<ApiAgent>(`/agents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
