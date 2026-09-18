"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import SearchField from "@/components/ui/SearchField";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { IconArrowUpRight, IconCalendar, IconDownload, IconSliders } from "@/components/icons";
import { tradeHistoryRows, tradeHistoryStats, tradeInspector } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

const FILTERS = ["Все", "Агенты", "Вручную"] as const;

export default function TradeHistoryScreen() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Все");
  const [query, setQuery] = useState("");

  const rows = tradeHistoryRows.filter((r) => {
    if (filter === "Агенты" && r.agent === "Вручную") return false;
    if (filter === "Вручную" && r.agent !== "Вручную") return false;
    if (query.trim() && !r.agent.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Журнал операций"
        title="История сделок"
        lead="Все действия агентов и ручные заявки в одной последовательности."
        action={
          <div className="flex items-center gap-2">
            <button className="press-98 focus-ring flex items-center gap-2 rounded-btn border border-bone bg-white px-3.5 py-2 text-body-sm text-ink transition-colors duration-150 hover:border-fog/60">
              <IconDownload className="h-4 w-4" />
              Экспорт отчёта
            </button>
            <Link href="/terminal">
              <Button variant="primary">Новая заявка</Button>
            </Link>
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-caption text-steel">Сделок сегодня</p>
            <span className="h-1.5 w-1.5 rounded-full bg-magenta" />
          </div>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{tradeHistoryStats.tradesToday}</p>
          <p className="mt-0.5 text-caption text-magenta-deep">{tradeHistoryStats.tradesNote}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Оборот</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{tradeHistoryStats.turnover}</p>
          <p className="mt-0.5 text-caption text-teal">{tradeHistoryStats.turnoverNote}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Исполнено</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{tradeHistoryStats.filledPercent}</p>
          <p className="mt-0.5 text-caption text-teal">{tradeHistoryStats.filledNote}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Комиссия</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{tradeHistoryStats.commission}</p>
          <p className="mt-0.5 text-caption text-steel">{tradeHistoryStats.commissionNote}</p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <SearchField placeholder="Поиск по сделке или агенту" value={query} onChange={setQuery} />
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "press-98 focus-ring rounded-pill px-3.5 py-2 text-body-sm font-[485] transition-colors duration-150",
              filter === f ? "bg-magenta-tint text-magenta-deep" : "border border-bone bg-white text-ink hover:border-fog/60"
            )}
          >
            {f}
          </button>
        ))}
        <span className="flex items-center gap-1.5 rounded-btn border border-bone bg-white px-3.5 py-2 text-body-sm text-ink">
          <IconCalendar className="h-4 w-4 text-steel" />
          Сегодня, 15 сент.
        </span>
        <span className="ml-auto flex items-center gap-1.5 rounded-btn border border-bone bg-white px-3.5 py-2 text-body-sm text-ink">
          <IconSliders className="h-4 w-4 text-steel" />
          Фильтры
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden p-0">
          {rows.length === 0 ? (
            <EmptyState
              className="rounded-none"
              title={emptyStates.trades.title}
              description={
                query.trim() || filter !== "Все"
                  ? "По этому фильтру или запросу сделок не найдено."
                  : emptyStates.trades.description
              }
            />
          ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#FAF8FB] text-caption text-steel">
                <th className="px-6 py-3 font-[485]">ВРЕМЯ</th>
                <th className="px-2 py-3 font-[485]">ИСТОЧНИК</th>
                <th className="px-2 py-3 font-[485]">ДЕЙСТВИЕ</th>
                <th className="px-2 py-3 font-[485]">ОБЪЁМ</th>
                <th className="px-2 py-3 font-[485]">ЦЕНА</th>
                <th className="px-2 py-3 font-[485]">СУММА</th>
                <th className="px-6 py-3 font-[485]">СТАТУС</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-bone text-body-sm">
                  <td className="px-6 py-3 text-steel">{r.time}</td>
                  <td className="px-2 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-pill bg-magenta-tint px-2 py-1 text-caption font-[485] text-magenta-deep">
                      {r.agent}
                    </span>
                  </td>
                  <td className={clsx("px-2 py-3 font-[485]", r.side === "Покупка" ? "text-positive" : "text-negative")}>
                    {r.side}
                  </td>
                  <td className="px-2 py-3 tabular-nums text-steel">{r.volumeLabel}</td>
                  <td className="px-2 py-3 tabular-nums text-ink">{r.price}</td>
                  <td className="px-2 py-3 tabular-nums text-ink">{r.total}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-pill bg-positive-tint px-2.5 py-1 text-caption font-[485] text-positive">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </Card>

        <Card className="bg-[#FCFAFD] p-6">
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-steel">Выбранная сделка</p>
          <p className="mt-2 text-subheading font-[485] text-ink">{tradeInspector.title}</p>
          <span className="mt-2 inline-block rounded-pill bg-positive-tint px-2.5 py-1 text-caption font-[485] text-positive">
            {tradeInspector.outcome}
          </span>
          <p className="mt-3 text-body-sm text-steel">{tradeInspector.note}</p>
          <div className="mt-4 flex flex-col gap-1.5 text-body-sm text-ink">
            {tradeInspector.details.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <Link href="/agents/aggressive">
            <Button variant="primary" fullWidth className="mt-5" icon={<IconArrowUpRight className="h-4 w-4" />}>
              Открыть агента
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
