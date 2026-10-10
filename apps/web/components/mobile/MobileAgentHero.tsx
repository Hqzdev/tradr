"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import AreaChart from "@/components/charts/AreaChart";
import Money from "@/components/ui/Money";
import { IconArrowUpRight, IconCoins, IconPause } from "@/components/icons";
import type { AgentPerformance, ApiAgent } from "@/lib/api/agents";
import { getStrategy, statusLabel } from "@/lib/agentVisuals";
import clsx from "@/lib/clsx";
import { MAgentAvatar, MCard, MCircleButton, signedUsd, usd } from "./ui";

// Top part of the agent screen on mobile ("M05 Агент"): identity, equity
// chart, two stat cards and the run/pause action. Positions, the decision log
// and capital management below it are shared with the desktop screen.
export default function MobileAgentHero({
  agent,
  performance,
  updating,
  onToggleStatus,
}: {
  agent: ApiAgent;
  performance: AgentPerformance | null;
  updating: boolean;
  onToggleStatus: () => void;
}) {
  const strategy = getStrategy(agent.strategy);
  const Icon = strategy.icon;
  const total = performance?.totalValue ?? agent.totalValue;
  const profit = performance?.profit ?? agent.profit;
  const percent = performance?.profitPercent ?? 0;
  const curve = performance?.equityCurve ?? [];
  const isPaused = agent.status === "paused";
  const statusColor = agent.status === "active" ? "#2EBD85" : agent.status === "error" ? "#F6465D" : "#F0B429";

  return (
    <div className="m-ui space-y-[18px]">
      <div className="flex items-center justify-between">
        <MCircleButton label="К списку агентов" href="/agents"><HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" strokeWidth={2} /></MCircleButton>
        <p className="text-[17px] font-bold text-[#F4F4F6]">Агент</p>
        <span className="h-11 w-11" aria-hidden />
      </div>

      <div className="flex items-center gap-3.5">
        <MAgentAvatar color={strategy.color} size={60} radius={20}><Icon className="h-7 w-7" /></MAgentAvatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[22px] font-extrabold tracking-[-0.02em] text-[#F4F4F6]">{agent.name}</p>
          <p className="truncate text-[13px] font-medium text-[#8C8C97]">{strategy.label} · {strategy.tagline}</p>
        </div>
        <span className="flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold" style={{ background: `${statusColor}1F`, color: statusColor }}>
          <span className="h-[7px] w-[7px] rounded-full bg-current" />
          {statusLabel[agent.status] ?? agent.status}
        </span>
      </div>

      <MCard className="p-[18px]">
        <p className="text-[13px] font-semibold text-[#8C8C97]">Капитал агента</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <p className="text-[28px] font-extrabold tracking-[-0.03em] text-[#F4F4F6]"><Money value={total} decimals={0} /></p>
          <p className={clsx("text-[14px] font-bold", profit >= 0 ? "text-[#B3A9FF]" : "text-[#F6465D]")}>{profit >= 0 ? "▲" : "▼"} {signedUsd(profit)}</p>
        </div>
        <div className="mt-3">
          {curve.length > 1 ? (
            <AreaChart
              values={curve.map((point) => point.totalValue)}
              height={120}
              color="#9C90FF"
              compact
              showAxis={false}
              formatValue={(value) => usd(value, 0)}
              labels={curve.map((point) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(point.capturedAt)))}
            />
          ) : (
            <p className="grid h-[120px] place-items-center rounded-[16px] bg-[#212128] text-[13px] font-medium text-[#8C8C97]">График появится после первых сделок</p>
          )}
        </div>
      </MCard>

      <div className="grid grid-cols-2 gap-3">
        <MCard className="p-4">
          <p className="text-[13px] font-semibold text-[#8C8C97]">Результат</p>
          <p className={clsx("q-num mt-1 text-[24px] font-extrabold tracking-[-0.02em]", percent >= 0 ? "text-[#F4F4F6]" : "text-[#F6465D]")}>
            {percent >= 0 ? "+" : "−"}{Math.abs(percent).toFixed(2).replace(".", ",")}%
          </p>
          <p className="mt-0.5 text-[12px] font-semibold text-[#8C8C97]">старт {usd(performance?.initialCapital ?? agent.budgetLimit, 0)}</p>
        </MCard>
        <MCard className="p-4">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8C8C97]"><IconCoins className="h-3.5 w-3.5" />Свободно</p>
          <p className="q-num mt-1 text-[24px] font-extrabold tracking-[-0.02em] text-[#F4F4F6]">{usd(performance?.cashBalance ?? agent.cashBalance, 0)}</p>
          <p className="mt-0.5 text-[12px] font-semibold text-[#8C8C97]">позиций: {performance?.positions.length ?? agent.positionCount}</p>
        </MCard>
      </div>

      {agent.status !== "error" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onToggleStatus}
            disabled={updating}
            className={clsx("press-98 focus-ring flex h-[52px] items-center justify-center gap-2 rounded-full text-[15px] font-bold disabled:opacity-50", isPaused ? "bg-[#6C5CFF] text-white" : "bg-[#212128] text-[#F4F4F6]")}
          >
            {isPaused ? <IconArrowUpRight className="h-[18px] w-[18px]" /> : <IconPause className="h-[18px] w-[18px]" />}
            {updating ? "Сохраняем…" : isPaused ? "Запустить" : "Пауза"}
          </button>
          <a href="#capital" className="press-98 focus-ring flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/[0.12] text-[15px] font-bold text-[#F4F4F6]">
            <IconCoins className="h-[18px] w-[18px]" />Капитал
          </a>
        </div>
      )}
    </div>
  );
}
