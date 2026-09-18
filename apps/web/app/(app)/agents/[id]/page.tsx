import AgentDetailScreen from "@/components/screens/AgentDetailScreen";

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return <AgentDetailScreen agentId={params.id} />;
}
