import type { Metadata } from "next";
import PortfolioScreen from "@/components/screens/PortfolioScreen";

export const metadata: Metadata = { title: "Портфель · TRADR" };

export default function PortfolioPage() {
  return <PortfolioScreen />;
}
