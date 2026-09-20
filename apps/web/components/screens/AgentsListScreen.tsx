"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatTile from "@/components/StatTile";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import {
  IconPlus,
  IconShield,
  IconShuffle,
  IconTrophy,
} from "@/components/icons";
import { listAgents, type ApiAgent } from "@/lib/api/agents";

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

export default function AgentsListScreen() {
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    listAgents()
      .then(setAgents)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = agents.filter((agent) => agent.status === "active").length;
  const pausedCount = agents.filter((agent) => agent.status === "paused").length;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Агенты / Управление
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Агенты</h1>
          <p className="mt-1.5 text-body text-steel">
            Каждый агент торгует только своим капиталом: сам покупает, продаёт и ограничивает риск.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/agents/new">
            <Button variant="primary" icon={<IconPlus className="h-4 w-4" />}>
              Создать агента
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile label="Всего агентов" value={loading ? "..." : String(agents.length)} caption="созданы вами" />
        <StatTile label="Активных" value={loading ? "..." : String(activeCount)} caption="готовы к работе" />
        <StatTile label="На паузе" value={loading ? "..." : String(pausedCount)} caption="не совершают действий" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Список агентов</p>
          {loading ? (
            <p className="mt-4 text-body-sm text-steel">Загружаем агентов...</p>
          ) : error ? (
            <EmptyState
              compact
              className="mt-4"
              title="Не удалось загрузить агентов"
              description="Проверьте, что backend запущен, и обновите страницу."
            />
          ) : agents.length === 0 ? (
            <EmptyState
              compact
              className="mt-4"
              title={emptyStates.agents.title}
              description={emptyStates.agents.description}
              actionLabel="Создать агента"
              actionHref="/agents/new"
            />
          ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Агент</th>
                <th className="pb-2 font-[485]">Стратегия</th>
                <th className="pb-2 font-[485]">Капитал</th>
                <th className="pb-2 font-[485]">Результат</th>
                <th className="pb-2 font-[485]">Статус</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => {
                const Icon = strategyIcon[agent.strategy as keyof typeof strategyIcon] ?? IconShield;
                const color = strategyColor[agent.strategy] ?? "#00856F";
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
                          <p className="text-caption text-steel">Создан {formatDate(agent.createdAt)}</p>
                        </span>
                      </Link>
                    </td>
                    <td className="border-t border-bone py-3">
                      <span className="text-body-sm text-ink">{strategyLabel[agent.strategy] ?? agent.strategy}</span>
                    </td>
                    <td className="border-t border-bone py-3 text-body-sm text-ink">
                      {money(agent.totalValue)}
                    </td>
                    <td className={`border-t border-bone py-3 text-body-sm ${agent.profit >= 0 ? "text-positive" : "text-negative"}`}>{agent.profit >= 0 ? "+" : "−"}{money(Math.abs(agent.profit))}</td>
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
          <p className="text-subheading font-[485] text-ink">Активность агентов</p>
          <EmptyState
            compact
            className="mt-4"
            title="Пока без активности"
            description="Решения и сделки появятся здесь, когда агент начнёт работать."
          />
        </Card>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(value)
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
