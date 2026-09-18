import type { Metadata } from "next";
import AgentsCompareScreen from "@/components/screens/AgentsCompareScreen";

export const metadata: Metadata = { title: "Сравнение агентов · TRADR" };

export default function AgentsComparePage() {
  return <AgentsCompareScreen />;
}
