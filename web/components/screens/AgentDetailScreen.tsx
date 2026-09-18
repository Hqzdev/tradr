"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import PercentTag from "@/components/ui/PercentTag";
import Tabs from "@/components/ui/Tabs";
import ProgressBar from "@/components/ui/ProgressBar";
import CapitalChart from "@/components/charts/CapitalChart";
import {
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconHistory,
  IconPause,
  IconSettings,
  IconShield,
  IconShuffle,
  IconTrophy,
  IconX,
} from "@/components/icons";
import { agents, formatMoney, formatPercent } from "@/lib/fixtures";
import { agentDetails, AGENT_CHART_COLOR, buildAgentCapitalSeries } from "@/lib/agentsData";
import clsx from "@/lib/clsx";

const strategyIcon = {
  aggressive: IconTrophy,
  careful: IconShield,
  random: IconShuffle,
};

export default function AgentDetailScreen({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const detail = agentDetails[agentId];
  const [tab, setTab] = useState("Обзор");
  const [paused, setPaused] = useState(false);

  if (!agent || !detail) return null;

  const Icon = strategyIcon[agent.strategy];
  const color = AGENT_CHART_COLOR[agent.strategy];
  const series = buildAgentCapitalSeries(agent.capital);

  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption font-[485] text-steel">
        <Link href="/agents" className="transition-colors duration-150 hover:text-ink">
          Агенты
        </Link>
        <IconChevronRight className="h-3 w-3" />
        <span className="text-ink">{agent.name}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}1A` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </span>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-heading font-[485] text-ink">{agent.name}</h1>
              <Badge tone={paused ? "paused" : "active"}>{paused ? "На паузе" : "LIVE"}</Badge>
            </div>
            <p className="mt-1 text-body-sm text-steel">
              {detail.description} · {detail.createdLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<IconPause className="h-4 w-4" />}
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Возобновить" : "Пауза"}
          </Button>
          <IconButton aria-label="Настройки агента">
            <IconSettings className="h-[18px] w-[18px]" />
          </IconButton>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile label="Капитал" value={formatMoney(agent.capital)} percent={agent.pnlPercent} />
        <MetricTile
          label="Прибыль после комиссий"
          value={formatMoney(detail.profitAfterFees)}
          tone={detail.profitAfterFees >= 0 ? "positive" : "negative"}
        />
        <MetricTile
          label="Средняя просадка"
          value={formatPercent(-detail.drawdownAvgPercent)}
          tone="negative"
        />
        <MetricTile
          label="Win rate"
          value={`${detail.winRatePercent}%`}
          caption={`${agent.trades} сделок всего`}
        />
      </div>

      <div className="mt-6">
        <Tabs options={["Обзор", "Сделки", "Решения", "Настройки"]} value={tab} onChange={setTab} />
      </div>

      {tab === "Обзор" && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_410px]">
            <Card className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-subheading font-[485] text-ink">Капитал агента vs NASDAQ</p>
                <div className="flex items-center gap-4 text-caption text-steel">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    {agent.name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#C7C2CC]" />
                    NASDAQ
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <CapitalChart data={series} agentColor={color} />
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-subheading font-[485] text-ink">Текущее решение</p>
              <div className="mt-3 flex items-center gap-2.5">
                <span
                  className={clsx(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    detail.decision.action === "buy" && "bg-positive-tint text-positive",
                    detail.decision.action === "sell" && "bg-negative-tint text-negative",
                    detail.decision.action === "wait" && "bg-bone text-steel"
                  )}
                >
                  <IconArrowUpRight
                    className={clsx(
                      "h-4 w-4",
                      detail.decision.action === "sell" && "rotate-[135deg]",
                      detail.decision.action === "wait" && "rotate-45"
                    )}
                  />
                </span>
                <div>
                  <p className="text-body-sm font-[535] text-ink">{detail.decision.label}</p>
                  <p className="text-caption text-steel">{detail.decision.price}</p>
                </div>
              </div>
              <p className="mt-3 text-body-sm text-steel">{detail.decision.reason}</p>
              <div className="mt-4 flex flex-col gap-2 border-t border-bone pt-4">
                {detail.decision.rules.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2 text-body-sm">
                    <span
                      className={clsx(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                        rule.ok ? "bg-positive-tint text-positive" : "bg-negative-tint text-negative"
                      )}
                    >
                      {rule.ok ? (
                        <IconCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                      ) : (
                        <IconX className="h-2.5 w-2.5" strokeWidth={2.5} />
                      )}
                    </span>
                    <span className={rule.ok ? "text-ink" : "text-steel"}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_410px]">
            <Card className="p-6">
              <p className="text-subheading font-[485] text-ink">Последние сделки</p>
              <TradesTable trades={detail.recentTrades} />
            </Card>

            <Card className="p-6">
              <p className="text-subheading font-[485] text-ink">Распределение капитала</p>
              <div className="mt-4 flex flex-col gap-4">
                {detail.allocation.map((a) => (
                  <div key={a.label}>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-ink">{a.label}</span>
                      <span className="tabular-nums text-steel">{a.value}</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar percent={a.percent} color={a.color} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "Сделки" && (
        <Card className="mt-6 p-6">
          <p className="text-subheading font-[485] text-ink">Все сделки агента</p>
          <TradesTable trades={detail.recentTrades} />
          <p className="mt-4 text-caption text-steel">
            Показаны последние {detail.recentTrades.length} сделки из {agent.trades} за всё время.
          </p>
        </Card>
      )}

      {tab === "Решения" && (
        <Card className="mt-6 p-6">
          <p className="text-subheading font-[485] text-ink">Логика принятия решений</p>
          <p className="mt-2 text-body-sm text-steel">{detail.decision.reason}</p>
          <div className="mt-4 flex flex-col gap-2">
            {detail.decision.rules.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2 text-body-sm">
                <span
                  className={clsx(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                    rule.ok ? "bg-positive-tint text-positive" : "bg-negative-tint text-negative"
                  )}
                >
                  {rule.ok ? (
                    <IconCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
                  ) : (
                    <IconX className="h-2.5 w-2.5" strokeWidth={2.5} />
                  )}
                </span>
                <span className={rule.ok ? "text-ink" : "text-steel"}>{rule.label}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "Настройки" && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              href: `/agents/${agent.id}/character`,
              title: "Характер агента",
              text: "Темперамент, сильные и слабые стороны, отношения и расходы.",
              icon: IconShield,
            },
            {
              href: `/agents/${agent.id}/budget`,
              title: "Бюджет агента",
              text: "Выдать капитал, задать лимит на сделку и стоп-лимит за день.",
              icon: IconTrophy,
            },
            {
              href: `/agents/${agent.id}/skills`,
              title: "Навыки агента",
              text: "Пять оценённых навыков и объяснение их влияния на сделки.",
              icon: IconSettings,
            },
            {
              href: `/agents/${agent.id}/log`,
              title: "Лог сессии",
              text: "Каждое решение с причиной, результатом и влиянием команды.",
              icon: IconHistory,
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="press-98 focus-ring group rounded-card border border-bone bg-white p-5 shadow-soft transition-colors duration-150 hover:border-magenta-ring"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-magenta-tint text-magenta-deep">
                  <item.icon className="h-4 w-4" />
                </span>
                <IconChevronRight className="h-4 w-4 text-fog transition-transform duration-150 group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-body font-[535] text-ink">{item.title}</p>
              <p className="mt-1 text-body-sm text-steel">{item.text}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TradesTable({
  trades,
}: {
  trades: { time: string; action: "buy" | "sell"; qty: string; price: string; status: string; statusColor: string }[];
}) {
  return (
    <table className="mt-4 w-full border-collapse text-left">
      <thead>
        <tr className="text-caption text-steel">
          <th className="pb-2 font-[485]">Время</th>
          <th className="pb-2 font-[485]">Действие</th>
          <th className="pb-2 font-[485]">Кол-во</th>
          <th className="pb-2 font-[485]">Цена</th>
          <th className="pb-2 font-[485]">Статус</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t, i) => (
          <tr key={i} className="border-t border-bone text-body-sm">
            <td className="py-3 text-steel">{t.time}</td>
            <td
              className={clsx(
                "py-3 font-[485]",
                t.action === "buy" ? "text-positive" : "text-negative"
              )}
            >
              {t.action === "buy" ? "Покупка" : "Продажа"}
            </td>
            <td className="py-3 tabular-nums text-ink">{t.qty}</td>
            <td className="py-3 tabular-nums text-ink">{t.price}</td>
            <td className="py-3 font-[485]" style={{ color: t.statusColor }}>
              {t.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MetricTile({
  label,
  value,
  percent,
  caption,
  tone,
}: {
  label: string;
  value: string;
  percent?: number;
  caption?: string;
  tone?: "positive" | "negative";
}) {
  return (
    <Card className="px-5 py-4">
      <p className="text-body-sm text-steel">{label}</p>
      <p
        className={clsx(
          "mt-1.5 text-heading-sm font-[485] tabular-nums",
          tone === "positive" && "text-positive",
          tone === "negative" && "text-negative",
          !tone && "text-ink"
        )}
      >
        {value}
      </p>
      {percent !== undefined && (
        <div className="mt-1">
          <PercentTag value={percent} size="sm" />
        </div>
      )}
      {caption && <p className="mt-1 text-caption text-steel">{caption}</p>}
    </Card>
  );
}
