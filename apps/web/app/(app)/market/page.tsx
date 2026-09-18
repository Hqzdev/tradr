import type { Metadata } from "next";
import MarketScreen from "@/components/screens/MarketScreen";

export const metadata: Metadata = { title: "Рынок · TRADR" };

export default function MarketPage() {
  return <MarketScreen />;
}
