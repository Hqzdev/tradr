"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import { IconDownload } from "@/components/icons";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { agents } from "@/lib/fixtures";
import { PERSONA, budgetInfo, agentSessionLog, type SessionLogRow } from "@/lib/psychologyData";
import type { AgentStrategy } from "@/lib/types";
import clsx from "@/lib/clsx";

const RESULT_TONE: Record<SessionLogRow["resultTone"], string> = {
  positive: "text-positive",
  negative: "text-negative",
  neutral: "text-steel",
  warning: "text-warning",
};

export default function AgentLogScreen({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const strategy = (agent?.strategy ?? "aggressive") as AgentStrategy;
  const persona = PERSONA[strategy];
  const rows = agentSessionLog[strategy];
  const budget = budgetInfo[strategy];

  if (!agent) return null;

  const good = rows.filter((r) => r.resultTone === "positive").length;

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
          eyebrow={`${persona.name} · прозрачность решений`}
          title="Лог агента за сессию"
          lead="Каждое действие записано с причиной, акцией, результатом и влиянием команды."
          action={
            <Button variant="primary" icon={<IconDownload className="h-4 w-4" />}>
              Экспорт CSV
            </Button>
          }
        />
      </div>

      <Card className="mt-6 grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
        <div>
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Решений</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-ink">{rows.length}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Успешных</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-positive">{good}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Результат</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-positive">{budget.pnl}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[700] uppercase tracking-[0.03em] text-steel">Влияние команды</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-magenta-deep">+4,8%</p>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <p className="text-subheading font-[700] text-ink">Решения {persona.name}</p>

        {rows.length === 0 ? (
          <EmptyState className="mt-5" title={emptyStates.sessionLog.title} description={emptyStates.sessionLog.description} />
        ) : (
          <>
            <table className="mt-5 w-full border-collapse text-left">
              <thead>
                <tr className="text-caption font-[700] uppercase tracking-[0.02em] text-steel">
                  <th className="pb-3 font-[700]">Время</th>
                  <th className="pb-3 font-[700]">Решение</th>
                  <th className="pb-3 font-[700]">Причина</th>
                  <th className="pb-3 font-[700]">Акция</th>
                  <th className="pb-3 font-[700]">Результат</th>
                  <th className="pb-3 font-[700]">Команда</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-bone text-body-sm">
                    <td className="py-3.5 text-caption font-[600] text-steel">{r.time}</td>
                    <td className="py-3.5 font-[700] text-ink">{r.action}</td>
                    <td className="max-w-[280px] py-3.5 text-caption text-steel">{r.reason}</td>
                    <td className="py-3.5 font-[700] text-ink">{r.asset}</td>
                    <td className={clsx("py-3.5 font-[700] tabular-nums", RESULT_TONE[r.resultTone])}>{r.result}</td>
                    <td className="py-3.5 text-caption font-[600] text-magenta-deep">{r.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <span className="rounded-btn border border-bone bg-[#FBF8FA] px-4 py-2.5 text-caption font-[600] text-ink">
                1–{rows.length} из {rows.length + 13}&nbsp;&nbsp;›
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
