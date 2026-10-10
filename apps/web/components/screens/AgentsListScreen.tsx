"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DeltaPill from "@/components/ui/DeltaPill";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import StatTile from "@/components/StatTile";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { IconAgents, IconArrowRight, IconPause, IconPlus, IconSparkles, IconWallet, IconActivity } from "@/components/icons";
import { listAgents, type ApiAgent } from "@/lib/api/agents";
import { getStrategy, statusLabel } from "@/lib/agentVisuals";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileAgents from "@/components/mobile/MobileAgents";

export default function AgentsListScreen() {
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    listAgents()
      .then(setAgents)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (mobile) return <MobileAgents agents={agents} loading={loading} error={error} />;

  const activeCount = agents.filter((agent) => agent.status === "active").length;
  const pausedCount = agents.filter((agent) => agent.status === "paused").length;
  const capital = agents.reduce((sum, agent) => sum + agent.totalValue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Агенты · управление"
        title="Торговые"
        dim="агенты"
        lead="Каждый агент торгует только своим капиталом: сам покупает, продаёт и ограничивает риск."
        action={
          <Link href="/agents/new">
            <Button variant="primary" icon={<IconPlus className="h-4 w-4" />}>Создать агента</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile index={1} icon={<IconAgents className="h-[15px] w-[15px]" />} label="Всего агентов" value={loading ? "…" : String(agents.length)} caption="созданы вами" />
        <StatTile index={2} icon={<IconActivity className="h-[15px] w-[15px]" />} label="Активных" value={loading ? "…" : String(activeCount)} caption="торгуют прямо сейчас" tone={activeCount ? "positive" : "default"} />
        <StatTile index={3} icon={<IconPause className="h-[15px] w-[15px]" />} label="На паузе" value={loading ? "…" : String(pausedCount)} caption="не совершают действий" />
        <StatTile index={4} icon={<IconWallet className="h-[15px] w-[15px]" />} label="Капитал агентов" value={loading ? "…" : <Money value={capital} decimals={0} />} caption="свободные деньги + позиции" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <div className="q-reveal flex items-center gap-2.5" style={{ ["--i" as string]: 5 }}>
            <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">Все агенты</h2>
            {!loading && <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[12px] font-medium text-ink">{agents.length}</span>}
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-[250px] rounded-[24px]" />)}</div>
          ) : error ? (
            <EmptyState title="Не удалось загрузить агентов" description="Проверьте, что backend запущен, и обновите страницу." />
          ) : agents.length === 0 ? (
            <EmptyState title={emptyStates.agents.title} description={emptyStates.agents.description} actionLabel="Создать агента" actionHref="/agents/new" />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent, index) => (
                <AgentCard key={agent.id} agent={agent} index={index + 6} />
              ))}
              <Link href="/agents/new" className="q-reveal focus-ring group grid min-h-[250px] place-items-center rounded-[24px] border border-dashed border-white/[0.1] text-center transition-[border-color,background-color] duration-300 hover:border-magenta/50 hover:bg-magenta/[0.05]" style={{ ["--i" as string]: agents.length + 6 }}>
                <span>
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] border border-white/[0.1] bg-white/[0.04] text-steel transition-[color,transform] duration-300 group-hover:rotate-90 group-hover:text-magenta-deep"><IconPlus className="h-5 w-5" /></span>
                  <span className="mt-3 block text-[15px] font-medium text-ink">Новый агент</span>
                  <span className="mt-1 block text-[12.5px] text-steel">Выберите стратегию и капитал</span>
                </span>
              </Link>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <Card className="q-reveal p-5" style={{ ["--i" as string]: 6 }}>
            <p className="text-[16px] font-semibold text-ink">Активность агентов</p>
            <EmptyState compact className="mt-4" title="Пока без активности" description="Решения и сделки появятся здесь, когда агент начнёт работать." />
          </Card>
          <Link href="/agents/pro" className="focus-ring block rounded-[24px]">
            <Card interactive className="q-reveal overflow-hidden p-5" style={{ ["--i" as string]: 7, background: "radial-gradient(120% 100% at 0% 0%, rgba(108,92,255,0.3) 0%, rgba(108,92,255,0) 60%), linear-gradient(180deg,#141320 0%,#0d0d10 100%)", borderColor: "rgba(108,92,255,0.3)" }}>
              <span className="flex items-center gap-2 text-[12.5px] font-medium text-magenta-deep"><IconSparkles className="h-4 w-4" />Скоро · Beta</span>
              <p className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-ink">Pro-агенты</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-steel">Агенты с прокачанными навыками и собственными правилами торговли.</p>
              <span className="mt-4 flex items-center gap-1.5 text-[13.5px] font-medium text-ink">Узнать больше <IconArrowRight className="h-4 w-4" /></span>
            </Card>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function AgentCard({ agent, index }: { agent: ApiAgent; index: number }) {
  const strategy = getStrategy(agent.strategy);
  const Icon = strategy.icon;
  const invested = agent.totalValue > 0 ? (agent.holdingsValue / agent.totalValue) * 100 : 0;
  const base = agent.totalValue - agent.profit;
  const profitPercent = base > 0 ? (agent.profit / base) * 100 : 0;

  return (
    <Link href={`/agents/${agent.id}`} className="focus-ring block rounded-[24px]">
      <Card interactive className="q-reveal relative h-full overflow-hidden p-5" style={{ ["--i" as string]: index, background: `radial-gradient(110% 80% at 0% 0%, ${strategy.color}22 0%, transparent 60%), linear-gradient(180deg,#141418 0%,#0e0e11 100%)` }}>
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-[14px] border" style={{ background: `${strategy.color}24`, borderColor: `${strategy.color}55` }}>
            <Icon className="h-[22px] w-[22px]" style={{ color: strategy.color }} />
          </span>
          <Badge tone={agent.status}>{statusLabel[agent.status] ?? agent.status}</Badge>
        </div>
        <p className="mt-4 text-[19px] font-semibold tracking-[-0.02em] text-ink">{agent.name}</p>
        <p className="mt-0.5 text-[13px] text-steel">{strategy.label} · создан {formatDate(agent.createdAt)}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <p className="text-[28px] font-semibold leading-none tracking-[-0.04em] text-ink"><Money value={agent.totalValue} decimals={0} /></p>
          <DeltaPill value={profitPercent} />
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-[12.5px]">
            <span className="text-steel">В позициях · {agent.positionCount}</span>
            <span className="q-num text-charcoal">{invested.toFixed(0)}%</span>
          </div>
          <ProgressBar percent={invested} height={5} color={strategy.color} />
        </div>
      </Card>
    </Link>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(value));
}
