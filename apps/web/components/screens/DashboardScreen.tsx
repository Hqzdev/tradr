"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import ProgressBar from "@/components/ui/ProgressBar";
import Toggle from "@/components/ui/Toggle";
import { IconAgents, IconArrowUpRight, IconPause, IconTrendUp } from "@/components/icons";
import { getDashboard, updatePreferences, type Dashboard } from "@/lib/api/dashboard";
import { updateAgentStatus } from "@/lib/api/agents";

const money = (value: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
const signedMoney = (value: number) => `${value >= 0 ? "+" : "−"}${money(Math.abs(value))}`;

export default function DashboardScreen() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goal, setGoal] = useState(110000);

  const load = useCallback(async () => {
    try {
      const next = await getDashboard();
      setData(next);
      setGoal(next.goalValue);
      setError(false);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!data?.agents.some((agent) => agent.status === "active")) return;
    const timer = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(timer);
  }, [data?.agents, load]);

  const primaryAgent = useMemo(() => data?.agents.find((agent) => agent.budgetLimit > 0) ?? data?.agents[0], [data]);

  const changeStatus = async () => {
    if (!primaryAgent) return;
    setBusy(true);
    try {
      await updateAgentStatus(primaryAgent.id, primaryAgent.status === "active" ? "paused" : "active");
      await load();
    } finally { setBusy(false); }
  };

  const changeSpeed = async (enabled: boolean) => {
    if (!data) return;
    setData({ ...data, accelerationEnabled: enabled });
    try { setData(await updatePreferences({ accelerationEnabled: enabled })); }
    catch { setData({ ...data }); }
  };

  const saveGoal = async () => {
    if (!Number.isFinite(goal) || goal < 1000) return;
    setBusy(true);
    try { setData(await updatePreferences({ goalValue: goal })); setEditingGoal(false); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="py-16 text-center text-body text-steel">Собираем картину вашего капитала…</div>;
  if (error || !data) return <EmptyState title="Не удалось открыть обзор" description="Проверьте подключение к серверу и обновите страницу." />;

  return (
    <div className="pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Обзор / Ваша цель</p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Заработайте первые $10 000 с агентами</h1>
          <p className="mt-2 max-w-[650px] text-body text-steel">Вы задаёте цель и капитал. Агенты сами анализируют рынок, покупают и продают — вам остаётся следить за результатом.</p>
        </div>
        <Link href="/agents"><Button variant="outline" icon={<IconAgents className="h-4 w-4" />}>Все агенты</Button></Link>
      </header>

      <Card className="relative mt-6 overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#FAD7F0] opacity-60 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="text-body-sm text-steel">Общий учебный капитал</p>
            <p className="mt-2 text-[44px] font-[485] leading-none tracking-[-0.04em] text-ink sm:text-[64px]">{money(data.totalWealth)}</p>
            <p className={`mt-3 text-body font-[535] ${data.profit >= 0 ? "text-positive" : "text-negative"}`}>{signedMoney(data.profit)} · {data.profitPercent >= 0 ? "+" : ""}{data.profitPercent.toFixed(2)}%</p>
            <div className="mt-7 max-w-[720px]">
              <div className="mb-2 flex items-center justify-between gap-3 text-body-sm">
                <span className="text-steel">Прогресс к цели</span>
                <button className="focus-ring rounded-md font-[485] text-ink hover:text-magenta-deep" onClick={() => setEditingGoal(true)}>{money(data.goalValue)}</button>
              </div>
              <ProgressBar percent={data.goalProgress} height={10} />
              <p className="mt-2 text-caption text-steel">{data.goalProgress.toFixed(1)}% пути · старт {money(data.startingCapital)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="В резерве" value={money(data.reserveCash)} />
            <Metric label="У агентов" value={money(data.allocatedCapital)} />
          </div>
        </div>
        {editingGoal && (
          <div className="relative mt-6 flex flex-col gap-3 border-t border-bone pt-5 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-[300px]"><Input label="Новая цель капитала" type="number" min={1000} max={10000000} value={goal} onChange={(event) => setGoal(Number(event.target.value))} /><div className="mt-2 flex gap-2">{[5, 10, 20].map((percent) => <button key={percent} type="button" onClick={() => setGoal(Math.round(data.startingCapital * (1 + percent / 100)))} className="focus-ring rounded-pill border border-bone px-3 py-1 text-caption text-steel transition-colors hover:border-magenta/30 hover:text-magenta-deep">+{percent}%</button>)}</div></div>
            <div className="flex gap-2"><Button variant="primary" onClick={saveGoal} disabled={busy}>Сохранить</Button><Button onClick={() => setEditingGoal(false)}>Отмена</Button></div>
          </div>
        )}
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Следующий шаг</p><h2 className="mt-2 text-[28px] font-[485] tracking-[-0.03em] text-ink">{primaryAgent?.status === "active" ? "Агент уже работает" : "Запустите первого агента"}</h2></div>
            <span className={`mt-1 h-3 w-3 rounded-full ${primaryAgent?.status === "active" ? "animate-pulse bg-positive" : "bg-fog"}`} />
          </div>
          {primaryAgent ? (
            <>
              <p className="mt-3 text-body text-steel">{primaryAgent.name} · {strategyLabel(primaryAgent.strategy)}. Он сам выберет акции, размер сделки и момент выхода.</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Metric label="Кошелёк" value={money(primaryAgent.totalValue)} compact />
                <Metric label="Результат" value={signedMoney(primaryAgent.profit)} compact tone={primaryAgent.profit >= 0 ? "positive" : "negative"} />
                <Metric label="Позиций" value={String(primaryAgent.positionCount)} compact />
              </div>
              <Button className="mt-6" size="lg" fullWidth variant={primaryAgent.status === "active" ? "outline" : "primary"} icon={primaryAgent.status === "active" ? <IconPause className="h-5 w-5" /> : <IconArrowUpRight className="h-5 w-5" />} onClick={changeStatus} disabled={busy}>
                {busy ? "Сохраняем…" : primaryAgent.status === "active" ? "Поставить на паузу" : "Запустить агента"}
              </Button>
              <Link href={`/agents/${primaryAgent.id}`} className="mt-3 block text-center text-caption font-[485] text-steel transition-colors hover:text-magenta-deep">Посмотреть позиции и решения →</Link>
            </>
          ) : (
            <EmptyState compact className="mt-5" title="Создайте первого агента" description="Выделите ему часть резерва и выберите характер торговли." actionLabel="Создать агента" actionHref="/agents/new" />
          )}
        </Card>

        <Card className="p-6 sm:p-7">
          <p className="text-subheading font-[485] text-ink">Скорость симуляции</p>
          <div className="mt-3 rounded-[18px] bg-[#F8F6F8] px-4 py-2">
            <Toggle label={data.accelerationEnabled ? "Ускорение ×20" : "Обычное время"} hint={data.accelerationEnabled ? "Агенты анализируют рынок примерно каждые 2,6 секунды" : "Агенты принимают решения примерно раз в минуту"} checked={data.accelerationEnabled} onChange={changeSpeed} />
          </div>
          <div className="mt-6 rounded-[18px] border border-[#F1D8E9] bg-[#FFF7FC] p-4">
            <div className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-magenta-deep"><IconTrendUp className="h-4 w-4" /></span><div><p className="text-body-sm font-[535] text-ink">Это реалистичная симуляция</p><p className="mt-1 text-caption leading-5 text-steel">Комиссии и убыточные сделки учитываются. Результат не гарантирован — сравнивайте стратегии и наблюдайте.</p></div></div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4"><div><p className="text-subheading font-[485] text-ink">Что делают агенты</p><p className="mt-1 text-caption text-steel">Живая лента анализа, покупок и продаж</p></div><Link href="/history" className="text-caption font-[485] text-magenta-deep">Вся активность →</Link></div>
        {data.activity.length === 0 ? <EmptyState compact className="mt-5" title="Активность появится после запуска" description="Первое решение обычно появляется в течение минуты, в ускоренном режиме — быстрее." /> : (
          <div className="mt-5 divide-y divide-bone">{data.activity.slice(0, 8).map((item) => <div key={item.id} className="flex gap-3 py-3"><span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${item.action === "buy" ? "bg-positive" : item.action === "sell" ? "bg-magenta" : "bg-fog"}`} /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-body-sm font-[535] text-ink">{item.agentName}</p><time className="text-caption text-fog">{relativeTime(item.timestamp)}</time></div><p className="mt-0.5 text-body-sm text-steel">{item.reason}</p></div></div>)}</div>
        )}
      </Card>
    </div>
  );
}

function Metric({ label, value, compact = false, tone }: { label: string; value: string; compact?: boolean; tone?: "positive" | "negative" }) {
  return <div className={`rounded-[18px] bg-[#F8F6F8] ${compact ? "p-3" : "p-4"}`}><p className="text-caption text-steel">{label}</p><p className={`mt-1 font-[535] tabular-nums ${compact ? "text-body-sm" : "text-body"} ${tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "text-ink"}`}>{value}</p></div>;
}
function strategyLabel(value: string) { return ({ careful: "осторожная стратегия", aggressive: "агрессивная стратегия", random: "случайная стратегия" }[value] ?? value); }
function relativeTime(value: string) { return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
