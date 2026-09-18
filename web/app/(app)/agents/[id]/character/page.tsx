import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AgentCharacterScreen from "@/components/screens/AgentCharacterScreen";
import { agents } from "@/lib/fixtures";

export function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const agent = agents.find((a) => a.id === params.id);
  return { title: agent ? `Характер · ${agent.name} · TRADR` : "Характер агента · TRADR" };
}

export default function AgentCharacterPage({ params }: { params: { id: string } }) {
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) notFound();
  return <AgentCharacterScreen agentId={params.id} />;
}
