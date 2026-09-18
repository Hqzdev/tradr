import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TeamDetailScreen from "@/components/screens/TeamDetailScreen";
import { teams } from "@/lib/psychologyData";

export function generateStaticParams() {
  return teams.map((t) => ({ teamId: t.id }));
}

export function generateMetadata({ params }: { params: { teamId: string } }): Metadata {
  const team = teams.find((t) => t.id === params.teamId);
  return { title: team ? `Команда ${team.name} · TRADR` : "Команда · TRADR" };
}

export default function TeamDetailPage({ params }: { params: { teamId: string } }) {
  const team = teams.find((t) => t.id === params.teamId);
  if (!team) notFound();
  return <TeamDetailScreen teamId={params.teamId} />;
}
