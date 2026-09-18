import clsx from "@/lib/clsx";
import Card from "@/components/ui/Card";
import IconButton from "@/components/ui/IconButton";
import PercentTag from "@/components/ui/PercentTag";
import { IconShield, IconShuffle, IconSliders, IconTrophy } from "@/components/icons";
import type { Agent } from "@/lib/types";
import { formatMoney } from "@/lib/fixtures";

const strategyIcon = {
  aggressive: IconTrophy,
  careful: IconShield,
  random: IconShuffle,
};

const strategyCaption = {
  aggressive: "Лидер по доходности",
  careful: "Наименьшая просадка",
  random: "Контрольная стратегия",
};

export function AgentMarketCard({ agent }: { agent: Agent }) {
  return (
    <Card className="p-4 transition-shadow duration-150 hover:shadow-elevated">
      <div className="flex items-start justify-between">
        <p className="text-body-sm font-[485] text-ink">{agent.name}</p>
        <IconButton size="sm" aria-label="Настроить агента">
          <IconSliders className="h-4 w-4" />
        </IconButton>
      </div>
      <p className="mt-0.5 text-caption text-steel">{agent.subtitle}</p>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-heading-sm font-[485] tabular-nums text-ink">
          {formatMoney(agent.capital)}
        </p>
        <PercentTag value={agent.pnlPercent} />
      </div>
      <p className="mt-1 text-caption text-steel">{agent.lastAction}</p>
    </Card>
  );
}

export function AgentStatCard({
  agent,
  highlight,
}: {
  agent: Agent;
  highlight?: boolean;
}) {
  const Icon = strategyIcon[agent.strategy];
  return (
    <Card
      className={clsx(
        "p-5",
        highlight && "border-magenta/20 bg-magenta-tint"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-body-sm font-[485] text-ink">
          {agent.name} <span className="text-steel">· агент</span>
        </p>
        <Icon className="h-[18px] w-[18px] text-magenta-deep" />
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-heading-sm font-[485] tabular-nums text-ink">
          {formatMoney(agent.capital)}
        </p>
        <PercentTag value={agent.pnlPercent} />
      </div>
      <p className="mt-1 text-caption text-steel">
        {strategyCaption[agent.strategy]}
      </p>
    </Card>
  );
}
