import type { Metadata } from "next";
import CareersPage from "@/components/marketing/CareersPage";

export const metadata: Metadata = { title: "Карьера — TRADR", description: "Работа в команде учебной торговой платформы TRADR." };

export default function CareersRoute() { return <CareersPage />; }
