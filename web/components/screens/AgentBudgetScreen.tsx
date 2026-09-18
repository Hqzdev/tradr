"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import { agents } from "@/lib/fixtures";
import { PERSONA, budgetInfo } from "@/lib/psychologyData";
import type { AgentStrategy } from "@/lib/types";
import clsx from "@/lib/clsx";

function parseNum(s: string): number {
  return parseFloat(s.replace(/[^0-9.,-]/g, "").replace(",", ".")) || 0;
}

function formatRub(n: number): string {
  return Math.round(n).toLocaleString("ru-RU") + " ₽";
}

export default function AgentBudgetScreen({ agentId }: { agentId: string }) {
  const agent = agents.find((a) => a.id === agentId);
  const strategy = (agent?.strategy ?? "aggressive") as AgentStrategy;
  const persona = PERSONA[strategy];
  const info = budgetInfo[strategy];

  const grantedNum = parseNum(info.capitalWorking);
  const limitNum = parseNum(info.capitalOutOf);
  const [amountStr, setAmountStr] = useState(info.suggestedAmount);
  const amountNum = parseNum(amountStr);
  const after = grantedNum + amountNum;
  const overLimit = after > limitNum;

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
          eyebrow={`${persona.name} · управление капиталом`}
          title="Бюджет агента"
          lead="Выдайте капитал, определите границы риска и следите за результатом."
          chip={
            <span className="rounded-btn border border-bone bg-[#FBF8FA] px-4 py-2.5 text-body-sm font-[535] text-ink">
              {info.sessionLabel}
            </span>
          }
        />
      </div>

      <Card className="mt-6 grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
        <div>
          <p className="text-caption font-[600] text-steel">Капитал в работе</p>
          <p className="mt-1.5 text-heading-sm font-[700] tabular-nums text-ink">{info.capitalWorking}</p>
          <p className="mt-1.5 text-caption text-steel">{info.capitalOutOf}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[600] text-steel">Свободно</p>
          <p className="mt-1.5 text-[27px] font-[700] leading-none tabular-nums text-ink">{info.free}</p>
          <p className="mt-2 text-caption text-steel">{info.freePercentOfLimit}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[600] text-steel">Прибыль / потери</p>
          <p className="mt-1.5 text-[27px] font-[700] leading-none tabular-nums text-positive">{info.pnl}</p>
          <p className="mt-2 text-caption font-[600] text-positive">{info.pnlPercent}</p>
        </div>
        <div className="border-l border-bone pl-6">
          <p className="text-caption font-[600] text-steel">Риск использован</p>
          <p className="mt-1.5 text-[27px] font-[700] leading-none tabular-nums text-warning">{info.riskUsedPercent}</p>
          <p className="mt-2 text-caption text-steel">до стоп-лимита</p>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1fr]">
        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Выдать средства</p>
          <p className="mt-1 text-body-sm text-steel">Пополнение сразу станет доступно агенту.</p>

          <p className="mt-5 text-caption font-[600] text-steel">Сумма выдачи</p>
          <div className="mt-2 flex items-center gap-2 rounded-btn border border-fog/60 bg-white px-4 py-3.5 focus-within:border-magenta focus-within:ring-2 focus-within:ring-magenta-ring">
            <input
              value={amountStr}
              inputMode="decimal"
              onChange={(e) => setAmountStr(e.target.value.replace(/[^0-9.,]/g, ""))}
              className="w-full bg-transparent text-heading-sm font-[700] tabular-nums text-ink outline-none"
            />
            <span className="text-heading-sm font-[700] text-steel">₽</span>
          </div>

          <p className="mt-4 text-caption font-[600] text-steel">Быстрый выбор</p>
          <div className="mt-2 grid grid-cols-4 gap-2.5">
            {info.quickAmounts.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setAmountStr(q.label.replace(/[^0-9]/g, "") || amountStr)}
                className={clsx(
                  "press-98 focus-ring rounded-btn border px-2 py-2.5 text-caption font-[600] transition-colors duration-150",
                  q.highlight
                    ? "border-magenta-ring bg-magenta-tint text-magenta-deep"
                    : "border-bone bg-[#FBF8FA] text-ink hover:border-fog/60"
                )}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-btn border border-[#CDEEDF] bg-positive-tint px-4 py-4">
            <p className="text-caption font-[700] text-positive">После выдачи будет</p>
            <p className="mt-1 text-[23px] font-[700] leading-none tabular-nums text-ink">{formatRub(after)}</p>
            <p className={clsx("mt-2 text-caption font-[600]", overLimit ? "text-warning" : "text-positive")}>
              {overLimit ? "превышает лимит" : "лимит не превышен"}
            </p>
          </div>

          <Button variant="primary" fullWidth className="mt-5">
            Выдать {formatRub(amountNum)}
          </Button>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Лимиты риска</p>
            <p className="mt-1 text-body-sm text-steel">Агент не откроет сделку после превышения лимита.</p>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-body-sm font-[600] text-ink">{info.tradeLimitLabel}</span>
                <span className="text-body-sm font-[700] tabular-nums text-ink">{info.tradeLimitValue}</span>
              </div>
              <div className="mt-2.5">
                <ProgressBar percent={info.tradeLimitPercent} color="#E91BAC" track="#EFEAF0" height={10} />
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <span className="text-body-sm font-[600] text-ink">{info.stopLimitLabel}</span>
                <span className="text-body-sm font-[700] tabular-nums text-negative">{info.stopLimitValue}</span>
              </div>
              <div className="mt-2.5">
                <ProgressBar percent={info.stopLimitPercent} color="#C9670A" track="#EFEAF0" height={10} />
              </div>
              <p className="mt-2 text-caption text-steel">{info.stopNote}</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Движение бюджета</p>
            <div className="mt-4 flex flex-col">
              {info.ledger.map((l, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex items-center justify-between gap-3 py-3",
                    i > 0 && "border-t border-bone"
                  )}
                >
                  <span className="w-28 shrink-0 text-caption text-steel">{l.date}</span>
                  <span className="flex-1 text-body-sm font-[600] text-ink">{l.event}</span>
                  <span
                    className={clsx(
                      "shrink-0 text-body-sm font-[700] tabular-nums",
                      l.negative ? "text-negative" : "text-positive"
                    )}
                  >
                    {l.sum}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
