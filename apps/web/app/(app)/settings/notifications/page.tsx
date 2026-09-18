import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Уведомления · Настройки · TRADR" };

export default function SettingsNotificationsPage() {
  return <SettingsScreen section="notifications" />;
}
