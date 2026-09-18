import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgentDetailScreen from "@/components/screens/AgentDetailScreen";
import { agents } from "@/lib/fixtures";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = agents.find((a) => a.id === params.id);
  return { title: agent ? `${agent.name} · Агенты · TRADR` : "Агент · TRADR" };
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  return <AgentDetailScreen agentId={params.id} />;
}
