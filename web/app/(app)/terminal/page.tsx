import type { Metadata } from "next";
import TerminalScreen from "@/components/screens/TerminalScreen";

export const metadata: Metadata = { title: "Терминал · TRADR" };

export default function TerminalPage() {
  return <TerminalScreen />;
}
