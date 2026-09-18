import type { Metadata } from "next";
import ReportExportScreen from "@/components/screens/ReportExportScreen";

export const metadata: Metadata = { title: "Экспорт отчёта · TRADR" };

export default function ReportExportPage() {
  return <ReportExportScreen />;
}
