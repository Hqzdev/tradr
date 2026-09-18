"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { IconMedal } from "@/components/icons";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { rankRows } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

const PERIODS = ["Неделя", "Месяц", "Всё время"] as const;

export default function AgentsRankingScreen() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Всё время");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Агенты / Лидерборд
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Рейтинг агентов</h1>
        </div>
        <div className="flex items-center gap-1 rounded-pill border border-bone bg-[#fafafa] p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                "press-98 focus-ring rounded-pill px-3.5 py-1.5 text-body-sm font-[485] transition-all duration-150",
                period === p ? "bg-white text-ink shadow-soft" : "text-steel hover:text-ink"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <Card className="mt-6 p-6">
        {rankRows.length === 0 ? (
          <EmptyState title={emptyStates.ranking.title} description={emptyStates.ranking.description} />
        ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-caption text-steel">
              <th className="pb-2 font-[485]">#</th>
              <th className="pb-2 font-[485]">Агент</th>
              <th className="pb-2 font-[485]">Стратегия</th>
              <th className="pb-2 font-[485]">Капитал</th>
              <th className="pb-2 font-[485]">Доходность</th>
              <th className="pb-2 font-[485]">Win rate</th>
              <th className="pb-2 font-[485]">Сделки</th>
              <th className="pb-2 font-[485]">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rankRows.map((r) => (
              <tr key={r.rank} className="border-t border-bone text-body-sm">
                <td className="py-3">
                  {r.rank === 1 ? (
                    <IconMedal className="h-4 w-4 text-magenta" />
                  ) : (
                    <span className="tabular-nums text-ink">{r.rank}</span>
                  )}
                </td>
                <td className="py-3 text-ink">
                  {r.name}
                  {r.own && <span className="ml-2 text-caption text-fog">ваш</span>}
                </td>
                <td className="py-3 text-steel">{r.strategyLabel}</td>
                <td className="py-3 tabular-nums text-ink">{r.capital}</td>
                <td className={clsx("py-3 tabular-nums font-[485]", r.returnPositive ? "text-positive" : "text-negative")}>
                  {r.returnPercent}
                </td>
                <td className="py-3 tabular-nums text-steel">{r.winRate}</td>
                <td className="py-3 tabular-nums text-steel">{r.trades}</td>
                <td className="py-3">
                  <span
                    className={clsx(
                      "rounded-pill px-2.5 py-1 text-caption font-[485]",
                      r.status === "active" ? "bg-positive-tint text-positive" : "bg-bone text-steel"
                    )}
                  >
                    {r.status === "active" ? "Активен" : "На паузе"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </Card>
    </div>
  );
}
