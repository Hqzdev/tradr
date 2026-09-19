"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { IconArrowUpRight, IconPlus } from "@/components/icons";
import { listAgents, type ApiAgent } from "@/lib/api/agents";
import { getInstruments, type Instrument } from "@/lib/api/market";
import { getOrders, getPortfolio, getTrades, type Order, type Portfolio, type Trade } from "@/lib/api/trading";

export default function TerminalScreen() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([getPortfolio(), listAgents(), getInstruments(), getOrders("OPEN"), getTrades()])
      .then(([portfolioData, agentData, instrumentData, orderData, tradeData]) => {
        setPortfolio(portfolioData);
        setAgents(agentData);
        setInstruments(instrumentData);
        setOrders(orderData);
        setTrades(tradeData);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return <EmptyState title="Не удалось загрузить терминал" description="Проверьте, что backend запущен, и обновите страницу." />;
  if (!portfolio) return <p className="text-body-sm text-steel">Загружаем терминал...</p>;

  return <div>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Торговля / Управление</p><h1 className="mt-2 text-heading font-[485] text-ink">Терминал</h1><p className="mt-1.5 text-body text-steel">Рынок, агенты и все действия по счёту в одном месте.</p></div>
      <Link href="/agents/new"><Button variant="primary" icon={<IconPlus className="h-4 w-4" />}>Создать агента</Button></Link>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <ValueCard label="Доступно для покупок" value={money(portfolio.cashBalance)} />
      <ValueCard label="В позициях" value={money(portfolio.holdingsValue)} />
      <ValueCard label="Активных агентов" value={String(agents.filter((agent) => agent.status === "active").length)} />
    </div>

    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="p-6"><SectionTitle title="Рынок" href="/market" label="Все котировки" /><div className="mt-4 divide-y divide-bone">{instruments.slice(0, 6).map((item) => <div key={item.ticker} className="flex items-center justify-between gap-3 py-3 text-body-sm"><span><span className="font-[485] text-ink">{item.ticker}</span><span className="ml-2 text-caption text-steel">{item.name}</span></span><span className="text-right"><span className="block tabular-nums text-ink">{money(item.price, item.currency)}</span><span className={item.changePercent >= 0 ? "text-caption text-positive" : "text-caption text-negative"}>{item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%</span></span></div>)}</div></Card>
      <Card className="p-6"><SectionTitle title="Агенты" href="/agents" label="Управлять" />{agents.length === 0 ? <EmptyState compact className="mt-4" title="Агентов пока нет" description="Создайте первого агента, чтобы он начал следить за рынком." actionLabel="Создать агента" actionHref="/agents/new" /> : <div className="mt-4 divide-y divide-bone">{agents.map((agent) => <Link key={agent.id} href={`/agents/${agent.id}`} className="flex items-center justify-between gap-3 py-3 text-body-sm"><span><span className="font-[485] text-ink">{agent.name}</span><span className="ml-2 text-caption text-steel">{strategyLabel(agent.strategy)} · сигнал {signalLabel(agent.triggerPercent)}</span></span><span className={agent.status === "active" ? "text-caption text-positive" : "text-caption text-steel"}>{agent.status === "active" ? "Активен" : "На паузе"}</span></Link>)}</div>}</Card>
    </div>

    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="p-6"><SectionTitle title="Открытые заявки" href="/orders" label="Все заявки" />{orders.length === 0 ? <EmptyState compact className="mt-4" title="Открытых заявок нет" description="Ожидающие исполнения заявки появятся здесь." /> : <div className="mt-4 divide-y divide-bone">{orders.slice(0, 5).map((order) => <OrderRow key={order.id} order={order} />)}</div>}</Card>
      <Card className="p-6"><SectionTitle title="Последние сделки" href="/history" label="История" />{trades.length === 0 ? <EmptyState compact className="mt-4" title="Сделок пока нет" description="Исполненные действия агентов появятся здесь." /> : <div className="mt-4 divide-y divide-bone">{trades.slice(0, 5).map((trade) => <TradeRow key={trade.id} trade={trade} />)}</div>}</Card>
    </div>
  </div>;
}

function SectionTitle({ title, href, label }: { title: string; href: string; label: string }) { return <div className="flex items-center justify-between"><p className="text-subheading font-[485] text-ink">{title}</p><Link href={href} className="inline-flex items-center gap-1 text-caption font-[485] text-magenta-deep hover:text-magenta"><span>{label}</span><IconArrowUpRight className="h-3.5 w-3.5" /></Link></div>; }
function ValueCard({ label, value }: { label: string; value: string }) { return <Card className="px-5 py-4"><p className="text-body-sm text-steel">{label}</p><p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{value}</p></Card>; }
function OrderRow({ order }: { order: Order }) { return <div className="flex items-center justify-between gap-3 py-3 text-body-sm"><span className="font-[485] text-ink">{order.ticker}</span><span className="text-steel">{order.side === "BUY" ? "Покупка" : "Продажа"} · {order.quantity}</span></div>; }
function TradeRow({ trade }: { trade: Trade }) { return <div className="flex items-center justify-between gap-3 py-3 text-body-sm"><span><span className="font-[485] text-ink">{trade.ticker}</span><span className={trade.side === "BUY" ? "ml-2 text-caption text-positive" : "ml-2 text-caption text-negative"}>{trade.side === "BUY" ? "Покупка" : "Продажа"}</span></span><span className="tabular-nums text-ink">{money(trade.total)}</span></div>; }
function money(value: number, currency = "USD"): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value); }
function strategyLabel(value: string): string { return { aggressive: "Агрессивный", careful: "Осторожный", random: "Случайный" }[value] ?? value; }
function signalLabel(value: number): string { return `${value > 0 ? "+" : ""}${value}%`; }
