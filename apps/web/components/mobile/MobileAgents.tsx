"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IconArrowRight, IconCrown, IconPlus, IconSparkles } from "@/components/icons";
import type { ApiAgent } from "@/lib/api/agents";
import { getDashboard, type Dashboard } from "@/lib/api/dashboard";
import { getStrategy, statusLabel } from "@/lib/agentVisuals";
import { MAgentAvatar, MCard, MCircleButton, MEmpty, MSegmented, MSkeleton, MStatusDot, MTitle, signedUsd, usd } from "./ui";

const FILTERS = ["Активные", "На паузе", "Все"] as const;

export default function MobileAgents({ agents, loading, error }: { agents: ApiAgent[]; loading: boolean; error: boolean }) {
  const [filter, setFilter] = useState<string>("Все");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => { getDashboard().then(setDashboard).catch(() => setDashboard(null)); }, []);

  const rows = useMemo(
    () => agents.filter((agent) => (filter === "Активные" ? agent.status === "active" : filter === "На паузе" ? agent.status !== "active" : true)),
    [agents, filter]
  );
  const capital = agents.reduce((sum, agent) => sum + agent.totalValue, 0);
  const activeCount = agents.filter((agent) => agent.status === "active").length;

  return (
    <div className="m-ui space-y-5">
      <div className="flex items-center justify-between">
        <MTitle>Агенты</MTitle>
        <MCircleButton label="Создать агента" href="/agents/new" accent><IconPlus className="h-5 w-5" /></MCircleButton>
      </div>

      {dashboard ? (
        <div
          className="overflow-hidden rounded-[28px] border border-white/[0.07] p-[22px]"
          style={{ background: "radial-gradient(160% 150% at 95% 5%, rgba(123,107,255,0.8) 0%, rgba(108,92,255,0.2) 45%, rgba(108,92,255,0) 100%), #141418" }}
        >
          <p className="text-[20px] font-extrabold text-[#F4F4F6]">Цель уровня {dashboard.level} · {usd(dashboard.goalValue, 0)}</p>
          <p className="mt-1 text-[13px] font-semibold text-[#8C8C97]">{agents.length} агентов · {activeCount} торгуют</p>
          <p className="mt-1 text-[88px] font-extrabold leading-[1.05] tracking-[-0.05em] text-[#B3A9FF]">{Math.floor(dashboard.goalProgress)}%</p>
          <div className="h-2 overflow-hidden rounded-full bg-white/[0.1]">
            <div className="h-full rounded-full bg-[#B3A9FF]" style={{ width: `${Math.min(100, Math.max(0, dashboard.goalProgress))}%` }} />
          </div>
          <div className="mt-3 flex justify-between gap-2 text-[13px]">
            <span className="q-num font-bold text-[#F4F4F6]">{usd(dashboard.totalWealth, 0)} из {usd(dashboard.goalValue, 0)}</span>
            <span className="font-semibold text-[#8C8C97]">у агентов {usd(capital, 0)}</span>
          </div>
        </div>
      ) : (
        <div className="skeleton h-[250px] rounded-[28px]" />
      )}

      <MSegmented options={FILTERS} value={filter} onChange={setFilter} />

      {loading ? (
        <MSkeleton blocks={[300]} />
      ) : error ? (
        <MEmpty title="Не удалось загрузить агентов" description="Проверьте, что backend запущен, и обновите страницу." />
      ) : agents.length === 0 ? (
        <MEmpty title="Агентов пока нет" description="Создайте первого агента: выберите стратегию и выделите капитал." actionLabel="Создать агента" actionHref="/agents/new" />
      ) : rows.length === 0 ? (
        <p className="rounded-[20px] bg-[#16161B] px-5 py-6 text-center text-[13px] font-medium text-[#8C8C97]">В этом фильтре агентов нет</p>
      ) : (
        <MCard className="px-4 py-1">
          {rows.map((agent, index) => {
            const strategy = getStrategy(agent.strategy);
            const Icon = strategy.icon;
            return (
              <Link key={agent.id} href={`/agents/${agent.id}`} className={`focus-ring flex items-center gap-3.5 py-3.5 ${index < rows.length - 1 ? "border-b border-white/[0.07]" : ""}`}>
                <MAgentAvatar color={strategy.color}><Icon className="h-[22px] w-[22px]" /></MAgentAvatar>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-[#F4F4F6]">{agent.name}</span>
                  <span className="block truncate text-[12px] font-medium text-[#8C8C97]">{strategy.label === agent.name ? "" : `${strategy.label} · `}{agent.positionCount} поз.</span>
                </span>
                <span className="flex flex-col items-end gap-1">
                  <span className={`q-num text-[15px] font-extrabold ${agent.profit >= 0 ? "text-[#F4F4F6]" : "text-[#F6465D]"}`}>{signedUsd(agent.profit, 0)}</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C8C97]"><MStatusDot status={agent.status} />{(statusLabel[agent.status] ?? agent.status).toLowerCase()}</span>
                </span>
              </Link>
            );
          })}
        </MCard>
      )}

      <Link href="/agents/new" className="focus-ring flex items-center gap-3.5 rounded-[24px] border border-[#6C5CFF]/40 bg-[#16161B] p-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-[#6C5CFF]/[0.16] text-[#B3A9FF]"><IconSparkles className="h-[22px] w-[22px]" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-[#F4F4F6]">Собрать нового агента</span>
          <span className="mt-0.5 block text-[12px] font-medium leading-[1.4] text-[#8C8C97]">Выберите характер торговли и выделите часть резерва</span>
        </span>
        <IconArrowRight className="h-5 w-5 text-[#8C8C97]" />
      </Link>

      <Link href="/agents/pro" className="focus-ring flex items-center gap-3.5 rounded-[24px] p-4" style={{ background: "radial-gradient(120% 120% at 100% 0%, rgba(108,92,255,0.4) 0%, rgba(108,92,255,0) 70%), #16161B" }}>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/[0.12] text-white"><IconCrown className="h-[22px] w-[22px]" /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-bold text-[#F4F4F6]">Pro-агенты <span className="ml-1 rounded-full bg-[#6C5CFF] px-2 py-0.5 text-[10px] font-extrabold text-white">Beta</span></span>
          <span className="mt-0.5 block text-[12px] font-medium text-[#8C8C97]">Прокачанные навыки и свои правила</span>
        </span>
        <IconArrowRight className="h-5 w-5 text-[#8C8C97]" />
      </Link>
    </div>
  );
}
