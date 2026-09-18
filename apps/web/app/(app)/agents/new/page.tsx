import type { Metadata } from "next";
import CreateAgentScreen from "@/components/screens/CreateAgentScreen";

export const metadata: Metadata = { title: "Новый агент · TRADR" };

export default function CreateAgentPage() {
  return <CreateAgentScreen />;
}
