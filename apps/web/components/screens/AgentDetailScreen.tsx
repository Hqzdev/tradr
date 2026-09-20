"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { IconArrowUpRight, IconChevronRight, IconPause, IconShield, IconShuffle, IconTrophy } from "@/components/icons";
import { closeAgent, getAgent, getAgentLog, getAgentPerformance, updateAgentAllocation, updateAgentStatus, type AgentDecision, type AgentPerformance, type ApiAgent } from "@/lib/api/agents";

const strategyIcon = { aggressive: IconTrophy, careful: IconShield, random: IconShuffle };

const strategyLabel: Record<string, string> = {
  aggressive: "Агрессивный",
  careful: "Осторожный",
  random: "Случайный",
};

const strategyColor: Record<string, string> = {
  aggressive: "#D85665",
  careful: "#00856F",
  random: "#8251FB",
};

const statusLabel: Record<string, string> = { active: "Активен", paused: "На паузе", error: "Ошибка" };

export default function AgentDetailScreen({ agentId }: { agentId: string }) {
  const [agent, setAgent] = useState<ApiAgent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [performance, setPerformance] = useState<AgentPerformance | null>(null);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [allocation, setAllocation] = useState(25000);

  useEffect(() => {
    Promise.all([getAgent(agentId), getAgentPerformance(agentId), getAgentLog(agentId)])
      .then(([nextAgent, nextPerformance, nextDecisions]) => { setAgent(nextAgent); setPerformance(nextPerformance); setDecisions(nextDecisions); setAllocation(nextAgent.budgetLimit); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [agentId]);

  const toggleStatus = async () => {
    if (!agent || agent.status === "error") return;
    setUpdating(true);
    try {
      setAgent(await updateAgentStatus(agent.id, agent.status === "active" ? "paused" : "active"));
      setDecisions(await getAgentLog(agent.id));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-body-sm text-steel">Загружаем агента...</p>;

  if (error || !agent) {
    return <EmptyState title="Агент не найден" description="Возможно, он был удалён или у вас нет к нему доступа." actionLabel="К списку агентов" actionHref="/agents" />;
  }

  const Icon = strategyIcon[agent.strategy as keyof typeof strategyIcon] ?? IconShield;
  const color = strategyColor[agent.strategy] ?? "#00856F";
  const isPaused = agent.status === "paused";
  const saveAllocation = async () => {
    setUpdating(true);
    try { setAgent(await updateAgentAllocation(agent.id, allocation)); setPerformance(await getAgentPerformance(agent.id)); }
    finally { setUpdating(false); }
  };
  const archive = async () => {
    if (!window.confirm("Закрыть позиции, вернуть деньги в резерв и архивировать агента?")) return;
    setUpdating(true);
    try { await closeAgent(agent.id); window.location.assign("/dashboard"); }
    finally { setUpdating(false); }
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption font-[485] text-steel">
        <Link href="/agents" className="transition-colors duration-150 hover:text-ink">Агенты</Link>
        <IconChevronRight className="h-3 w-3" />
        <span className="text-ink">{agent.name}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${color}1A` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </span>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-heading font-[485] text-ink">{agent.name}</h1>
              <Badge tone={agent.status}>{statusLabel[agent.status] ?? agent.status}</Badge>
            </div>
            <p className="mt-1 text-body-sm text-steel">{strategyLabel[agent.strategy] ?? agent.strategy}</p>
          </div>
        </div>
        {agent.status !== "error" && (
          <Button variant="outline" icon={isPaused ? <IconArrowUpRight className="h-4 w-4" /> : <IconPause className="h-4 w-4" />} onClick={toggleStatus} disabled={updating}>
            {updating ? "Сохраняем..." : isPaused ? "Запустить" : "Поставить на паузу"}
          </Button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <InfoCard label="Капитал агента" value={money(performance?.totalValue ?? agent.totalValue)} />
        <InfoCard label="Свободные деньги" value={money(performance?.cashBalance ?? agent.cashBalance)} />
        <InfoCard label="Результат" value={signedMoney(performance?.profit ?? agent.profit)} />
        <InfoCard label="Открытые позиции" value={String(performance?.positions.length ?? agent.positionCount)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Открытые позиции</p>
          {!performance?.positions.length ? <EmptyState compact className="mt-4" title="Позиций пока нет" description="Запущенный агент сам найдёт точку входа." /> : <div className="mt-4 divide-y divide-bone">{performance.positions.map((position) => <div key={position.ticker} className="flex items-center justify-between gap-4 py-3"><div><p className="text-body-sm font-[535] text-ink">{position.ticker}</p><p className="text-caption text-steel">{position.quantity} акций · вход {money(position.averagePrice)}</p></div><div className="text-right"><p className="text-body-sm font-[535] text-ink">{money(position.marketValue)}</p><p className={position.profit >= 0 ? "text-caption text-positive" : "text-caption text-negative"}>{signedMoney(position.profit)} · {position.profitPercent.toFixed(2)}%</p></div></div>)}</div>}
        </Card>
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Решения</p>
          {!decisions.length ? <EmptyState compact className="mt-4" title="Решений пока нет" description="Здесь будет журнал анализа, покупок и продаж." /> : <div className="mt-4 divide-y divide-bone">{decisions.slice(0, 12).map((decision) => <div key={decision.id} className="py-3"><div className="flex items-center justify-between gap-3"><span className={`rounded-pill px-2 py-1 text-[11px] font-[535] ${decision.action === "buy" ? "bg-positive-tint text-positive" : decision.action === "sell" ? "bg-magenta-tint text-magenta-deep" : "bg-[#f3eff5] text-steel"}`}>{decision.action === "buy" ? "Покупка" : decision.action === "sell" ? "Продажа" : "Анализ"}</span><time className="text-caption text-fog">{dateTime(decision.timestamp)}</time></div><p className="mt-2 text-body-sm text-ink">{decision.reason}</p></div>)}</div>}
        </Card>
      </div>

      {isPaused && <Card className="mt-6 p-6"><p className="text-subheading font-[485] text-ink">Капитал агента</p><p className="mt-1 text-body-sm text-steel">Менять лимит можно только на паузе. Деньги переводятся между резервом и свободным остатком агента.</p><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="block flex-1"><span className="text-caption text-steel">Лимит, $</span><input className="focus-ring mt-1.5 h-11 w-full rounded-btn border border-bone px-3 text-body-sm" type="number" min={1000} max={100000} value={allocation} onChange={(event) => setAllocation(Number(event.target.value))} /></label><Button variant="primary" onClick={saveAllocation} disabled={updating}>Обновить лимит</Button><Button variant="destructive" onClick={archive} disabled={updating}>Закрыть агента</Button></div></Card>}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-caption text-steel">{label}</p>
      <p className="mt-1.5 text-body-sm font-[485] text-ink">{value}</p>
    </Card>
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function signedMoney(value: number): string { return `${value >= 0 ? "+" : "−"}${money(Math.abs(value))}`; }
function dateTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" }).format(new Date(value)); }
