"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { IconShuffle } from "@/components/icons";
import { agents } from "@/lib/fixtures";
import { PERSONA, skillsInfo, type SkillRow } from "@/lib/psychologyData";
import type { AgentStrategy } from "@/lib/types";
import clsx from "@/lib/clsx";

const TONE_STYLE: Record<SkillRow["tone"], { bg: string; text: string }> = {
  good: { bg: "bg-positive-tint", text: "text-positive" },
  warn: { bg: "bg-warning-tint", text: "text-warning" },
  bad: { bg: "bg-negative-tint", text: "text-negative" },
  brand: { bg: "bg-magenta-tint", text: "text-magenta-deep" },
};

export default function AgentSkillsScreen({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const strategy = (agent?.strategy ?? "aggressive") as AgentStrategy;
  const persona = PERSONA[strategy];
  const info = skillsInfo[strategy];

  if (!agent) return null;

  return (
    <div>
      <Link
        href={`/agents/${agent.id}`}
        className="text-caption font-[485] text-steel transition-colors duration-150 hover:text-ink"
      >
        ← {agent.name}
      </Link>

      <div className="mt-3">
        <PageHeader
          eyebrow={`${persona.name} · профиль навыков`}
          title="Детали навыков"
          lead="Все агенты имеют одни категории навыков, но случайные значения и характер."
          action={
            <Button
              variant="secondary"
              icon={<IconShuffle className="h-4 w-4" />}
            >
              Перегенерировать
            </Button>
          }
        />
      </div>

      <Card className="mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-body font-[700] text-ink">Профиль принятия решений</p>
          <p className="mt-1.5 max-w-xl text-body-sm text-steel">{info.decisionSummary}</p>
        </div>
        <span className="rounded-btn border border-[#CDEEDF] bg-positive-tint px-4 py-2.5 text-body-sm font-[700] text-positive">
          Общий уровень · {info.overallLevel} / 100
        </span>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.42fr]">
        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Навыки агента</p>

          <div className="mt-5 grid grid-cols-[1fr_110px_1fr] gap-3 text-caption font-[700] uppercase tracking-[0.03em] text-steel">
            <span>Навык</span>
            <span>Значение</span>
            <span>Эффект в сделке</span>
          </div>
          <div className="mt-2 h-px bg-bone" />

          {info.rows.map((row) => {
            const tone = TONE_STYLE[row.tone];
            return (
              <div
                key={row.key}
                className="grid grid-cols-[1fr_110px_1fr] items-center gap-3 border-b border-bone py-4 last:border-b-0"
              >
                <div>
                  <p className="text-body-sm font-[700] text-ink">{row.label}</p>
                  <p className="mt-0.5 text-caption text-steel">{row.sub}</p>
                </div>
                <span
                  className={clsx(
                    "inline-flex w-fit items-center rounded-btn px-2.5 py-1.5 text-caption font-[700]",
                    tone.bg,
                    tone.text
                  )}
                >
                  {row.score} / 100
                </span>
                <span className="text-caption font-[600] text-ink">{row.effect}</span>
              </div>
            );
          })}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-body font-[700] text-ink">Как читать значения</p>
            <p className="mt-2.5 text-body-sm text-steel">
              Все агенты оцениваются по одной шкале. Разными их делает сочетание случайных значений и темперамента.
            </p>

            <div className="mt-5 rounded-btn border border-magenta-ring bg-magenta-tint px-4 py-3.5">
              <p className="text-caption font-[700] uppercase tracking-[0.03em] text-magenta-deep">
                Диапазон типа
              </p>
              <p className="mt-1.5 text-body font-[700] text-ink">{info.rangeLabel}</p>
              <p className="mt-1 text-caption text-steel">значение определяется случайно</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-body font-[700] text-ink">Что улучшить</p>
            <p className="mt-2.5 text-body-sm text-steel">{info.suggestionText}</p>
            <Button variant="primary" fullWidth className="mt-5">
              Перейти к команде
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
