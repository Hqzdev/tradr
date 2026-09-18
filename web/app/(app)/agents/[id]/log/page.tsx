import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgentLogScreen from "@/components/screens/AgentLogScreen";
import { agents } from "@/lib/fixtures";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = agents.find((a) => a.id === params.id);
  return { title: agent ? `Лог сессии · ${agent.name} · TRADR` : "Лог агента · TRADR" };
}

export default function AgentLogPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  return <AgentLogScreen agentId={params.id} />;
}
