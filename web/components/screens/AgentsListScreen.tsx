"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PercentTag from "@/components/ui/PercentTag";
import StatTile from "@/components/StatTile";
import EquityChart from "@/components/charts/EquityChart";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import {
  IconDot,
  IconPlus,
  IconShield,
  IconShuffle,
  IconTrophy,
} from "@/components/icons";
import { agents, equityCurve, formatMoney, formatPercent } from "@/lib/fixtures";
import { agentActivity, agentDetails, AGENT_CHART_COLOR } from "@/lib/agentsData";

const strategyIcon = {
  aggressive: IconTrophy,
  careful: IconShield,
  random: IconShuffle,
};

const statusLabel: Record<string, string> = {
  active: "Активен",
  paused: "На паузе",
  error: "Ошибка",
};

export default function AgentsListScreen() {
  const totalCapital = agents.reduce((sum, a) => sum + a.capital, 0);
  const avgReturn = agents.reduce((sum, a) => sum + a.pnlPercent, 0) / agents.length;
  const totalTrades = agents.reduce((sum, a) => sum + a.trades, 0);
  const activeCount = agents.filter((a) => a.status === "active").length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Агенты / Управление
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Агенты</h1>
          <p className="mt-1.5 text-body text-steel">
            Автоматические стратегии торгуют по заданным правилам — лимиты и риск задаёте вы.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/agents/setup">
            <Button variant="primary" icon={<IconPlus className="h-4 w-4" />}>
              Создать агента
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Активных агентов"
          value={`${activeCount} из ${agents.length}`}
          caption="все под наблюдением"
        />
        <StatTile
          label="Капитал под управлением"
          value={formatMoney(totalCapital)}
          caption="сумма по 3 агентам"
        />
        <StatTile
          label="Средняя доходность"
          value={formatPercent(avgReturn)}
          tone={avgReturn >= 0 ? "positive" : "default"}
          caption="по 3 агентам"
        />
        <StatTile label="Сделок всего" value={String(totalTrades)} caption="за всё время" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Список агентов</p>
          {agents.length === 0 ? (
            <EmptyState
              compact
              className="mt-4"
              title={emptyStates.agents.title}
              description={emptyStates.agents.description}
              actionLabel="Создать агента"
              actionHref="/agents/setup"
            />
          ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Агент</th>
                <th className="pb-2 font-[485]">Капитал</th>
                <th className="pb-2 font-[485]">Результат</th>
                <th className="pb-2 font-[485]">Риск</th>
                <th className="pb-2 font-[485]">Статус</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const Icon = strategyIcon[agent.strategy];
                const detail = agentDetails[agent.id];
                const color = AGENT_CHART_COLOR[agent.strategy];
                return (
                  <tr key={agent.id} className="group">
                    <td className="border-t border-bone py-0">
                      <Link
                        href={`/agents/${agent.id}`}
                        className="press-98 flex items-center gap-3 py-3"
                      >
                        <span
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${color}1A` }}
                        >
                          <Icon className="h-4 w-4" style={{ color }} />
                        </span>
                        <span>
                          <p className="text-body-sm font-[535] text-ink transition-colors duration-150 group-hover:text-magenta-deep">
                            {agent.name}
                          </p>
                          <p className="text-caption text-steel">{agent.subtitle}</p>
                        </span>
                      </Link>
                    </td>
                    <td className="border-t border-bone py-3 text-body-sm font-[485] tabular-nums text-ink">
                      {formatMoney(agent.capital)}
                    </td>
                    <td className="border-t border-bone py-3">
                      <PercentTag value={agent.pnlPercent} />
                    </td>
                    <td className="border-t border-bone py-3">
                      <span className="flex items-center gap-1.5 text-body-sm text-ink">
                        <IconDot className="h-1.5 w-1.5" style={{ color: detail.riskColor }} />
                        {detail.riskLabel}
                      </span>
                    </td>
                    <td className="border-t border-bone py-3">
                      <Badge tone={agent.status}>{statusLabel[agent.status]}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-[485] text-ink">Активность агентов</p>
            <span className="flex items-center gap-1.5 text-caption font-[485] text-positive">
              <IconDot className="h-1.5 w-1.5" />
              LIVE
            </span>
          </div>
          {agentActivity.length === 0 ? (
            <EmptyState compact className="mt-4" title="Пока без активности" description="Действия агентов появятся здесь в реальном времени." />
          ) : (
          <div className="mt-4 flex flex-col gap-4">
            {agentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: item.dot }}
                />
                <div>
                  <p className="text-body-sm text-ink">
                    <span className="font-[485]">{item.agent}</span>{" "}
                    <span style={{ color: item.color }}>{item.text}</span>
                  </p>
                  <p className="mt-0.5 text-caption text-steel">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Динамика капитала агентов</p>
          <div className="mt-5">
            <EquityChart data={equityCurve} />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Контроль риска</p>
          <div className="mt-4 flex flex-col gap-4">
            {agents.map((agent) => {
              const detail = agentDetails[agent.id];
              return (
                <div key={agent.id}>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-ink">{agent.name}</span>
                    <span className="tabular-nums text-steel">
                      {detail.capitalUsagePercent}% капитала
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar
                      percent={detail.capitalUsagePercent}
                      color={AGENT_CHART_COLOR[agent.strategy]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-caption text-steel">
            Лимит на одного агента — 75% капитала. Превышений нет.
          </p>
        </Card>
      </div>
    </div>
  );
}
