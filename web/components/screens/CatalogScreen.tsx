"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { catalogStocks, CATALOG_TYPE_STYLE, type CatalogStock } from "@/lib/psychologyData";
import clsx from "@/lib/clsx";

const TABS: { key: CatalogStock["type"] | "all"; label: string }[] = [
  { key: "all", label: "Все" },
  { key: "Стабильная", label: "Стабильные" },
  { key: "Нейтральная", label: "Нейтральные" },
  { key: "Рискованная", label: "Рискованные" },
];

export default function CatalogScreen() {
  const [tab, setTab] = useState<CatalogStock["type"] | "all">("all");
  const rows = tab === "all" ? catalogStocks : catalogStocks.filter((s) => s.type === tab);

  return (
    <div>
      <PageHeader
        eyebrow="Рынок · выбор для агентов"
        title="Каталог акций"
        lead="Тип бумаги помогает агенту оценить шанс успеха, возможную прибыль и риск потерь."
        action={<Button variant="primary">Настроить риск</Button>}
      />

      <Card className="mt-6 flex flex-wrap items-center gap-2 p-2.5">
        {TABS.map((t) => {
          const count = t.key === "all" ? catalogStocks.length : catalogStocks.filter((s) => s.type === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={clsx(
                "press-98 focus-ring rounded-btn border px-4 py-2.5 text-body-sm font-[600] transition-colors duration-150",
                active ? "border-magenta-ring bg-magenta-tint text-magenta-deep" : "border-transparent text-steel hover:text-ink"
              )}
            >
              {t.label} · {count}
            </button>
          );
        })}
        <span className="ml-auto text-body-sm font-[600] text-steel">Прогноз на 7 дней</span>
      </Card>

      <Card className="mt-6 p-6">
        <p className="text-subheading font-[700] text-ink">Бумаги для стратегии</p>
        <p className="mt-1 text-body-sm text-steel">Шанс — учебная оценка на основе текущих условий симуляции.</p>

        {rows.length === 0 ? (
          <EmptyState className="mt-4" title={emptyStates.catalog.title} description={emptyStates.catalog.description} />
        ) : (
          <>
            <div className="mt-5 grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-3 text-caption font-[700] uppercase tracking-[0.02em] text-steel">
              <span>Акция</span>
              <span>Тип</span>
              <span>Шанс успеха</span>
              <span>Возможная прибыль</span>
              <span>Возможный убыток</span>
            </div>
            <div className="mt-2 h-px bg-bone" />

            {rows.map((s) => {
              const style = CATALOG_TYPE_STYLE[s.type];
              return (
                <div
                  key={s.ticker}
                  className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] items-center gap-3 border-b border-bone py-4 last:border-b-0"
                >
                  <div>
                    <p className="text-body font-[700] text-ink">{s.ticker}</p>
                    <p className="mt-0.5 text-caption text-steel">{s.name}</p>
                  </div>
                  <span className={clsx("inline-flex w-fit items-center rounded-btn px-2.5 py-1.5 text-caption font-[700]", style.bg, style.text)}>
                    {s.type}
                  </span>
                  <div>
                    <p className="text-body-sm font-[700] tabular-nums text-ink">{s.chance}%</p>
                    <div className="mt-1.5 w-[120px]">
                      <ProgressBar percent={s.chance} color={style.bar} track="#EFEAF0" height={7} />
                    </div>
                  </div>
                  <span className="text-body-sm font-[700] tabular-nums text-positive">{s.gain}</span>
                  <span className="text-body-sm font-[700] tabular-nums text-negative">{s.loss}</span>
                </div>
              );
            })}

            <div className="mt-4 flex justify-end">
              <span className="rounded-btn border border-bone bg-[#FBF8FA] px-4 py-2.5 text-caption font-[600] text-ink">
                1–{rows.length} из {catalogStocks.length}&nbsp;&nbsp;›
              </span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
