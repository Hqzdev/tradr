import { redirect } from "next/navigation";

export default function AgentBudgetPage({ params }: { params: { id: string } }) {
  redirect(`/agents/${params.id}`);
}
