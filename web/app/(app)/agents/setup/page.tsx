import type { Metadata } from "next";
import AgentSetupTypeScreen from "@/components/screens/AgentSetupTypeScreen";

export const metadata: Metadata = { title: "Новый агент · Тип и характер · TRADR" };

export default function AgentSetupPage() {
  return <AgentSetupTypeScreen />;
}
