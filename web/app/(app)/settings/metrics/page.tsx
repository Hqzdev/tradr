import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Метрики · Настройки · TRADR" };

export default function SettingsMetricsPage() {
  return <SettingsScreen section="metrics" />;
}
