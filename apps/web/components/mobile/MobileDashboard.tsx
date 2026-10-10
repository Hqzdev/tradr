"use client";

import Link from "next/link";
import { useState } from "react";
import Money from "@/components/ui/Money";
import Toggle from "@/components/ui/Toggle";
import { IconAgents, IconArrowDownRight, IconArrowUpRight, IconClock, IconEye, IconPause, IconPlus, IconSparkles } from "@/components/icons";
import type { Dashboard } from "@/lib/api/dashboard";
import type { ApiAgent } from "@/lib/api/agents";
import { savedUser } from "@/lib/api/auth";
import { getStrategy, statusLabel } from "@/lib/agentVisuals";
import clsx from "@/lib/clsx";
import { MAgentAvatar, MCard, MEmpty, MSectionHead, MStatusDot, TradrCard, actionText, hhmm, signedUsd, usd } from "./ui";

export default function MobileDashboard({
  data,
  primaryAgent,
  busy,
  onToggleAgent,
  onSpeedChange,
}: {
  data: Dashboard;
  primaryAgent?: ApiAgent;
  busy: boolean;
  onToggleAgent: () => void;
  onSpeedChange: (enabled: boolean) => void;
}) {
  const [hidden, setHidden] = useState(false);
  const user = savedUser();
  const name = user?.displayName?.trim() || "трейдер";
  const anyActive = data.agents.some((agent) => agent.status === "active");
  const latest = data.activity[0];
  const primaryActive = primaryAgent?.status === "active";

  return (
    <div className="m-ui space-y-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full text-[18px] font-extrabold text-[#0E0B22]" style={{ background: "linear-gradient(135deg, #B3A9FF 0%, #6C5CFF 100%)" }}>
            {name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="text-[18px] font-bold text-[#F4F4F6]">Привет, {name}</p>
            <p className="text-[13px] font-medium text-[#8C8C97]">Уровень {data.level} · цель {usd(data.goalValue, 0)}</p>
          </div>
        </div>
        <span className={clsx("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold", anyActive ? "bg-[#2EBD85]/[0.12] text-[#2EBD85]" : "bg-white/[0.06] text-[#8C8C97]")}>
          <span className={anyActive ? "q-live h-[6px] w-[6px]" : "h-[6px] w-[6px] rounded-full bg-current"} />
          {anyActive ? "Live" : "Пауза"}
        </span>
      </div>

      <TradrCard holder={name} />

      <MCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold text-[#8C8C97]">Общий учебный капитал</p>
            <p className="mt-1.5 text-[36px] font-extrabold leading-none tracking-[-0.035em] text-[#F4F4F6]">
              {hidden ? "••••••" : <Money value={data.totalWealth} dimClassName="text-[#5C5C66]" />}
            </p>
            <p className="mt-2 text-[13px] font-bold text-[#B3A9FF]">
              {hidden ? "•••" : `${signedUsd(data.profit)} · ${data.profitPercent >= 0 ? "+" : "−"}${Math.abs(data.profitPercent).toFixed(2).replace(".", ",")}%`}
              <span className="font-semibold text-[#8C8C97]"> с начала</span>
            </p>
          </div>
          <button type="button" onClick={() => setHidden((value) => !value)} aria-label={hidden ? "Показать баланс" : "Скрыть баланс"} aria-pressed={hidden} className="press-98 focus-ring -mr-1 grid h-9 w-9 place-items-center rounded-full text-[#8C8C97]">
            <IconEye className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex justify-around">
          <RoundAction href="/agents" label="Агенты" icon={<IconAgents className="h-5 w-5" />} />
          <RoundAction href="/agents/new" label="Создать" icon={<IconPlus className="h-5 w-5" />} />
          {primaryAgent ? (
            <RoundAction
              onClick={onToggleAgent}
              disabled={busy}
              accent={!primaryActive}
              label={busy ? "Сохраняем" : primaryActive ? "Пауза" : "Запустить"}
              icon={primaryActive ? <IconPause className="h-5 w-5" /> : <IconSparkles className="h-5 w-5" />}
            />
          ) : (
            <RoundAction href="/agents/new" accent label="Агенту" icon={<IconSparkles className="h-5 w-5" />} />
          )}
        </div>
      </MCard>

      <MCard className="p-5">
        <div className="flex items-center justify-between text-[13px]">
          <span className="rounded-full bg-[#6C5CFF]/[0.16] px-2.5 py-1 text-[11.5px] font-bold text-[#B3A9FF]">Уровень {data.level}</span>
          <span className="font-semibold text-[#8C8C97]">Награда <b className="text-[#2EBD85]">+{usd(data.nextLevelReward, 0)}</b></span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-[30px] font-extrabold leading-none tracking-[-0.04em] text-[#B3A9FF]">{data.goalProgress.toFixed(1).replace(".", ",")}%</p>
          <p className="text-[12.5px] font-semibold text-[#8C8C97]">до {usd(data.goalValue, 0)}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.1]">
          <div className="h-full rounded-full bg-[#B3A9FF] transition-[width] duration-700" style={{ width: `${Math.min(100, Math.max(0, data.goalProgress))}%` }} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Tile label="В резерве" value={hidden ? "•••" : usd(data.reserveCash, 0)} />
          <Tile label="У агентов" value={hidden ? "•••" : usd(data.totalWealth - data.reserveCash, 0)} />
        </div>
      </MCard>

      <MCard className="flex gap-3 border border-white/[0.07] p-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-[#6C5CFF]/[0.16] text-[#B3A9FF]">
          <IconSparkles className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[14px] font-bold text-[#F4F4F6]">{latest ? `Сводка · ${latest.agentName}` : "Сводка агентов"}</p>
          <p className="mt-1 text-[13px] font-medium leading-[1.45] text-[#8C8C97]">
            {latest ? `${actionText(latest.action)}: ${latest.reason}` : "Агенты ещё не принимали решений. Запустите агента — первое решение появится в течение минуты."}
          </p>
        </div>
      </MCard>

      <MCard className="px-4 py-1">
        <Toggle
          label={data.accelerationEnabled ? "Ускорение ×20" : "Обычное время"}
          hint={data.accelerationEnabled ? "Решения примерно каждые 2,6 секунды" : "Решения примерно раз в минуту"}
          checked={data.accelerationEnabled}
          onChange={onSpeedChange}
        />
      </MCard>

      <MSectionHead title="Агенты в работе" action="Все" href="/agents" />
      {data.agents.length === 0 ? (
        <MEmpty title="Создайте первого агента" description="Выделите ему часть резерва и выберите характер торговли." actionLabel="Создать агента" actionHref="/agents/new" />
      ) : (
        <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {data.agents.map((agent) => (
            <AgentTile key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      <MSectionHead title="Что делают агенты" action="Вся история" href="/history" />
      {data.activity.length === 0 ? (
        <MEmpty title="Активность появится после запуска" description="Первое решение обычно появляется в течение минуты, в ускоренном режиме — быстрее." />
      ) : (
        <div className="space-y-2.5">
          {data.activity.slice(0, 6).map((item) => (
            <Link key={item.id} href={`/agents/${item.agentId}`} className="focus-ring flex items-start gap-3 rounded-[20px] bg-[#16161B] p-3.5">
              <span className={clsx("grid h-11 w-11 shrink-0 place-items-center rounded-full", item.action === "buy" ? "bg-[#2EBD85]/[0.14] text-[#2EBD85]" : item.action === "sell" ? "bg-[#F6465D]/[0.14] text-[#F6465D]" : "bg-[#212128] text-[#8C8C97]")}>
                {item.action === "buy" ? <IconArrowUpRight className="h-5 w-5" /> : item.action === "sell" ? <IconArrowDownRight className="h-5 w-5" /> : <IconClock className="h-5 w-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-bold text-[#F4F4F6]">{item.agentName}</span>
                  <span className="shrink-0 text-[12px] font-semibold text-[#5C5C66]">{hhmm(item.timestamp)}</span>
                </span>
                <span className="mt-0.5 line-clamp-2 block text-[12.5px] font-medium leading-[1.4] text-[#8C8C97]">
                  {actionText(item.action)} · {item.reason}
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function RoundAction({ label, icon, href, onClick, accent = false, disabled = false }: { label: string; icon: React.ReactNode; href?: string; onClick?: () => void; accent?: boolean; disabled?: boolean }) {
  const circle = clsx(
    "grid h-[52px] w-[52px] place-items-center rounded-full text-white transition-colors duration-200",
    accent ? "bg-[#6C5CFF] shadow-[0_8px_22px_-8px_rgba(108,92,255,0.9)]" : "border-[1.5px] border-white/20"
  );
  const body = (
    <>
      <span className={circle}>{icon}</span>
      <span className="text-[12px] font-semibold text-[#8C8C97]">{label}</span>
    </>
  );
  const cls = "press-98 focus-ring flex w-[76px] flex-col items-center gap-2 rounded-2xl disabled:opacity-50";
  return href ? <Link href={href} className={cls}>{body}</Link> : <button type="button" onClick={onClick} disabled={disabled} className={cls}>{body}</button>;
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] bg-[#212128] p-3">
      <p className="text-[11.5px] font-semibold text-[#8C8C97]">{label}</p>
      <p className="q-num mt-1 text-[16px] font-extrabold text-[#F4F4F6]">{value}</p>
    </div>
  );
}

function AgentTile({ agent }: { agent: ApiAgent }) {
  const strategy = getStrategy(agent.strategy);
  const Icon = strategy.icon;
  const base = agent.totalValue - agent.profit;
  const percent = base > 0 ? (agent.profit / base) * 100 : 0;
  return (
    <Link href={`/agents/${agent.id}`} className="focus-ring w-[calc(50%-6px)] min-w-[160px] shrink-0 snap-start rounded-[24px] bg-[#16161B] p-4">
      <span className="flex items-center justify-between">
        <MAgentAvatar color={strategy.color} size={36} radius={12}>
          <Icon className="h-[18px] w-[18px]" />
        </MAgentAvatar>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8C8C97]">
          <MStatusDot status={agent.status} />
          {statusLabel[agent.status]?.toLowerCase() ?? agent.status}
        </span>
      </span>
      <span className="mt-3 block truncate text-[15px] font-bold text-[#F4F4F6]">{agent.name}</span>
      <span className={clsx("q-num mt-0.5 block text-[12px] font-bold", percent >= 0 ? "text-[#2EBD85]" : "text-[#F6465D]")}>
        {percent >= 0 ? "+" : "−"}
        {Math.abs(percent).toFixed(1).replace(".", ",")}% за сессию
      </span>
      <span className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[12px] font-semibold">
        <span className="text-[#8C8C97]">Кошелёк</span>
        <span className="q-num text-[#F4F4F6]">{usd(agent.totalValue, 0)}</span>
      </span>
    </Link>
  );
}
