"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { IconArrowUpRight, IconChevronRight, IconPause, IconShield, IconShuffle, IconTrophy } from "@/components/icons";
import { getAgent, updateAgentStatus, type ApiAgent } from "@/lib/api/agents";

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

  useEffect(() => {
    getAgent(agentId)
      .then(setAgent)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [agentId]);

  const toggleStatus = async () => {
    if (!agent || agent.status === "error") return;
    setUpdating(true);
    try {
      setAgent(await updateAgentStatus(agent.id, agent.status === "active" ? "paused" : "active"));
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard label="Стратегия" value={strategyLabel[agent.strategy] ?? agent.strategy} />
        <InfoCard label="Личный сигнал" value={signalLabel(agent.triggerPercent)} />
        <InfoCard label="Создан" value={formatDate(agent.createdAt)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Сделки</p>
          <EmptyState compact className="mt-4" title="Сделок пока нет" description="Здесь появятся только реальные исполненные заявки агента." />
        </Card>
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Решения</p>
          <EmptyState compact className="mt-4" title="Решений пока нет" description="Здесь будет журнал реальных решений агента." />
        </Card>
      </div>
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

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function signalLabel(value: number): string {
  return `${value > 0 ? "+" : ""}${value}%`;
}
