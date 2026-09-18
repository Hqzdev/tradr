import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StockCardScreen from "@/components/screens/StockCardScreen";
import { stockCards } from "@/lib/tradingExtra";

export function generateStaticParams() {
  return Object.keys(stockCards).map((ticker) => ({ ticker }));
}

export function generateMetadata({ params }: { params: { ticker: string } }): Metadata {
  const stock = stockCards[params.ticker];
  return { title: stock ? `${stock.ticker} · Рынок · TRADR` : "Рынок · TRADR" };
}

export default function StockCardPage({ params }: { params: { ticker: string } }) {
  if (!stockCards[params.ticker]) notFound();
  return <StockCardScreen ticker={params.ticker} />;
}
