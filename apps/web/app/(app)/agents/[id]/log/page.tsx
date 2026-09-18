import { redirect } from "next/navigation";

export default function AgentLogPage({ params }: { params: { id: string } }) {
  redirect(`/agents/${params.id}`);
}
