import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Профиль · Настройки · TRADR" };

export default function SettingsPage() {
  return <SettingsScreen section="profile" />;
}
