import type { Metadata } from "next";
import PositionDetailScreen from "@/components/screens/PositionDetailScreen";

export const metadata: Metadata = { title: "AAPL · Портфель · TRADR" };

export default function PositionDetailPage() {
  return <PositionDetailScreen />;
}
