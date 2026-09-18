import type { Metadata } from "next";
import JournalScreen from "@/components/screens/JournalScreen";

export const metadata: Metadata = { title: "Общий журнал агентов · TRADR" };

export default function JournalPage() {
  return <JournalScreen />;
}
