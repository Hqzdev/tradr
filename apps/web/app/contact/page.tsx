import type { Metadata } from "next";
import ContactPage from "@/components/marketing/ContactPage";

export const metadata: Metadata = { title: "Связаться с нами — TRADR", description: "Форма связи с командой учебной платформы TRADR." };

export default function ContactRoute() { return <ContactPage />; }
