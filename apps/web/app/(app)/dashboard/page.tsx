import type { Metadata } from "next";
import DashboardScreen from "@/components/screens/DashboardScreen";

export const metadata: Metadata = { title: "Обзор · TRADR" };
export default function DashboardPage() { return <DashboardScreen />; }
