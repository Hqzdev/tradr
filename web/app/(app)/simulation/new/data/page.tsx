import type { Metadata } from "next";
import SimDataScreen from "@/components/screens/SimDataScreen";

export const metadata: Metadata = { title: "Исторические данные · TRADR" };

export default function SimDataPage() {
  return <SimDataScreen />;
}
