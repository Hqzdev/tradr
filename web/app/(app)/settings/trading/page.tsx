import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Торговля · Настройки · TRADR" };

export default function SettingsTradingPage() {
  return <SettingsScreen section="trading" />;
}
