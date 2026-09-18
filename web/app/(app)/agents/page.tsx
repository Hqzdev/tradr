import type { Metadata } from "next";
import AgentsListScreen from "@/components/screens/AgentsListScreen";

export const metadata: Metadata = { title: "Агенты · TRADR" };

export default function AgentsPage() {
  return <AgentsListScreen />;
}
