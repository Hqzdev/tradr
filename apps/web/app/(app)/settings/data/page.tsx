import type { Metadata } from "next";
import SettingsScreen from "@/components/screens/SettingsScreen";

export const metadata: Metadata = { title: "Данные · Настройки · TRADR" };

export default function SettingsDataPage() {
  return <SettingsScreen section="data" />;
}
