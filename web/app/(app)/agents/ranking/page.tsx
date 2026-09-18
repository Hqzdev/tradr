import type { Metadata } from "next";
import AgentsRankingScreen from "@/components/screens/AgentsRankingScreen";

export const metadata: Metadata = { title: "Рейтинг агентов · TRADR" };

export default function AgentsRankingPage() {
  return <AgentsRankingScreen />;
}
