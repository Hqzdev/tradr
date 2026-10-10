import type { Metadata } from "next";
import ProAgentsScreen from "@/components/screens/ProAgentsScreen";

export const metadata: Metadata = { title: "Pro-агенты · TRADR" };

export default function ProAgentsPage() {
  return <ProAgentsScreen />;
}
