import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Безопасность · Настройки · TRADR" };

export default function SettingsSecurityPage() {
  return <SettingsScreen section="security" />;
}
