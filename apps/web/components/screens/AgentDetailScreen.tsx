"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AreaChart from "@/components/charts/AreaChart";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DeltaPill from "@/components/ui/DeltaPill";
import EmptyState from "@/components/ui/EmptyState";
import Money from "@/components/ui/Money";
import StatTile from "@/components/StatTile";
import StockMark from "@/components/market/StockMark";
import { IconArrowDownRight, IconArrowUpRight, IconClock, IconCoins, IconPause, IconPieChart, IconTrendUp, IconWallet } from "@/components/icons";
import { closeAgent, getAgent, getAgentLog, getAgentPerformance, updateAgentAllocation, updateAgentStatus, withdrawAgentProfit, type AgentDecision, type AgentPerformance, type ApiAgent } from "@/lib/api/agents";
import { getStrategy, statusLabel } from "@/lib/agentVisuals";
import { getStockProfile } from "@/lib/stocks";
import clsx from "@/lib/clsx";
import { getDashboard } from "@/lib/api/dashboard";
import { ApiError } from "@/lib/api/client";
import proQuant from "@/data/pro-quant.json";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileAgentHero from "@/components/mobile/MobileAgentHero";
import { MSkeleton } from "@/components/mobile/ui";

export default function AgentDetailScreen({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [allocation, setAllocation] = useState(0);
  const [capitalAction, setCapitalAction] = useState<"add" | "withdraw">("add");
  const [reserve, setReserve] = useState(0);
  const [allocationError, setAllocationError] = useState<string | null>(null);
  const [allocationMessage, setAllocationMessage] = useState<string | null>(null);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    Promise.all([getAgent(agentId), getAgentPerformance(agentId), getAgentLog(agentId), getDashboard()])
      .then(([nextAgent, nextPerformance, nextDecisions, dashboard]) => { setAgent(nextAgent); setPerformance(nextPerformance); setDecisions(nextDecisions); setReserve(dashboard.reserveCash); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [agentId]);

  const toggleStatus = async () => {
    if (!agent || agent.status === "error") return;
    setUpdating(true);
    try {
      setAgent(await updateAgentStatus(agent.id, agent.status === "active" ? "paused" : "active"));
      const [nextPerformance, nextDecisions, dashboard] = await Promise.all([getAgentPerformance(agent.id), getAgentLog(agent.id), getDashboard()]);
      setPerformance(nextPerformance);
      setDecisions(nextDecisions);
      setReserve(dashboard.reserveCash);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return mobile ? <MSkeleton blocks={[60, 70, 220, 110, 52]} /> : <DetailSkeleton />;

  if (error || !agent) {
    return <EmptyState title="Агент не найден" description="Возможно, он был удалён или у вас нет к нему доступа." actionLabel="К списку агентов" actionHref="/agents" />;
  }

  const strategy = getStrategy(agent.strategy);
  const Icon = strategy.icon;
  const isPaused = agent.status === "paused";
  const maximumTransfer = capitalAction === "add" ? Math.min(reserve, 1000000000000 - agent.budgetLimit)
    : Math.max(0, Math.min(performance?.cashBalance ?? agent.cashBalance, agent.budgetLimit - 1000));
  const newCapital = Math.round((agent.budgetLimit + (capitalAction === "add" ? allocation : -allocation)) * 100) / 100;
  const validAllocation = Number.isFinite(allocation) && allocation > 0 && allocation <= maximumTransfer && Math.abs(allocation * 100 - Math.round(allocation * 100)) < 0.001;
  const saveAllocation = async () => {
    setAllocationError(null);
    setAllocationMessage(null);
    if (!validAllocation) { setAllocationError(`Доступно ${money(maximumTransfer)}. Введите сумму перевода с точностью до центов.`); return; }
    setUpdating(true);
    try {
      const updated = await updateAgentAllocation(agent.id, newCapital);
      setAgent(updated);
      setAllocation(0);
      const [nextPerformance, nextDecisions, dashboard] = await Promise.all([getAgentPerformance(agent.id), getAgentLog(agent.id), getDashboard()]);
      setPerformance(nextPerformance); setDecisions(nextDecisions); setReserve(dashboard.reserveCash);
      setAllocationMessage(`${money(allocation)} ${capitalAction === "add" ? "добавлено агенту" : "возвращено в резерв"}.`);
    } catch (error) { setAllocationError(allocationErrorMessage(error)); }
    finally { setUpdating(false); }
  };
  const archive = async () => {
    if (!window.confirm("Закрыть позиции, вернуть деньги в резерв и архивировать агента?")) return;
    setUpdating(true);
    try { await closeAgent(agent.id); window.location.assign("/dashboard"); }
    finally { setUpdating(false); }
  };

  const total = performance?.totalValue ?? agent.totalValue;
  const profit = performance?.profit ?? agent.profit;
  const withdrawableProfit = Math.max(0, Math.min(profit, performance?.cashBalance ?? agent.cashBalance));
  const transferProfit = async () => {
    setUpdating(true);
    setTransferMessage(null);
    setTransferError(null);
    try {
      setAgent(await withdrawAgentProfit(agent.id));
      const [nextPerformance, nextDecisions, dashboard] = await Promise.all([getAgentPerformance(agent.id), getAgentLog(agent.id), getDashboard()]);
      setPerformance(nextPerformance);
      setDecisions(nextDecisions);
      setReserve(dashboard.reserveCash);
      setTransferMessage("Свободная прибыль переведена в резерв. Теперь её можно выдать другому агенту.");
    } catch (error) {
      setTransferError(error instanceof Error ? error.message : "Не удалось перевести прибыль.");
    } finally { setUpdating(false); }
  };
  const curve = performance?.equityCurve ?? [];
  const latest = decisions[0];

  return (
    <div className="space-y-6">
      {mobile && <MobileAgentHero agent={agent} performance={performance} updating={updating} onToggleStatus={toggleStatus} />}
      {agent.strategy === "pro_quant" && <Card className="p-5">
        <p className="font-semibold text-ink">{proQuant.name} · {proQuant.rarity}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">{proQuant.abilities.map((ability) => <div key={ability.name}><p className="text-[13px] font-medium text-ink">{ability.name}</p><p className="mt-1 text-[12px] leading-5 text-steel">{ability.description}</p></div>)}</div>
      </Card>}
      {!mobile && (<>
      <header className="q-reveal flex flex-wrap items-center justify-between gap-5" style={{ ["--i" as string]: 0 }}>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[20px] border" style={{ background: `${strategy.color}24`, borderColor: `${strategy.color}55` }}>
            <Icon className="h-7 w-7" style={{ color: strategy.color }} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-ink">{agent.name}</h1>
              <Badge tone={agent.status}>{statusLabel[agent.status] ?? agent.status}</Badge>
            </div>
            <p className="mt-1 text-[14px] text-steel">{strategy.tagline} · {strategy.label} · создан {formatDay(agent.createdAt)}</p>
          </div>
        </div>
        {agent.status !== "error" && (
          <Button variant={isPaused ? "primary" : "outline"} icon={isPaused ? <IconArrowUpRight className="h-4 w-4" /> : <IconPause className="h-4 w-4" />} onClick={toggleStatus} disabled={updating}>
            {updating ? "Сохраняем..." : isPaused ? "Запустить" : "Поставить на паузу"}
          </Button>
        )}
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile index={1} icon={<IconWallet className="h-[15px] w-[15px]" />} label="Капитал агента" value={<Money value={total} decimals={0} />} caption={performance ? `старт ${new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(performance.initialCapital)}` : undefined} />
        <StatTile index={2} icon={<IconCoins className="h-[15px] w-[15px]" />} label="Свободные деньги" value={<Money value={performance?.cashBalance ?? agent.cashBalance} decimals={0} />} caption="готовы к покупке" />
        <StatTile index={3} icon={<IconTrendUp className="h-[15px] w-[15px]" />} label="Результат" value={<Money value={profit} signed decimals={0} />} tone={profit >= 0 ? "positive" : "negative"} caption={performance ? `${performance.profitPercent >= 0 ? "+" : ""}${performance.profitPercent.toFixed(2).replace(".", ",")}% за всё время` : undefined} />
        <StatTile index={4} icon={<IconPieChart className="h-[15px] w-[15px]" />} label="Открытые позиции" value={String(performance?.positions.length ?? agent.positionCount)} caption="акций в портфеле агента" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 5 }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[16px] font-semibold text-ink">Капитал агента</p>
              <p className="mt-1 text-[12.5px] text-steel">Снимки стоимости портфеля</p>
            </div>
            <DeltaPill value={performance?.profitPercent ?? 0} />
          </div>
          <div className="mt-5">
            <AreaChart
              values={curve.map((point) => point.totalValue)}
              labels={curve.map((point) => formatDayTime(point.capturedAt))}
              height={240}
              color={strategy.color}
              formatValue={(value) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}
              axisFormat={(value) => `$${Math.round(value / 1000)}K`}
            />
          </div>
        </Card>

        <Card className="q-reveal flex flex-col p-5 sm:p-6" style={{ ["--i" as string]: 6, background: latest ? `radial-gradient(120% 90% at 100% 0%, ${latest.action === "buy" ? "rgba(46,189,133,0.16)" : latest.action === "sell" ? "rgba(246,70,93,0.14)" : "rgba(255,255,255,0.05)"} 0%, transparent 60%), linear-gradient(180deg,#131318 0%,#0d0d10 100%)` : undefined }}>
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">Последнее решение</p>
            {latest && <span className="flex items-center gap-1.5 text-[12px] text-steel"><IconClock className="h-3.5 w-3.5" />{dateTime(latest.timestamp)}</span>}
          </div>
          {latest ? (
            <>
              <div className="mt-5 flex items-center gap-3">
                <span className={clsx("grid h-12 w-12 place-items-center rounded-[14px] border", latest.action === "buy" ? "border-positive/30 bg-positive/[0.12] text-positive" : latest.action === "sell" ? "border-negative/30 bg-negative/[0.12] text-negative" : "border-white/[0.1] bg-white/[0.05] text-steel")}>
                  {latest.action === "sell" ? <IconArrowDownRight className="h-5 w-5" /> : latest.action === "buy" ? <IconArrowUpRight className="h-5 w-5" /> : <IconClock className="h-5 w-5" />}
                </span>
                <p className="text-[24px] font-semibold tracking-[-0.03em] text-ink">{actionLabel(latest.action)}</p>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-charcoal">{latest.reason}</p>
              <div className="flex-1" />
              <p className="mt-5 border-t border-white/[0.07] pt-4 text-[12.5px] text-steel">Всего решений в журнале: {decisions.length}</p>
            </>
          ) : (
            <EmptyState compact className="mt-4" title="Решений пока нет" description="Здесь будет журнал анализа, покупок и продаж." />
          )}
        </Card>
      </div>

      </>)}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 7 }}>
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">Открытые позиции</p>
            {!!performance?.positions.length && <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[12px] font-medium text-ink">{performance.positions.length}</span>}
          </div>
          {!performance?.positions.length ? (
            <EmptyState compact className="mt-4" title="Позиций пока нет" description="Запущенный агент сам найдёт точку входа." />
          ) : (
            <div className="mt-3 divide-y divide-white/[0.06]">
              {performance.positions.map((position, index) => {
                const profile = getStockProfile(position.ticker);
                return (
                  <Link key={position.ticker} href={`/market/${position.ticker}`} className="q-reveal group flex items-center gap-3 py-3.5" style={{ ["--i" as string]: index + 8 }}>
                    {profile ? <StockMark stock={profile} size={36} /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.08] text-[13px] font-semibold text-ink">{position.ticker[0]}</span>}
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-semibold text-ink transition-colors group-hover:text-magenta-deep">{position.ticker}</p>
                      <p className="text-[12.5px] text-steel">{position.quantity} акций · вход {money(position.averagePrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="q-num text-[14.5px] font-semibold text-ink">{money(position.marketValue)}</p>
                      <p className={clsx("q-num mt-0.5 text-[12.5px]", position.profit >= 0 ? "text-positive" : "text-negative")}>{signedMoney(position.profit)} · {position.profitPercent.toFixed(2).replace(".", ",")}%</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
        <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 8 }}>
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-semibold text-ink">Журнал решений</p>
            {agent.status === "active" && <span className="flex items-center gap-1.5 rounded-full bg-negative/[0.12] px-2 py-0.5 text-[10.5px] font-bold tracking-wider text-negative"><span className="q-live h-[5px] w-[5px]" />LIVE</span>}
          </div>
          {!decisions.length ? (
            <EmptyState compact className="mt-4" title="Решений пока нет" description="Здесь будет журнал анализа, покупок и продаж." />
          ) : (
            <div className="mt-3 divide-y divide-white/[0.06]">
              {decisions.slice(0, 8).map((decision, index) => (
                <div key={decision.id} className="q-reveal py-3.5" style={{ ["--i" as string]: index + 9 }}>
                  <div className="flex items-center justify-between gap-3">
                    <span className={clsx("rounded-full px-2.5 py-1 text-[11.5px] font-semibold", decision.action === "buy" ? "bg-positive/[0.12] text-positive" : decision.action === "sell" ? "bg-negative/[0.12] text-negative" : "bg-white/[0.06] text-steel")}>{actionLabel(decision.action)}</span>
                    <time className="text-[12px] text-steel">{dateTime(decision.timestamp)}</time>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-charcoal">{decision.reason}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {agent.status !== "error" && (
        <Card id="capital" className="q-reveal scroll-mt-[80px] p-5 sm:p-6" style={{ ["--i" as string]: 9 }}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h2 className="text-[18px] font-semibold text-ink">Управление капиталом</h2><p className="mt-1 text-[13px] text-steel">Выделено {money(agent.budgetLimit)} · Резерв {money(reserve)}</p></div>
            {!isPaused && <Button variant="outline" onClick={toggleStatus} disabled={updating} icon={<IconPause className="h-4 w-4" />}>Приостановить для перевода</Button>}
          </div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,480px)_1fr]">
            <form onSubmit={(event) => { event.preventDefault(); void saveAllocation(); }}>
              <div className="flex gap-1 border-b border-white/[0.08] pb-2" role="group" aria-label="Направление перевода">
                {([{ value: "add", label: "Добавить агенту" }, { value: "withdraw", label: "Забрать в резерв" }] as const).map((item) => <button key={item.value} type="button" aria-pressed={capitalAction === item.value} disabled={updating} onClick={() => { setCapitalAction(item.value); setAllocation(0); setAllocationError(null); setAllocationMessage(null); }} className={clsx("focus-ring rounded-lg px-3 py-2 text-[13px] font-medium", capitalAction === item.value ? "bg-white/[0.08] text-ink" : "text-steel hover:text-ink")}>{item.label}</button>)}
              </div>
              <label className="mt-4 block"><span className="text-[12px] text-steel">Сумма перевода, $</span>
                <input className="focus-ring mt-2 h-12 w-full rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-[22px] tabular-nums text-ink outline-none" aria-describedby="capital-available" placeholder="0" inputMode="decimal" type="number" step="0.01" min="0.01" max={maximumTransfer} disabled={!isPaused || updating} value={allocation || ""} onChange={(event) => { setAllocation(Number(event.target.value)); setAllocationError(null); setAllocationMessage(null); }} />
              </label>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {[1000, 5000, 10000].map((amount) => <button key={amount} type="button" disabled={!isPaused || updating || amount > maximumTransfer} onClick={() => { setAllocation(amount); setAllocationError(null); setAllocationMessage(null); }} className="focus-ring rounded-lg border border-white/[0.08] px-3 py-1.5 text-[12px] text-steel hover:text-ink disabled:opacity-30">{money(amount)}</button>)}
                <button type="button" disabled={!isPaused || updating || maximumTransfer <= 0} onClick={() => { setAllocation(Math.floor(maximumTransfer * 100) / 100); setAllocationError(null); setAllocationMessage(null); }} className="focus-ring px-2 py-1.5 text-[12px] font-medium text-magenta-deep disabled:opacity-30">Максимум</button>
              </div>
              <p id="capital-available" className="mt-3 text-[12px] text-steel">Доступно {money(maximumTransfer)}{capitalAction === "withdraw" ? " · у агента останется минимум $1 000" : ""}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4 text-[13px]"><span className="text-steel">Капитал после перевода</span><span className="font-medium text-ink">{validAllocation ? money(newCapital) : money(agent.budgetLimit)}</span></div>
              <Button className="mt-4" fullWidth variant="primary" type="submit" disabled={!isPaused || updating || !validAllocation}>{updating ? "Переводим…" : capitalAction === "add" ? "Добавить капитал" : "Вернуть в резерв"}</Button>
              {allocationError && <p role="alert" className="mt-3 text-[12.5px] text-negative">{allocationError}</p>}
              {allocationMessage && <p role="status" className="mt-3 text-[12.5px] text-positive">{allocationMessage}</p>}
              {!isPaused && <p className="mt-3 text-[12px] text-steel">Для перевода нужно приостановить агента. Позиции сохранятся.</p>}
            </form>
            <div className="space-y-5 lg:border-l lg:border-white/[0.08] lg:pl-6">
              <div><p className="text-[14px] font-medium text-ink">Забрать прибыль</p><p className="mt-1 text-[13px] text-steel">Доступно {money(withdrawableProfit)}</p>
                <p className="mt-2 max-w-sm text-[12px] leading-5 text-steel">Вывод свободной прибыли сохраняет выделенный капитал агента.</p>
                <Button className="mt-3" variant="outline" onClick={transferProfit} disabled={!isPaused || updating || withdrawableProfit < 0.01}>Вывести прибыль</Button>
                {transferMessage && <p role="status" className="mt-2 text-[12px] text-positive">{transferMessage}</p>}
                {transferError && <p role="alert" className="mt-2 text-[12px] text-negative">{transferError}</p>}
              </div>
              <div className="border-t border-white/[0.08] pt-4"><p className="max-w-sm text-[12px] leading-5 text-steel">Средства в открытых позициях доступны после продажи акций.</p>
                <button type="button" onClick={archive} disabled={updating} className="focus-ring mt-3 rounded-md text-[12px] text-negative disabled:opacity-40">Закрыть агента и вернуть все средства</button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6" aria-label="Загрузка агента">
      <div className="flex items-center gap-4"><div className="skeleton h-16 w-16 rounded-[20px]" /><div className="space-y-2"><div className="skeleton h-8 w-56 rounded-lg" /><div className="skeleton h-4 w-72 rounded-md" /></div></div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[124px] rounded-[20px]" />)}</div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="skeleton h-[330px] rounded-[24px]" /><div className="skeleton h-[330px] rounded-[24px]" /></div>
    </div>
  );
}

function actionLabel(action: string) { return action === "buy" ? "Покупка" : action === "sell" ? "Продажа" : "Анализ"; }
function allocationErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.body && typeof error.body === "object" && "message" in error.body && typeof error.body.message === "string") return error.body.message;
  return "Не удалось изменить капитал. Обновите страницу и проверьте доступный резерв.";
}
function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function signedMoney(value: number): string { return `${value >= 0 ? "+" : "−"}${money(Math.abs(value))}`; }
function dateTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }).format(new Date(value)); }
function formatDayTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
function formatDay(value: string): string { return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(value)); }
