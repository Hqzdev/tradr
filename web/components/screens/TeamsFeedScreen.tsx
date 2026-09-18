"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { feedEvents, type FeedEvent } from "@/lib/psychologyData";
import clsx from "@/lib/clsx";

const TONE_DOT: Record<FeedEvent["tone"], string> = {
  positive: "#00856F",
  negative: "#BE3754",
  warning: "#C9670A",
  brand: "#E91BAC",
};

const TONE_TEXT: Record<FeedEvent["tone"], string> = {
  positive: "text-positive",
  negative: "text-negative",
  warning: "text-warning",
  brand: "text-magenta-deep",
};

const filters = ["Все команды", "Все события", "Сегодня"];

export default function TeamsFeedScreen() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Агенты · события команд"
        title="Лента взаимодействий"
        lead="Показывает, как агенты договорились, поспорили или повлияли на сделку."
        action={<Button variant="primary">Фильтры</Button>}
      />

      <Card className="mt-6 flex flex-wrap items-center gap-3 p-4">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActive(active === f ? null : f)}
            className={clsx(
              "press-98 focus-ring rounded-btn border px-4 py-2.5 text-body-sm font-[600] transition-colors duration-150",
              active === f ? "border-magenta-ring bg-magenta-tint text-magenta-deep" : "border-bone bg-white text-ink hover:border-fog/60"
            )}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-body-sm font-[600] text-steel">24 события за сессию</span>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.42fr]">
        <Card className="p-6">
          <p className="text-subheading font-[700] text-ink">Сегодня · 15 сентября</p>
          {feedEvents.length === 0 ? (
            <EmptyState compact className="mt-5" title={emptyStates.teamsFeed.title} description={emptyStates.teamsFeed.description} />
          ) : (
          <div className="mt-5 flex flex-col">
            {feedEvents.map((e, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: TONE_DOT[e.tone] }}
                  />
                  {i < feedEvents.length - 1 && <span className="mt-1 w-px flex-1 bg-bone" />}
                </div>
                <div className={clsx("flex-1 pb-6", i === feedEvents.length - 1 && "pb-0")}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="text-caption font-[600] text-steel">{e.time}</span>
                      <span className="text-body font-[700] text-ink">{e.title}</span>
                    </div>
                    <span className={clsx("text-caption font-[700]", TONE_TEXT[e.tone])}>{e.impact}</span>
                  </div>
                  <p className="mt-1.5 text-body-sm text-steel">{e.copy}</p>
                </div>
              </div>
            ))}
          </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[700] text-ink">Влияние на сессию</p>
            <p className="mt-1 text-body-sm text-steel">Сводка по взаимодействиям агентов.</p>

            <div className="mt-5">
              <p className="text-caption font-[700] uppercase tracking-[0.03em] text-positive">Поддержка</p>
              <p className="mt-1.5 text-[25px] font-[700] leading-none text-positive">+18%</p>
              <p className="mt-2 text-caption text-steel">к дисциплине команды</p>
            </div>
            <div className="my-4 h-px bg-bone" />
            <div>
              <p className="text-caption font-[700] uppercase tracking-[0.03em] text-negative">Конфликты</p>
              <p className="mt-1.5 text-[25px] font-[700] leading-none text-negative">−8%</p>
              <p className="mt-2 text-caption text-steel">к концентрации Искры</p>
            </div>
          </Card>

          <Card className="border-warning-ring bg-warning-tint p-6">
            <p className="text-subheading font-[700] text-warning">Что можно сделать</p>
            <p className="mt-2.5 text-body-sm font-[500] text-ink">
              Конфликт Искры и Романа всё ещё активен. Разделите их по разным стратегиям, если снижение
              концентрации мешает сделкам.
            </p>
            <button className="press-98 focus-ring mt-5 w-full rounded-btn border border-warning-ring bg-white px-5 py-3 text-body-sm font-[700] text-warning transition-colors duration-150 hover:bg-warning-tint">
              Открыть конфликт
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
