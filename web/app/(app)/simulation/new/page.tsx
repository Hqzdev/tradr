import type { Metadata } from "next";
import SimSetupScreen from "@/components/screens/SimSetupScreen";

export const metadata: Metadata = { title: "Настройка симуляции · TRADR" };

export default function SimSetupPage() {
  return <SimSetupScreen />;
}
