"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { getTradeStats, getTrades, type Trade, type TradeStats } from "@/lib/api/trading";

export default function TradeHistoryScreen() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => { Promise.all([getTrades(), getTradeStats()]).then(([tradeRows, tradeStats]) => { setTrades(tradeRows); setStats(tradeStats); }).catch(() => setError(true)); }, []);
  if (error) return <EmptyState title="Не удалось загрузить историю" description="Проверьте подключение к backend и обновите страницу." />;

  return <div>
    <PageHeader eyebrow="Журнал операций" title="История сделок" lead="Здесь будут только исполненные реальные заявки." action={<Link href="/terminal"><Button variant="primary">Новая заявка</Button></Link>} />
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"><ValueCard label="Сделок сегодня" value={stats ? String(stats.tradesToday) : "..."} /><ValueCard label="Оборот" value={stats ? money(stats.turnover) : "..."} /><ValueCard label="Комиссия" value={stats ? money(stats.commission) : "..."} /></div>
    <Card className="mt-6 p-6">{trades.length === 0 ? <EmptyState title="Сделок пока нет" description="После исполнения заявки она появится в этой истории." /> : <table className="w-full border-collapse text-left"><thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Время</th><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Действие</th><th className="pb-2 font-[485]">Количество</th><th className="pb-2 font-[485]">Цена</th><th className="pb-2 font-[485]">Сумма</th></tr></thead><tbody>{trades.map((trade) => <tr key={trade.id} className="border-t border-bone text-body-sm"><td className="py-3 text-steel">{dateTime(trade.executedAt)}</td><td className="py-3 font-[485] text-ink">{trade.ticker}</td><td className={trade.side === "BUY" ? "py-3 text-positive" : "py-3 text-negative"}>{trade.side === "BUY" ? "Покупка" : "Продажа"}</td><td className="py-3 tabular-nums text-ink">{trade.quantity}</td><td className="py-3 tabular-nums text-ink">{money(trade.price)}</td><td className="py-3 tabular-nums text-ink">{money(trade.total)}</td></tr>)}</tbody></table>}</Card>
  </div>;
}

function ValueCard({ label, value }: { label: string; value: string }) { return <Card className="p-4"><p className="text-caption text-steel">{label}</p><p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{value}</p></Card>; }
function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function dateTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }
