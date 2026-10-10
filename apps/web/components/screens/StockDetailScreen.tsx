"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Bookmark01Icon, BookmarkCheck01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import StockChart from "@/components/market/StockChart";
import StockMark from "@/components/market/StockMark";
import Button from "@/components/ui/Button";
import DeltaPill from "@/components/ui/DeltaPill";
import Money from "@/components/ui/Money";
import EmptyState from "@/components/ui/EmptyState";
import Tabs from "@/components/ui/Tabs";
import { getCandles, getInstrumentDetails, type InstrumentDetails, type MarketCandle, type MarketTimeframe } from "@/lib/api/market";
import { getOrders, getTrades, type Order, type Trade } from "@/lib/api/trading";
import { getAgentPerformance, listAgents } from "@/lib/api/agents";
import type { StockProfile } from "@/lib/stocks";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileStockDetail from "@/components/mobile/MobileStockDetail";

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
  const mobile = useIsMobile();

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
  const filteredTrades = useMemo(() => trades.filter((trade) => trade.ticker === profile.ticker), [profile.ticker, trades]);
  const filteredOrders = useMemo(() => orders.filter((order) => order.ticker === profile.ticker), [orders, profile.ticker]);
  const metrics = details?.metrics.slice(0, 6) ?? [];

  const metricsCard = (
    <section className="q-card q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 3 }}>
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-semibold text-ink">Показатели</h2>
        <span className="text-[12px] text-steel">по данным движка</span>
      </div>
      {loading ? (
        <div className="mt-4 space-y-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="skeleton h-9 rounded-[10px]" />)}</div>
      ) : metrics.length ? (
        <div className="mt-3 divide-y divide-white/[0.06]">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="q-reveal flex items-center justify-between gap-3 py-3" style={{ ["--i" as string]: index + 4 }}>
              <span className="text-[13.5px] text-steel">{metric.label}</span>
              <strong className="q-num text-[13.5px] font-medium text-ink">{metric.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-body-sm text-steel">Метрики появятся после подключения backend.</p>
      )}
    </section>
  );

  if (mobile) {
    return (
      <MobileStockDetail
        profile={profile}
        details={details}
        price={price}
        change={change}
        candles={candles}
        timeframe={timeframe}
        chartLoading={chartLoading}
        chartError={chartError}
        pageError={pageError}
        loading={loading}
        trades={filteredTrades}
        agentObservers={agentObservers}
        watched={watched}
        onWatchToggle={() => setWatched((value) => !value)}
        onTimeframeChange={setTimeframe}
        onRetryChart={() => void loadCandles()}
        onRetryPage={() => void loadPage()}
      />
    );
  }

  return (
    <div className="stock-detail space-y-5 pb-16">
      <header className="q-reveal flex flex-wrap items-center gap-x-6 gap-y-4" style={{ ["--i" as string]: 0 }}>
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border border-white/[0.1] bg-white/[0.05]">
          <StockMark stock={profile} size={38} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-[30px] font-semibold tracking-[-0.04em] text-ink">{profile.ticker}</h1>
            <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[11px] font-semibold tracking-wide text-steel">{instrument?.exchange ?? profile.exchange}</span>
          </div>
          <p className="mt-0.5 text-[14px] text-steel">{profile.name}</p>
        </div>
        <span className="hidden h-12 w-px bg-white/[0.1] sm:block" />
        <div>
          <p className="text-[36px] font-semibold leading-none tracking-[-0.045em] text-ink"><Money value={price} animate={false} /></p>
          <div className="mt-2 flex items-center gap-2">
            <DeltaPill value={change} />
            <span className="text-[13px] text-steel">сегодня</span>
          </div>
        </div>
        <div className="pl-1">
          <p className="text-[12px] text-steel">Объём</p>
          <p className="q-num mt-1 text-[16px] font-medium text-ink">{(instrument?.volume ?? 0).toLocaleString("ru-RU")}</p>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <Link href="/market" className="press-98 focus-ring flex h-11 items-center gap-2 rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-4 text-[14px] font-medium text-ink transition-colors hover:border-white/[0.2]">
            <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" strokeWidth={2} /> Рынок
          </Link>
          <button type="button" className={`press-98 focus-ring flex h-11 items-center gap-2 rounded-[12px] border px-4 text-[14px] font-medium transition-colors ${watched ? "border-magenta/50 bg-magenta/15 text-magenta-deep" : "border-white/[0.1] bg-white/[0.03] text-ink hover:border-white/[0.2]"}`} onClick={() => setWatched((value) => !value)} aria-label={watched ? "Убрать из списка наблюдения" : "Добавить в список наблюдения"} aria-pressed={watched}>
            <HugeiconsIcon icon={watched ? BookmarkCheck01Icon : Bookmark01Icon} className="h-4 w-4" strokeWidth={2} />
            {watched ? "В наблюдении" : "Наблюдать"}
          </button>
        </div>
      </header>

      {pageError && <div className="flex animate-slide-down-fade flex-wrap items-center justify-between gap-3 rounded-[16px] border border-warning/30 bg-warning/[0.08] px-4 py-3 text-body-sm text-warning"><span>{pageError}</span><Button size="sm" icon={<HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4" />} onClick={() => void loadPage()}>Повторить</Button></div>}

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="q-reveal" style={{ ["--i" as string]: 1 }}>
          <StockChart candles={candles} timeframe={timeframe} loading={chartLoading} error={chartError} onTimeframeChange={setTimeframe} onRetry={() => void loadCandles()} />
        </div>
        <div className="space-y-5 xl:sticky xl:top-[140px]">
          <aside className="q-card q-reveal overflow-hidden p-5" style={{ ["--i" as string]: 2, background: "radial-gradient(120% 90% at 100% 0%, rgba(108,92,255,0.18) 0%, rgba(108,92,255,0) 60%), linear-gradient(180deg,#131318 0%,#0d0d10 100%)" }}>
            <p className="flex items-center gap-2 text-[13px] text-steel"><span className="q-live text-magenta" />Торгуют агенты</p>
            <h2 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">Наблюдение без ручных сделок</h2>
            <p className="mt-2 text-[13.5px] leading-6 text-steel">Вы смотрите график и решения. Покупать и продавать эту акцию могут только запущенные агенты по своим правилам риска.</p>
            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <p className="text-[12.5px] text-steel">Сейчас держат акцию</p>
              {agentObservers.length ? <div className="mt-2.5 flex flex-wrap gap-2">{agentObservers.map((name, index) => <span key={name} className="q-pop rounded-full border border-magenta/30 bg-magenta/[0.14] px-3 py-1.5 text-[12.5px] font-medium text-magenta-deep" style={{ ["--i" as string]: index }}>{name}</span>)}</div> : <p className="mt-2 text-body-sm text-ink">Открытых позиций нет</p>}
            </div>
            <Link href="/agents" className="group mt-5 flex items-center gap-1.5 text-[14px] font-medium text-magenta-deep transition-colors hover:text-ink">Управлять агентами <span className="transition-transform group-hover:translate-x-0.5">→</span></Link>
          </aside>
          {metricsCard}
        </div>
      </div>

      <section className="q-card q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 4 }}>
        <h2 className="text-[16px] font-semibold text-ink">О компании</h2>
        <p className="mt-3 max-w-3xl text-[14.5px] leading-7 text-steel">{profile.description}</p>
        {details?.news?.length ? (
          <div className="mt-6 border-t border-white/[0.07] pt-5">
            <h3 className="text-[14px] font-semibold text-ink">Новости инструмента</h3>
            <div className="mt-3 divide-y divide-white/[0.06]">
              {details.news.slice(0, 3).map((item, index) => (
                <div key={`${item.source}-${item.headline}`} className="q-reveal flex items-center gap-4 py-3.5" style={{ ["--i" as string]: index + 5 }}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] border border-white/[0.08] bg-white/[0.04] text-[13px] font-bold text-ink">{item.source.slice(0, 1)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-steel">{item.source} · {item.time}</p>
                    <p className="mt-0.5 text-[14px] text-ink">{item.headline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="q-card q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 5 }}>
        <Tabs options={["Сделки агентов", "Заявки агентов"]} value={activityTab} onChange={setActivityTab} />
        <div key={activityTab} className="mt-4 animate-fade-in overflow-x-auto">
          {activityTab === "Сделки агентов" ? (
            filteredTrades.length ? (
              <table className="w-full min-w-[700px] text-left text-[14px]">
                <thead className="text-[12.5px] text-steel"><tr><th className="pb-3 font-medium">Дата</th><th className="pb-3 font-medium">Агент</th><th className="pb-3 font-medium">Сторона</th><th className="pb-3 font-medium">Количество</th><th className="pb-3 font-medium">Цена</th><th className="pb-3 text-right font-medium">Итого</th></tr></thead>
                <tbody>{filteredTrades.map((trade) => <tr key={trade.id} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"><td className="py-3.5 text-steel">{dateTime(trade.executedAt)}</td><td className="py-3.5 font-medium text-ink">{trade.agentName}</td><td className="py-3.5"><SidePill buy={trade.side.toLowerCase() === "buy"} /></td><td className="q-num py-3.5 text-ink">{trade.quantity}</td><td className="q-num py-3.5 text-ink">{money(trade.price)}</td><td className="q-num py-3.5 text-right font-medium text-ink">{money(trade.total)}</td></tr>)}</tbody>
              </table>
            ) : <EmptyState compact title="Сделок по этой акции пока нет" description="Агентские сделки появятся здесь после исполнения." />
          ) : filteredOrders.length ? (
            <table className="w-full min-w-[620px] text-left text-[14px]">
              <thead className="text-[12.5px] text-steel"><tr><th className="pb-3 font-medium">Дата</th><th className="pb-3 font-medium">Сторона</th><th className="pb-3 font-medium">Тип</th><th className="pb-3 font-medium">Количество</th><th className="pb-3 text-right font-medium">Статус</th></tr></thead>
              <tbody>{filteredOrders.map((order) => <tr key={order.id} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]"><td className="py-3.5 text-steel">{dateTime(order.createdAt)}</td><td className="py-3.5"><SidePill buy={order.side.toLowerCase() === "buy"} /></td><td className="py-3.5 text-ink">{order.orderType.toLowerCase() === "market" ? "Рыночная" : "Лимитная"}</td><td className="q-num py-3.5 text-ink">{order.quantity}</td><td className="py-3.5 text-right"><span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[12px] text-charcoal">{order.status}</span></td></tr>)}</tbody>
            </table>
          ) : <EmptyState compact title="Заявок по этой акции пока нет" description="Рыночные и лимитные заявки появятся здесь." />}
        </div>
      </section>
    </div>
  );
}

function SidePill({ buy }: { buy: boolean }) {
  return <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${buy ? "bg-positive/[0.12] text-positive" : "bg-negative/[0.12] text-negative"}`}>{buy ? "Покупка" : "Продажа"}</span>;
}
