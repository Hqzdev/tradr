"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getInstruments, type Instrument } from "@/lib/api/market";

export default function MarketScreen() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => { getInstruments().then(setInstruments).catch(() => setError(true)); }, []);
  if (error) return <EmptyState title="Не удалось загрузить рынок" description="Проверьте, что backend запущен, и обновите страницу." />;
  if (instruments.length === 0) return <p className="text-body-sm text-steel">Загружаем инструменты...</p>;

  return <div>
    <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Рынок / Котировки</p>
    <h1 className="mt-2 text-heading font-[485] text-ink">Рынок</h1>
    <p className="mt-1.5 text-body text-steel">Котировки поступают из подключённого рыночного движка.</p>
    <Card className="mt-6 p-6">
      <table className="w-full border-collapse text-left"><thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Биржа</th><th className="pb-2 font-[485]">Цена</th><th className="pb-2 font-[485]">Изменение</th><th className="pb-2 font-[485]">Объём</th></tr></thead>
      <tbody>{instruments.map((instrument) => <tr key={instrument.ticker} className="border-t border-bone text-body-sm"><td className="py-3"><Link href={`/market/${instrument.ticker}`} className="font-[485] text-ink hover:text-magenta-deep">{instrument.ticker}</Link><p className="text-caption text-steel">{instrument.name}</p></td><td className="py-3 text-steel">{instrument.exchange}</td><td className="py-3 tabular-nums text-ink">{money(instrument.price, instrument.currency)}</td><td className={instrument.changePercent >= 0 ? "py-3 tabular-nums text-positive" : "py-3 tabular-nums text-negative"}>{instrument.changePercent >= 0 ? "+" : ""}{instrument.changePercent.toFixed(2)}%</td><td className="py-3 tabular-nums text-steel">{new Intl.NumberFormat("ru-RU").format(instrument.volume)}</td></tr>)}</tbody></table>
    </Card>
  </div>;
}

function money(value: number, currency: string): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value); }
