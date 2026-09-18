import type { Metadata } from "next";
import TeamsListScreen from "@/components/screens/TeamsListScreen";

export const metadata: Metadata = { title: "Команды агентов · TRADR" };

export default function TeamsPage() {
  return <TeamsListScreen />;
}
