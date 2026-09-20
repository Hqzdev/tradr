import type { Metadata } from "next";
import PrivacyPage from "@/components/marketing/PrivacyPage";

export const metadata: Metadata = { title: "Конфиденциальность — TRADR", description: "Политика обработки данных учебной платформы TRADR." };

export default function PrivacyRoute() { return <PrivacyPage />; }
