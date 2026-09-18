"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import { teams, type TeamMember } from "@/lib/psychologyData";
import { notFound } from "next/navigation";
import clsx from "@/lib/clsx";

const NODE_STYLE: Record<TeamMember["roleColor"], { bg: string; border: string; role: string }> = {
  magenta: { bg: "bg-magenta-tint", border: "border-magenta-ring", role: "text-magenta-deep" },
  positive: { bg: "bg-positive-tint", border: "border-[#CDEEDF]", role: "text-positive" },
  warning: { bg: "bg-[#FBF8FA]", border: "border-bone", role: "text-steel" },
};

export default function TeamDetailScreen({ teamId }: { teamId: string }) {
  const team = teams.find((t) => t.id === teamId);
  if (!team) notFound();

  const others = teams.filter((t) => t.id !== teamId).slice(0, 2);

  return (
    <div>
      <Link href="/teams" className="text-caption font-[485] text-steel transition-colors duration-150 hover:text-ink">
        ← Команды
      </Link>

      <div className="mt-3">
        <PageHeader
          eyebrow="Агенты · взаимодействия"
          title="Команды и связи"
          lead="Дружба, конфликты и совместные стратегии меняют качество решений агентов."
          action={<Button variant="primary">+ Создать команду</Button>}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.56fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[19px] font-[700] text-ink">Команда {team.name}</p>
                <p className="mt-1 text-body-sm font-[600] text-positive">{team.statusLabel}</p>
              </div>
              <div className="rounded-btn border border-[#CDEEDF] bg-positive-tint px-4 py-3">
                <p className="text-caption font-[700] uppercase tracking-[0.03em] text-positive">Результат</p>
                <p className="mt-0.5 text-heading-sm font-[700] text-positive">{team.pnlLabel}</p>
              </div>
            </div>

            <div className="mt-5 border-t border-bone pt-5">
              <div className="flex flex-wrap items-start gap-3">
                {team.members.map((m, i) => {
                  const style = NODE_STYLE[m.roleColor];
                  return (
                    <div key={`${m.id}-${m.name}`} className="flex flex-1 items-center gap-3">
                      <div className={clsx("min-w-[130px] flex-1 rounded-[14px] border px-4 py-3.5", style.bg, style.border)}>
                        <p className="text-body font-[700] text-ink">{m.name}</p>
                        <p className={clsx("mt-0.5 text-caption font-[600]", style.role)}>{m.role}</p>
                      </div>
                      {i < team.members.length - 1 && (
                        <div className="h-px w-8 shrink-0 bg-fog/60" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Совместная стратегия</p>
            <p className="mt-2 text-body font-[700] text-ink">{team.strategyName}</p>
            <p className="mt-2 text-body-sm text-steel">{team.strategyText}</p>

            <p className="mt-5 text-caption font-[700] text-steel">Вклад участников</p>
            <div className="mt-3 flex flex-col gap-3">
              {team.contribution.map((c) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-body-sm font-[600] text-ink">
                    <span>{c.name} · {c.percent}%</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar percent={c.percent} color={c.color} track="#EFEAF0" height={8} />
                  </div>
                </div>
              ))}
            </div>

            <button className="press-98 focus-ring mt-5 rounded-btn border border-magenta-ring bg-magenta-tint px-5 py-3 text-body-sm font-[700] text-magenta-deep transition-colors duration-150 hover:bg-[#fbdcf1]">
              Настроить стратегию
            </button>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Конфликты</p>
            {team.conflict ? (
              <>
                <div className="mt-4 rounded-btn border border-[#FFD9DF] bg-negative-tint px-4 py-3.5">
                  <p className="text-body font-[700] text-negative">{team.conflict.pair}</p>
                  <p className="mt-1 text-caption font-[500] text-ink">{team.conflict.text}</p>
                </div>
                <p className="mt-4 text-body-sm text-steel">
                  Разведите агентов по разным стратегиям или включите паузу.
                </p>
                <button className="press-98 focus-ring mt-4 w-full rounded-btn border border-negative/30 bg-white px-5 py-3 text-body-sm font-[700] text-negative transition-colors duration-150 hover:bg-negative-tint">
                  Открыть решение конфликта
                </button>
              </>
            ) : (
              <p className="mt-4 text-body-sm text-steel">Активных конфликтов в этой команде нет.</p>
            )}
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Другие команды</p>
            <div className="mt-4 flex flex-col gap-3">
              {others.map((t) => (
                <Link
                  key={t.id}
                  href={`/teams/${t.id}`}
                  className="press-98 block rounded-btn border border-bone bg-[#FBF8FA] px-4 py-3.5 transition-colors duration-150 hover:border-fog/60"
                >
                  <p className="text-body-sm font-[700] text-ink">{t.name}</p>
                  <p
                    className={clsx(
                      "mt-1 text-caption font-[600]",
                      t.pnlLabel.startsWith("−") ? "text-warning" : "text-positive"
                    )}
                  >
                    {t.members.length} агента · {t.statusLabel.split("·")[0].trim()} · {t.pnlLabel}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/teams"
              className="press-98 focus-ring mt-4 block rounded-btn border border-magenta-ring bg-magenta-tint px-5 py-3 text-center text-body-sm font-[700] text-magenta-deep transition-colors duration-150 hover:bg-[#fbdcf1]"
            >
              Смотреть все команды
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
