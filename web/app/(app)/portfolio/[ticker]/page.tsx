import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PositionDetailScreen from "@/components/screens/PositionDetailScreen";
import { positions } from "@/lib/tradingExtra";

export function generateStaticParams() {
  return Object.keys(positions).map((ticker) => ({ ticker }));
}

export function generateMetadata({ params }: { params: { ticker: string } }): Metadata {
  const pos = positions[params.ticker];
  return { title: pos ? `${pos.ticker} · Портфель · TRADR` : "Портфель · TRADR" };
}

export default function PositionDetailPage({ params }: { params: { ticker: string } }) {
  if (!positions[params.ticker]) notFound();
  return <PositionDetailScreen ticker={params.ticker} />;
}
