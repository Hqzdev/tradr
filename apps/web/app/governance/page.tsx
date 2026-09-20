import type { Metadata } from "next";
import GovernancePage from "@/components/marketing/GovernancePage";

export const metadata: Metadata = { title: "Управление — TRADR", description: "Открытый процесс развития учебной платформы TRADR." };

export default function GovernanceRoute() { return <GovernancePage />; }
