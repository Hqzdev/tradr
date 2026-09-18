import type { Metadata } from "next";
import SimLiveScreen from "@/components/screens/SimLiveScreen";

export const metadata: Metadata = { title: "Симуляция в реальном времени · TRADR" };

export default function SimLivePage() {
  return <SimLiveScreen />;
}
