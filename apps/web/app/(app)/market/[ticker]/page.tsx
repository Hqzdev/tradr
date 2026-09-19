import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StockDetailScreen from "@/components/screens/StockDetailScreen";
import { getStockProfile } from "@/lib/stocks";

export function generateMetadata({ params }: { params: { ticker: string } }): Metadata {
  const stock = getStockProfile(params.ticker);
  return { title: stock ? `${stock.ticker} · ${stock.name} · TRADR` : "Акция не найдена · TRADR" };
}

export default function MarketInstrumentPage({ params }: { params: { ticker: string } }) {
  const stock = getStockProfile(params.ticker);
  if (!stock) notFound();
  return <StockDetailScreen profile={stock} />;
}
