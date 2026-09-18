import { redirect } from "next/navigation";

export default function AgentSkillsPage({ params }: { params: { id: string } }) {
  redirect(`/agents/${params.id}`);
}
