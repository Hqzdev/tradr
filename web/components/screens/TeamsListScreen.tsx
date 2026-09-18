"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { teams, relationsSummary } from "@/lib/psychologyData";
import clsx from "@/lib/clsx";

const RELATION_STYLE = {
  friend: { bg: "bg-positive-tint", border: "border-[#CDEEDF]" },
  conflict: { bg: "bg-negative-tint", border: "border-[#FFD9DF]" },
  support: { bg: "bg-warning-tint", border: "border-warning-ring" },
} as const;

export default function TeamsListScreen() {
  if (teams.length === 0) {
    return (
      <div>
        <PageHeader
          eyebrow="Агенты · совместная работа"
          title="Команды агентов"
          lead="Друзья, конфликты и общие правила меняют решения и результат стратегии."
          action={<Button variant="primary">+ Создать команду</Button>}
        />
        <EmptyState
          className="mt-6"
          title="Нет команд"
          description="Объедините агентов в команду, чтобы они делились капиталом и правилами."
          actionLabel="Создать команду"
          actionHref="/agents/setup"
        />
      </div>
    );
  }

  const [main, ...rest] = teams;

  return (
    <div>
      <PageHeader
        eyebrow="Агенты · совместная работа"
        title="Команды агентов"
        lead="Друзья, конфликты и общие правила меняют решения и результат стратегии."
        action={<Button variant="primary">+ Создать команду</Button>}
      />

      <Card className="mt-6 grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
        <div>
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Активных команд</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-ink">{teams.length}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Дружеских связей</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-positive">{relationsSummary.friendLinks}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Активных конфликтов</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-negative">{relationsSummary.activeConflicts}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Общий результат</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-positive">{relationsSummary.totalResult}</p>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.5fr]">
        <div className="flex flex-col gap-6">
          {[main, ...rest].map((team, idx) => (
            <Card key={team.id} className={clsx("p-6", idx === 0 ? "" : "")}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={clsx("font-[700] text-ink", idx === 0 ? "text-subheading" : "text-body")}>
                    Команда {team.name}
                  </p>
                  <p className="mt-1 text-body-sm font-[600] text-positive">{team.statusLabel}</p>
                </div>
                <span
                  className={clsx(
                    "shrink-0 text-[19px] font-[700]",
                    team.pnlLabel.startsWith("−") ? "text-warning" : "text-positive"
                  )}
                >
                  {team.pnlLabel}
                </span>
              </div>

              {idx === 0 ? (
                <>
                  <div className="mt-4 border-t border-bone pt-4">
                    <div className="flex flex-wrap gap-6">
                      {team.members.map((m) => (
                        <div key={m.name}>
                          <p className="text-body-sm font-[700] text-ink">{m.name}</p>
                          <p className="mt-0.5 text-caption font-[600] text-magenta-deep">{m.role}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={`/teams/${team.id}`}
                    className="press-98 focus-ring mt-4 inline-flex rounded-btn border border-magenta-ring bg-magenta-tint px-4 py-2 text-caption font-[700] text-magenta-deep transition-colors duration-150 hover:bg-[#fbdcf1]"
                  >
                    Открыть стратегию
                  </Link>
                </>
              ) : (
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-body-sm text-steel">
                    {team.members.length} агента · {team.statusLabel.split("·")[0].trim()}
                  </p>
                  <Link
                    href={`/teams/${team.id}`}
                    className="text-caption font-[600] text-magenta-deep hover:underline"
                  >
                    {team.members.map((m) => m.name).join(" · ")}
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Важные связи</p>
          <p className="mt-1 text-body-sm text-steel">Они влияют на поведение команды.</p>

          <div className="mt-4 flex flex-col gap-3">
            {relationsSummary.keyRelations.map((r) => {
              const style = RELATION_STYLE[r.kind];
              return (
                <div key={r.title} className={clsx("rounded-btn border px-4 py-3.5", style.bg, style.border)}>
                  <p className="text-body-sm font-[700] text-ink">{r.title}</p>
                  <p className="mt-1 text-caption font-[600] text-steel">{r.note}</p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-caption text-steel">Изменения фиксируются в ленте взаимодействий.</p>

          <Link
            href="/teams/feed"
            className="press-98 focus-ring mt-4 block rounded-btn border border-magenta-ring bg-magenta-tint px-5 py-3 text-center text-body-sm font-[700] text-magenta-deep transition-colors duration-150 hover:bg-[#fbdcf1]"
          >
            Открыть все связи
          </Link>
        </Card>
      </div>
    </div>
  );
}
