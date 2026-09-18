import { redirect } from "next/navigation";

export default function AgentCharacterPage({ params }: { params: { id: string } }) {
  redirect(`/agents/${params.id}`);
}
