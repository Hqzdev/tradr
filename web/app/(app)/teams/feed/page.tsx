import type { Metadata } from "next";
import TeamsFeedScreen from "@/components/screens/TeamsFeedScreen";

export const metadata: Metadata = { title: "Лента взаимодействий · TRADR" };

export default function TeamsFeedPage() {
  return <TeamsFeedScreen />;
}
