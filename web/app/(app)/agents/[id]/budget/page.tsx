import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgentBudgetScreen from "@/components/screens/AgentBudgetScreen";
import { agents } from "@/lib/fixtures";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = agents.find((a) => a.id === params.id);
  return { title: agent ? `Бюджет · ${agent.name} · TRADR` : "Бюджет агента · TRADR" };
}

export default function AgentBudgetPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  return <AgentBudgetScreen agentId={params.id} />;
}
