import type { Metadata } from "next";
import DevelopersPage from "@/components/marketing/DevelopersPage";

export const metadata: Metadata = { title: "Разработчикам — TRADR", description: "Документация, сценарии и инструменты разработки TRADR." };

export default function DevelopersRoute() { return <DevelopersPage />; }
