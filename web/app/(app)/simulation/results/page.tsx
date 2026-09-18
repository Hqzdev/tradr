import type { Metadata } from "next";
import SimResultsScreen from "@/components/screens/SimResultsScreen";

export const metadata: Metadata = { title: "Результаты симуляции · TRADR" };

export default function SimResultsPage() {
  return <SimResultsScreen />;
}
