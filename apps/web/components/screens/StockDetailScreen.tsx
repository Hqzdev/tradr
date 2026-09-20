"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Bookmark01Icon, BookmarkCheck01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import StockChart from "@/components/market/StockChart";
import StockMark from "@/components/market/StockMark";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Tabs from "@/components/ui/Tabs";
import { getCandles, getInstrumentDetails, type InstrumentDetails, type MarketCandle, type MarketTimeframe } from "@/lib/api/market";
import { getOrders, getTrades, type Order, type Trade } from "@/lib/api/trading";
import { getAgentPerformance, listAgents } from "@/lib/api/agents";
import type { StockProfile } from "@/lib/stocks";

function money(value: number): string {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
}

function dateTime(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function requestError(error: unknown): string {
  return error instanceof Error ? "Проверьте, что локальный backend запущен, и повторите попытку." : "Данные временно недоступны.";
}

export default function StockDetailScreen({ profile }: { profile: StockProfile }) {
  const [details, setDetails] = useState<InstrumentDetails | null>(null);
  const [candles, setCandles] = useState<MarketCandle[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [agentObservers, setAgentObservers] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<MarketTimeframe>("1h");
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [chartError, setChartError] = useState("");
  const [activityTab, setActivityTab] = useState("Сделки агентов");
  const [watched, setWatched] = useState(false);

  const loadAccountData = useCallback(async () => {
    const [nextTrades, nextOrders, nextAgents] = await Promise.all([getTrades(), getOrders(), listAgents()]);
    setTrades(nextTrades);
    setOrders(nextOrders);
    const performance = await Promise.all(nextAgents.map(async (agent) => ({ agent, performance: await getAgentPerformance(agent.id) })));
    setAgentObservers(performance.filter(({ performance }) => performance.positions.some((position) => position.ticker === profile.ticker)).map(({ agent }) => agent.name));
  }, [profile.ticker]);

  const loadCandles = useCallback(async () => {
    setChartLoading(true);
    setChartError("");
    try {
      setCandles(await getCandles(profile.ticker, timeframe));
    } catch (error) {
      setChartError(requestError(error));
    } finally {
      setChartLoading(false);
    }
  }, [profile.ticker, timeframe]);

  const loadPage = useCallback(async () => {
    setLoading(true);
    setPageError("");
    try {
      const [nextDetails] = await Promise.all([getInstrumentDetails(profile.ticker), loadAccountData()]);
      setDetails(nextDetails);
    } catch (error) {
      setPageError(requestError(error));
    } finally {
      setLoading(false);
    }
  }, [loadAccountData, profile.ticker]);

  useEffect(() => { void loadPage(); }, [loadPage]);
  useEffect(() => { void loadCandles(); }, [loadCandles]);

  const instrument = details?.instrument;
  const price = instrument?.price ?? profile.demoPrice;
  const change = instrument?.changePercent ?? profile.demoChangePercent;
  const positive = change >= 0;
  const filteredTrades = useMemo(() => trades.filter((trade) => trade.ticker === profile.ticker), [profile.ticker, trades]);
  const filteredOrders = useMemo(() => orders.filter((order) => order.ticker === profile.ticker), [orders, profile.ticker]);
  const metrics = details?.metrics.slice(0, 6) ?? [];

  return (
    <div className="stock-detail pb-16">
      <Link href="/market" className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-body-sm text-steel transition-colors hover:text-ink">
        <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" strokeWidth={2} /> Рынок
      </Link>

      <header className="stock-detail-header sticky top-0 z-30 -mx-2 mt-4 flex flex-wrap items-center gap-3 rounded-[22px] border border-white/80 bg-[#f8f7fb]/90 px-2 py-3 backdrop-blur-xl">
        <StockMark stock={profile} size={54} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2"><h1 className="text-heading-sm font-[550] text-ink">{profile.name}</h1><span className="text-body-sm text-steel">{profile.ticker} · {instrument?.exchange ?? profile.exchange}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-2"><strong className="text-heading font-[535] tabular-nums text-ink">{money(price)}</strong><span className={`rounded-pill px-2 py-1 text-caption font-[600] ${positive ? "bg-positive-tint text-positive" : "bg-negative-tint text-negative"}`}>{positive ? "▲" : "▼"} {Math.abs(change).toFixed(2).replace(".", ",")}%</span><span className="text-caption text-steel">Объём {(instrument?.volume ?? 0).toLocaleString("ru-RU")}</span></div>
        </div>
        <button type="button" className="focus-ring grid h-11 w-11 place-items-center rounded-[14px] border border-bone bg-white text-steel transition-colors hover:text-magenta-deep" onClick={() => setWatched((value) => !value)} aria-label={watched ? "Убрать из списка наблюдения" : "Добавить в список наблюдения"} aria-pressed={watched}><HugeiconsIcon icon={watched ? BookmarkCheck01Icon : Bookmark01Icon} className="h-5 w-5" strokeWidth={2} /></button>
      </header>

      {pageError && <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-warning-ring bg-warning-tint px-4 py-3 text-body-sm text-warning"><span>{pageError}</span><Button size="sm" icon={<HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4" />} onClick={() => void loadPage()}>Повторить</Button></div>}

      <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
        <StockChart candles={candles} timeframe={timeframe} loading={chartLoading} error={chartError} onTimeframeChange={setTimeframe} onRetry={() => void loadCandles()} />
        <aside className="rounded-[24px] border border-[#ece8ee] bg-white p-5 shadow-soft xl:sticky xl:top-[126px]">
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Торгуют агенты</p>
          <h2 className="mt-2 text-subheading font-[550] text-ink">Наблюдение без ручных сделок</h2>
          <p className="mt-2 text-body-sm leading-6 text-steel">Вы смотрите график и решения. Покупать и продавать эту акцию могут только запущенные агенты по своим правилам риска.</p>
          <div className="mt-5 border-t border-bone pt-4">
            <p className="text-caption text-steel">Сейчас держат акцию</p>
            {agentObservers.length ? <div className="mt-2 flex flex-wrap gap-2">{agentObservers.map((name) => <span key={name} className="rounded-pill bg-magenta-tint px-3 py-1.5 text-caption font-[485] text-magenta-deep">{name}</span>)}</div> : <p className="mt-2 text-body-sm text-ink">Открытых позиций нет</p>}
          </div>
          <Link href="/agents" className="mt-5 block text-body-sm font-[485] text-magenta-deep">Управлять агентами →</Link>
        </aside>
      </div>

      <section className="mt-5 rounded-[24px] border border-[#ece8ee] bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-subheading font-[550] text-ink">Ключевые показатели</h2>
        {loading ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton h-[92px] rounded-[16px]" />)}</div> : metrics.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{metrics.map((metric) => <div key={metric.label} className="rounded-[16px] bg-[#fafafb] p-4"><span className="text-caption text-steel">{metric.label}</span><strong className="mt-2 block text-subheading font-[535] text-ink">{metric.value}</strong></div>)}</div> : <p className="mt-3 text-body-sm text-steel">Метрики появятся после подключения backend.</p>}
      </section>

      <section className="mt-5 rounded-[24px] border border-[#ece8ee] bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-subheading font-[550] text-ink">О компании</h2>
        <p className="mt-3 max-w-3xl text-body leading-7 text-steel">{profile.description}</p>
        {details?.news?.length ? <div className="mt-6 border-t border-bone pt-5"><h3 className="text-body-sm font-[600] text-ink">Новости инструмента</h3><div className="mt-3 grid gap-2">{details.news.slice(0, 3).map((item) => <div key={`${item.source}-${item.headline}`} className="flex flex-col justify-between gap-1 rounded-[14px] bg-[#fafafb] px-4 py-3 sm:flex-row"><span className="text-body-sm text-ink">{item.headline}</span><small className="shrink-0 text-caption text-steel">{item.source} · {item.time}</small></div>)}</div></div> : null}
      </section>

      <section className="mt-5 rounded-[24px] border border-[#ece8ee] bg-white p-5 shadow-soft sm:p-6">
        <Tabs options={["Сделки агентов", "Заявки агентов"]} value={activityTab} onChange={setActivityTab} />
        <div className="mt-4 overflow-x-auto">
          {activityTab === "Сделки агентов" ? (
            filteredTrades.length ? <table className="w-full min-w-[700px] text-left text-body-sm"><thead className="text-caption text-steel"><tr><th className="pb-3 font-[500]">Дата</th><th className="pb-3 font-[500]">Агент</th><th className="pb-3 font-[500]">Сторона</th><th className="pb-3 font-[500]">Количество</th><th className="pb-3 font-[500]">Цена</th><th className="pb-3 text-right font-[500]">Итого</th></tr></thead><tbody>{filteredTrades.map((trade) => <tr key={trade.id} className="border-t border-bone"><td className="py-3 text-steel">{dateTime(trade.executedAt)}</td><td className="py-3 font-[485] text-ink">{trade.agentName}</td><td className={`py-3 font-[550] ${trade.side.toLowerCase() === "buy" ? "text-positive" : "text-negative"}`}>{trade.side.toLowerCase() === "buy" ? "Покупка" : "Продажа"}</td><td className="py-3 tabular-nums">{trade.quantity}</td><td className="py-3 tabular-nums">{money(trade.price)}</td><td className="py-3 text-right tabular-nums">{money(trade.total)}</td></tr>)}</tbody></table> : <EmptyState compact title="Сделок по этой акции пока нет" description="Агентские сделки появятся здесь после исполнения." />
          ) : filteredOrders.length ? <table className="w-full min-w-[620px] text-left text-body-sm"><thead className="text-caption text-steel"><tr><th className="pb-3 font-[500]">Дата</th><th className="pb-3 font-[500]">Сторона</th><th className="pb-3 font-[500]">Тип</th><th className="pb-3 font-[500]">Количество</th><th className="pb-3 text-right font-[500]">Статус</th></tr></thead><tbody>{filteredOrders.map((order) => <tr key={order.id} className="border-t border-bone"><td className="py-3 text-steel">{dateTime(order.createdAt)}</td><td className="py-3">{order.side.toLowerCase() === "buy" ? "Покупка" : "Продажа"}</td><td className="py-3">{order.orderType.toLowerCase() === "market" ? "Рыночная" : "Лимитная"}</td><td className="py-3 tabular-nums">{order.quantity}</td><td className="py-3 text-right"><span className="rounded-pill bg-[#f3eff5] px-2 py-1 text-caption text-steel">{order.status}</span></td></tr>)}</tbody></table> : <EmptyState compact title="Заявок по этой акции пока нет" description="Рыночные и лимитные заявки появятся здесь." />}
        </div>
      </section>
    </div>
  );
}
