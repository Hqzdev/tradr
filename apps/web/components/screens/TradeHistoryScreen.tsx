"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { getTradeStats, getTrades, type Trade, type TradeStats } from "@/lib/api/trading";
import { getDashboard, type DashboardActivity } from "@/lib/api/dashboard";

export default function TradeHistoryScreen() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => { Promise.all([getTrades(), getTradeStats(), getDashboard()]).then(([tradeRows, tradeStats, dashboard]) => { setTrades(tradeRows); setStats(tradeStats); setActivity(dashboard.activity); }).catch(() => setError(true)); }, []);
  if (error) return <EmptyState title="Не удалось загрузить историю" description="Проверьте подключение к backend и обновите страницу." />;

  return <div>
    <PageHeader eyebrow="Активность агентов" title="История сделок" lead="Покупки и продажи выполняют только ваши агенты. Здесь можно наблюдать их результат." />
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"><ValueCard label="Сделок сегодня" value={stats ? String(stats.tradesToday) : "..."} /><ValueCard label="Оборот" value={stats ? money(stats.turnover) : "..."} /><ValueCard label="Комиссия" value={stats ? money(stats.commission) : "..."} /></div>
    <Card className="mt-6 p-6"><p className="text-subheading font-[485] text-ink">Решения агентов</p>{activity.length === 0 ? <EmptyState compact className="mt-4" title="Решений пока нет" description="После запуска здесь появятся анализ, покупки, ожидание и продажи." /> : <div className="mt-4 grid gap-1">{activity.slice(0, 12).map((item) => <div key={item.id} className="flex gap-3 border-t border-bone py-3 first:border-0"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.action === "buy" ? "bg-positive" : item.action === "sell" ? "bg-magenta" : "bg-fog"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap justify-between gap-2"><p className="text-body-sm font-[535] text-ink">{item.agentName}</p><time className="text-caption text-fog">{dateTime(item.timestamp)}</time></div><p className="mt-1 text-body-sm text-steel">{item.reason}</p></div></div>)}</div>}</Card>
    <Card className="mt-6 overflow-x-auto p-6">{trades.length === 0 ? <EmptyState title="Сделок пока нет" description="Запустите агента — его исполненные покупки и продажи появятся здесь." /> : <table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Время</th><th className="pb-2 font-[485]">Агент</th><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Действие</th><th className="pb-2 font-[485]">Количество</th><th className="pb-2 font-[485]">Цена</th><th className="pb-2 font-[485]">Сумма</th></tr></thead><tbody>{trades.map((trade) => <tr key={trade.id} className="border-t border-bone text-body-sm"><td className="py-3 text-steel">{dateTime(trade.executedAt)}</td><td className="py-3 font-[485] text-ink">{trade.agentName}</td><td className="py-3 font-[485] text-ink">{trade.ticker}</td><td className={trade.side.toLowerCase() === "buy" ? "py-3 text-positive" : "py-3 text-negative"}>{trade.side.toLowerCase() === "buy" ? "Покупка" : "Продажа"}</td><td className="py-3 tabular-nums text-ink">{trade.quantity}</td><td className="py-3 tabular-nums text-ink">{money(trade.price)}</td><td className="py-3 tabular-nums text-ink">{money(trade.total)}</td></tr>)}</tbody></table>}</Card>
  </div>;
}

function ValueCard({ label, value }: { label: string; value: string }) { return <Card className="p-4"><p className="text-caption text-steel">{label}</p><p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{value}</p></Card>; }
function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function dateTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }
