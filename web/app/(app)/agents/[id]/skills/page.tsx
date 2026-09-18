import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgentSkillsScreen from "@/components/screens/AgentSkillsScreen";
import { agents } from "@/lib/fixtures";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = agents.find((a) => a.id === params.id);
  return { title: agent ? `Навыки · ${agent.name} · TRADR` : "Навыки агента · TRADR" };
}

export default function AgentSkillsPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  return <AgentSkillsScreen agentId={params.id} />;
}
