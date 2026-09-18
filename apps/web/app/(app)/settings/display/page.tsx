import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Отображение · Настройки · TRADR" };

export default function SettingsDisplayPage() {
  return <SettingsScreen section="display" />;
}
