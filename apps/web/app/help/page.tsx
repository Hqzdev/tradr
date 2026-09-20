import type { Metadata } from "next";
import HelpPage from "@/components/marketing/HelpPage";

export const metadata: Metadata = { title: "Центр помощи — TRADR", description: "Ответы на вопросы об учебной платформе TRADR." };

export default function HelpRoute() { return <HelpPage />; }
