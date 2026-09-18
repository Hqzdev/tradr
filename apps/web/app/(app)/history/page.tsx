import type { Metadata } from "next";
import TradeHistoryScreen from "@/components/screens/TradeHistoryScreen";

export const metadata: Metadata = { title: "История сделок · TRADR" };

export default function HistoryPage() {
  return <TradeHistoryScreen />;
}
