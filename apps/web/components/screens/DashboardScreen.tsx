"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import DeltaPill from "@/components/ui/DeltaPill";
import EmptyState from "@/components/ui/EmptyState";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import Toggle from "@/components/ui/Toggle";
import { IconAgents, IconArrowRight, IconArrowUpRight, IconFlash, IconPause, IconTrendUp, IconWallet } from "@/components/icons";
import { getDashboard, updatePreferences, type Dashboard } from "@/lib/api/dashboard";
import { updateAgentStatus } from "@/lib/api/agents";
import { getStrategy } from "@/lib/agentVisuals";
import ActivityRow from "@/components/agents/ActivityRow";
import clsx from "@/lib/clsx";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileDashboard from "@/components/mobile/MobileDashboard";
import { MSkeleton } from "@/components/mobile/ui";

const money = (value: number) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

export default function DashboardScreen() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const next = await getDashboard();
      setData(next);
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

  const mobile = useIsMobile();
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

  if (loading) return mobile ? <MSkeleton /> : <DashboardSkeleton />;
  if (error || !data) return <EmptyState title="Не удалось открыть обзор" description="Проверьте подключение к серверу и обновите страницу." />;

  if (mobile) return <MobileDashboard data={data} primaryAgent={primaryAgent} busy={busy} onToggleAgent={changeStatus} onSpeedChange={changeSpeed} />;

  const anyActive = data.agents.some((agent) => agent.status === "active");
  const strategy = primaryAgent ? getStrategy(primaryAgent.strategy) : null;
  const StrategyIcon = strategy?.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={anyActive ? "Агенты работают · обновляется каждые 4 секунды" : "Обзор · ваша цель"}
        title={`Уровень ${data.level}`}
        dim={`· цель ${money(data.goalValue)}`}
        lead="Цель растёт автоматически вместе с капиталом. Повышайте уровень, получайте всё большие награды, а агенты будут торговать за вас."
        action={<Link href="/agents"><Button variant="outline" icon={<IconAgents className="h-4 w-4" />}>Все агенты</Button></Link>}
      />

      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
        <Card className="q-reveal overflow-hidden p-6 sm:p-7" style={{ ["--i" as string]: 1, background: "radial-gradient(90% 120% at 0% 0%, rgba(108,92,255,0.22) 0%, rgba(108,92,255,0) 55%), linear-gradient(180deg,#131318 0%,#0d0d10 100%)" }}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/[0.1] bg-white/[0.05] text-ink"><IconWallet className="h-[18px] w-[18px]" /></span>
              <div>
                <p className="text-[15px] font-medium text-ink">Общий учебный капитал</p>
                <p className="text-[12.5px] text-steel">Старт {money(data.startingCapital)}</p>
              </div>
            </div>
            <span className={clsx("flex items-center gap-2 text-[12.5px]", anyActive ? "text-positive" : "text-steel")}>
              <span className={anyActive ? "q-live" : "h-[7px] w-[7px] rounded-full bg-fog"} />
              {anyActive ? "Live" : "Пауза"}
            </span>
          </div>

          <p className="mt-6 text-[46px] font-semibold leading-none tracking-[-0.05em] text-ink sm:text-[60px]">
            <Money value={data.totalWealth} dimClassName="text-fog" />
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <DeltaPill value={data.profitPercent} />
            <span className={clsx("text-[14px]", data.profit >= 0 ? "text-positive" : "text-negative")}>
              <Money value={data.profit} signed />
            </span>
            <span className="text-[13px] text-steel">с начала симуляции</span>
          </div>

          <div className="mt-8">
            <div className="mb-2.5 flex items-center justify-between gap-3 text-[13.5px]">
              <span className="flex items-center gap-2 text-steel"><span className="rounded-full border border-magenta/30 bg-magenta/[0.08] px-2.5 py-1 text-[11.5px] font-medium text-magenta-deep">Уровень {data.level}</span>Прогресс к цели</span>
              <span className="font-medium text-ink">{money(data.goalValue)}</span>
            </div>
            <ProgressBar percent={data.goalProgress} height={8} />
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
              <span className="text-steel">{data.goalProgress.toFixed(1).replace(".", ",")}% до следующего уровня</span>
              <span className="font-medium text-positive">Награда: +{money(data.nextLevelReward)}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Metric label="В резерве" value={<Money value={data.reserveCash} />} />
            <Metric label="У агентов сейчас" value={<Money value={data.totalWealth - data.reserveCash} />} />
          </div>
          <p className="mt-3 text-[12px] leading-5 text-steel">Новый бюджет выдаётся из резерва. Прибыль в кошельках агентов можно перевести в резерв на странице агента.</p>

        </Card>

        <Card className="q-reveal q-card-hover flex flex-col p-6 sm:p-7" style={{ ["--i" as string]: 2 }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-steel">Следующий шаг</p>
              <h2 className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em] text-ink">{primaryAgent?.status === "active" ? "Агент уже работает" : "Запустите первого агента"}</h2>
            </div>
            <span className={clsx("mt-2", primaryAgent?.status === "active" ? "text-positive" : "text-fog")}>
              <span className={primaryAgent?.status === "active" ? "q-live" : "block h-[7px] w-[7px] rounded-full bg-current"} />
            </span>
          </div>
          {primaryAgent && strategy && StrategyIcon ? (
            <>
              <div className="mt-5 flex items-center gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.025] p-3.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] border" style={{ background: `${strategy.color}24`, borderColor: `${strategy.color}55` }}>
                  <StrategyIcon className="h-5 w-5" style={{ color: strategy.color }} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-ink">{primaryAgent.name}</p>
                  <p className="text-[12.5px] text-steel">{strategy.label} · сам выбирает акции и момент выхода</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                <Metric label="Кошелёк" value={<Money value={primaryAgent.totalValue} decimals={0} />} compact />
                <Metric label="Результат" value={<Money value={primaryAgent.profit} signed decimals={0} />} compact tone={primaryAgent.profit >= 0 ? "positive" : "negative"} />
                <Metric label="Позиций" value={String(primaryAgent.positionCount)} compact />
              </div>
              <div className="flex-1" />
              <Button className="mt-6" size="lg" fullWidth variant={primaryAgent.status === "active" ? "outline" : "primary"} icon={primaryAgent.status === "active" ? <IconPause className="h-5 w-5" /> : <IconArrowUpRight className="h-5 w-5" />} onClick={changeStatus} disabled={busy}>
                {busy ? "Сохраняем…" : primaryAgent.status === "active" ? "Поставить на паузу" : "Запустить агента"}
              </Button>
              <Link href={`/agents/${primaryAgent.id}`} className="group mt-3 flex items-center justify-center gap-1.5 text-[13px] font-medium text-steel transition-colors hover:text-ink">
                Посмотреть позиции и решения <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <EmptyState compact className="mt-5" title="Создайте первого агента" description="Выделите ему часть резерва и выберите характер торговли." actionLabel="Создать агента" actionHref="/agents/new" />
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.45fr]">
        <Card className="q-reveal p-6 sm:p-7" style={{ ["--i" as string]: 3 }}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[12px] border border-white/[0.1] bg-white/[0.05] text-ink"><IconFlash className="h-[18px] w-[18px]" /></span>
            <p className="text-[16px] font-semibold text-ink">Скорость симуляции</p>
          </div>
          <div className={clsx("mt-5 rounded-[16px] border px-4 py-1 transition-colors duration-300", data.accelerationEnabled ? "border-magenta/40 bg-magenta/[0.08]" : "border-white/[0.07] bg-white/[0.025]")}>
            <Toggle label={data.accelerationEnabled ? "Ускорение ×20" : "Обычное время"} hint={data.accelerationEnabled ? "Агенты анализируют рынок примерно каждые 2,6 секунды" : "Агенты принимают решения примерно раз в минуту"} checked={data.accelerationEnabled} onChange={changeSpeed} />
          </div>
          <div className="mt-4 flex gap-3 rounded-[16px] border border-white/[0.07] bg-white/[0.02] p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-positive/[0.12] text-positive"><IconTrendUp className="h-4 w-4" /></span>
            <div>
              <p className="text-[14px] font-medium text-ink">Это реалистичная симуляция</p>
              <p className="mt-1 text-[12.5px] leading-5 text-steel">Комиссии и убыточные сделки учитываются. Результат не гарантирован — сравнивайте стратегии и наблюдайте.</p>
            </div>
          </div>
        </Card>

        <Card className="q-reveal p-6 sm:p-7" style={{ ["--i" as string]: 4 }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <p className="text-[16px] font-semibold text-ink">Что делают агенты</p>
                {anyActive && <span className="flex items-center gap-1.5 rounded-full bg-negative/[0.12] px-2 py-0.5 text-[10.5px] font-bold tracking-wider text-negative"><span className="q-live h-[5px] w-[5px]" />LIVE</span>}
              </div>
              <p className="mt-1 text-[12.5px] text-steel">Живая лента анализа, покупок и продаж</p>
            </div>
            <Link href="/history" className="group flex items-center gap-1.5 text-[13px] font-medium text-magenta-deep transition-colors hover:text-ink">Вся активность <IconArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
          {data.activity.length === 0 ? (
            <EmptyState compact className="mt-5" title="Активность появится после запуска" description="Первое решение обычно появляется в течение минуты, в ускоренном режиме — быстрее." />
          ) : (
            <div className="mt-4 divide-y divide-white/[0.06]">
              {data.activity.slice(0, 7).map((item, index) => (
                <ActivityRow key={item.id} index={index} name={item.agentName} action={item.action} reason={item.reason} time={relativeTime(item.timestamp)} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, compact = false, tone }: { label: string; value: React.ReactNode; compact?: boolean; tone?: "positive" | "negative" }) {
  return (
    <div className={clsx("rounded-[14px] border border-white/[0.06] bg-white/[0.025]", compact ? "p-3" : "p-4")}>
      <p className="text-[12px] text-steel">{label}</p>
      <p className={clsx("q-num mt-1 font-semibold", compact ? "text-[14px]" : "text-[17px]", tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : "text-ink")}>{value}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Загрузка обзора">
      <div className="space-y-3"><div className="skeleton h-5 w-48 rounded-md" /><div className="skeleton h-12 w-[min(560px,100%)] rounded-xl" /></div>
      <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]"><div className="skeleton h-[420px] rounded-[24px]" /><div className="skeleton h-[420px] rounded-[24px]" /></div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.45fr]"><div className="skeleton h-[260px] rounded-[24px]" /><div className="skeleton h-[260px] rounded-[24px]" /></div>
    </div>
  );
}

function relativeTime(value: string) { return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
