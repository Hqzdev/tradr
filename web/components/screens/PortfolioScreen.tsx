"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { AgentStatCard } from "@/components/AgentCard";
import EquityChart from "@/components/charts/EquityChart";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import {
  agents,
  equityCurve,
  formatMoney,
  formatPercent,
  freeCash,
  manualHoldings,
  manualPortfolioReturnPercent,
  manualPortfolioValue,
  totalCapital,
} from "@/lib/fixtures";
import { IconArrowUpRight, IconDownload, IconHistory } from "@/components/icons";
import clsx from "@/lib/clsx";

const ranges = ["1М", "3М", "6М", "ВСЁ · USD"];

export default function PortfolioScreen() {
  const [range, setRange] = useState("ВСЁ · USD");

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Счёт / Обзор активов
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Портфель</h1>
          <p className="mt-1.5 text-body text-steel">
            Демо-счёт · USD · ручные сделки и торговые агенты
          </p>
        </div>
        <div className="text-right">
          <p className="text-caption uppercase tracking-[0.02em] text-steel">
            Общий капитал
          </p>
          <p className="mt-1 text-heading-sm font-[485] tabular-nums text-ink">
            {formatMoney(totalCapital, true)}
          </p>
          <p className="mt-0.5 text-caption text-steel">Ваши позиции + 3 агента</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {agents.map((agent, i) => (
          <AgentStatCard key={agent.id} agent={agent} highlight={i === 0} />
        ))}
      </div>

      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-subheading font-[485] text-ink">Динамика капитала агентов</p>
          <div className="flex items-center gap-1 text-caption">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={clsx(
                  "press-98 focus-ring rounded-pill px-2.5 py-1 font-[485] transition-colors duration-150",
                  range === r ? "bg-magenta-tint text-magenta-deep" : "text-steel hover:bg-bone/70"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <EquityChart data={equityCurve} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Результаты агентов</p>
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Стратегия</th>
                <th className="pb-2 font-[485]">Доходность</th>
                <th className="pb-2 font-[485]">Макс. просадка</th>
                <th className="pb-2 font-[485]">Сделки</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-bone text-body-sm">
                  <td className="py-3 text-ink">{agent.name}</td>
                  <td
                    className={clsx(
                      "py-3 font-[485] tabular-nums",
                      agent.pnlPercent >= 0 ? "text-positive" : "text-negative"
                    )}
                  >
                    {formatPercent(agent.pnlPercent)}
                  </td>
                  <td className="py-3 tabular-nums text-ink">
                    {formatPercent(agent.maxDrawdownPercent)}
                  </td>
                  <td className="py-3 tabular-nums text-ink">{agent.trades}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 flex items-center justify-between border-t border-bone pt-5">
            <button className="press-98 focus-ring flex items-center gap-2 text-body-sm font-[485] text-ink transition-colors duration-150 hover:text-magenta-deep">
              <IconDownload className="h-4 w-4" />
              Экспорт отчёта
            </button>
            <div className="flex items-center gap-3">
              <Link href="/history">
                <Button variant="outline" icon={<IconHistory className="h-4 w-4" />}>
                  История сделок
                </Button>
              </Link>
              <Link href="/terminal">
                <Button variant="primary" icon={<IconArrowUpRight className="h-4 w-4" />}>
                  Перейти к торгам
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-subheading font-[485] text-ink">
            <IconArrowUpRight className="h-4 w-4 rotate-45 text-steel" />
            Ручной портфель
          </div>
          <p className="mt-3 text-body-sm text-steel">
            Стоимость{" "}
            <span className="font-[485] text-ink">{formatMoney(manualPortfolioValue, true)}</span>{" "}
            · доходность{" "}
            <span className="font-[485] text-positive">
              {formatPercent(manualPortfolioReturnPercent)}
            </span>
          </p>

          {manualHoldings.length === 0 ? (
            <EmptyState
              compact
              className="mt-4"
              title={emptyStates.positions.title}
              description={emptyStates.positions.description}
              actionLabel="Открыть терминал"
              actionHref="/terminal"
            />
          ) : (
            <div className="mt-4 flex flex-col gap-2 text-body-sm">
              {manualHoldings.map((h) => (
                <Link
                  key={h.ticker}
                  href={`/portfolio/${h.ticker}`}
                  className="press-98 focus-ring flex justify-between transition-colors duration-150 hover:text-magenta-deep"
                >
                  <span className="text-ink">
                    {h.ticker} · {h.quantity} акций
                  </span>
                  <span className="tabular-nums text-ink">{formatMoney(h.value, true)}</span>
                </Link>
              ))}
              <div className="flex justify-between">
                <span className="text-ink">Свободно</span>
                <span className="tabular-nums text-ink">{formatMoney(freeCash, true)}</span>
              </div>
            </div>
          )}

          <p className="mt-4 text-caption text-steel">
            Управляйте позициями через терминал.
          </p>
        </Card>
      </div>
    </div>
  );
}
