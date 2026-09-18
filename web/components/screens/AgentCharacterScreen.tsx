"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { agents } from "@/lib/fixtures";
import { PERSONA, characterInfo } from "@/lib/psychologyData";
import type { AgentStrategy } from "@/lib/types";
import clsx from "@/lib/clsx";

const RELATION_STYLE = {
  friend: { bg: "bg-positive-tint", border: "border-[#CDEEDF]", mark: "text-positive", tag: "text-positive" },
  neutral: { bg: "bg-[#FBF8FA]", border: "border-bone", mark: "text-steel", tag: "text-steel" },
  conflict: { bg: "bg-negative-tint", border: "border-[#FFD9DF]", mark: "text-negative", tag: "text-negative" },
} as const;

export default function AgentCharacterScreen({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const strategy = (agent?.strategy ?? "aggressive") as AgentStrategy;
  const persona = PERSONA[strategy];
  const info = characterInfo[strategy];

  if (!agent) return null;

  const maxBar = Math.max(...info.trendBars);

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
          eyebrow="Агент · профиль"
          title={`Характер ${persona.name}`}
          lead="Характер влияет на решения, личные расходы и отношения в команде."
          chip={
            <span className="rounded-btn border border-bone bg-[#FBF8FA] px-4 py-2.5 text-body-sm font-[535] text-ink">
              Текущая сессия · 18 дней
            </span>
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr_0.9fr]">
        <Card className="p-6">
          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[18px] border border-magenta-ring bg-magenta-tint text-heading-sm font-[700] text-magenta-deep">
            {persona.initial}
          </div>
          <p className="mt-4 text-heading-sm font-[700] text-ink">{persona.name}</p>
          <p className="mt-1 text-body-sm font-[600] text-magenta-deep">
            {persona.typeLabel} · активен
          </p>

          <div className="mt-5 rounded-btn border border-magenta-ring bg-magenta-tint px-4 py-3.5">
            <p className="text-caption font-[700] uppercase tracking-[0.04em] text-magenta-deep">
              Темперамент
            </p>
            <p className="mt-1 text-body font-[700] text-ink">{info.temperLabel}</p>
          </div>

          <p className="mt-5 text-body-sm font-[700] text-ink">Сильные стороны</p>
          <div className="mt-2.5 flex flex-col gap-2">
            {info.strengths.map((s) => (
              <div key={s.title} className="rounded-btn border border-[#CDEEDF] bg-positive-tint px-3.5 py-2.5">
                <p className="text-body-sm font-[700] text-ink">{s.title}</p>
                <p className="mt-0.5 text-caption font-[600] text-positive">{s.note}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-body-sm font-[700] text-ink">Слабые стороны</p>
          <div className="mt-2.5 flex flex-col gap-2">
            {info.weaknesses.map((w) => (
              <div key={w.title} className="rounded-btn border border-[#FFD9DF] bg-negative-tint px-3.5 py-2.5">
                <p className="text-body-sm font-[700] text-ink">{w.title}</p>
                <p className="mt-0.5 text-caption font-[600] text-negative">{w.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-bone pt-4">
            <p className="text-caption text-steel">{info.footNote}</p>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Отношения с агентами</p>
          <p className="mt-1 text-body-sm text-steel">Связи меняют мотивацию и качество решения в сессии.</p>

          <div className="mt-5 flex flex-col gap-3">
            {info.relations.map((r) => {
              const style = RELATION_STYLE[r.kind];
              return (
                <div
                  key={r.name}
                  className={clsx("flex items-center gap-3.5 rounded-[14px] border px-4 py-3.5", style.bg, style.border)}
                >
                  <span className={clsx("text-heading-sm font-[700]", style.mark)}>{r.mark}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-[700] text-ink">{r.name}</p>
                    <p className={clsx("mt-0.5 text-caption font-[600]", style.tag)}>{r.tag}</p>
                  </div>
                  <span className="shrink-0 text-caption font-[600] text-ink">{r.impact}</span>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-body font-[700] text-ink">Динамика связей</p>
          <div className="mt-4 flex h-[70px] items-end gap-4 border-b border-[#DAD2DA] pb-0">
            {info.trendBars.map((v, i) => (
              <div
                key={i}
                className="w-8 rounded-[4px]"
                style={{
                  height: `${(v / maxBar) * 70}px`,
                  backgroundColor: i === 2 ? "#C9670A" : "#00856F",
                }}
              />
            ))}
          </div>
          <p className="mt-2.5 text-caption text-steel">{info.trendCaption}</p>
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Расходы и комиссия</p>
          <p className="mt-1 text-body-sm text-steel">Процент зависит от типа и прибыли агента.</p>

          <div className="mt-5">
            <p className="text-body-sm text-steel">Комиссия агенту</p>
            <p className="mt-1 text-[27px] font-[700] leading-none tracking-tight text-ink">{info.feePercent}</p>
            <p className="mt-2 text-body-sm text-steel">от прибыльных сделок</p>
          </div>
          <div className="my-4 h-px bg-bone" />
          <div>
            <p className="text-body-sm text-steel">Расходы за сессию</p>
            <p className="mt-1 text-[27px] font-[700] leading-none tracking-tight text-ink">{info.sessionSpend}</p>
            <p className="mt-2 text-body-sm text-steel">фиксируются в журнале</p>
          </div>
          <div className="my-4 h-px bg-bone" />
          <div>
            <p className="text-body-sm text-steel">Комиссия банка</p>
            <p className="mt-1 text-[25px] font-[700] leading-none tracking-tight text-ink">{info.bankFeePercent}</p>
            <p className="mt-2 text-body-sm text-steel">с каждой продажи</p>
          </div>

          <div className="mt-5 rounded-btn border border-warning-ring bg-warning-tint px-4 py-3.5">
            <p className="text-body-sm font-[700] text-warning">Следующая сделка</p>
            <p className="mt-1 text-body-sm font-[500] text-ink">{info.feeNoteText}</p>
          </div>

          <Button variant="primary" fullWidth className="mt-5">
            Открыть расчёт комиссии
          </Button>
        </Card>
      </div>
    </div>
  );
}
