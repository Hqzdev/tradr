"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import DeltaPill from "@/components/ui/DeltaPill";
import EmptyState from "@/components/ui/EmptyState";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import SegmentedControl from "@/components/ui/SegmentedControl";
import StockMark from "@/components/market/StockMark";
import AreaChart from "@/components/charts/AreaChart";
import { IconActivity, IconArrowRight, IconMore } from "@/components/icons";
import { getCandles, getInstruments, type Instrument } from "@/lib/api/market";
import { getStockProfile } from "@/lib/stocks";
import clsx from "@/lib/clsx";
import { useIsMobile } from "@/lib/useIsMobile";
import MobileMarket from "@/components/mobile/MobileMarket";
import { MSkeleton } from "@/components/mobile/ui";

const FILTERS = ["Все", "Растут", "Падают"];

export default function MarketScreen() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState(FILTERS[0]);
  const mobile = useIsMobile();

  useEffect(() => { getInstruments().then(setInstruments).catch(() => setError(true)); }, []);

  const rows = useMemo(
    () => instruments.filter((item) => (filter === "Растут" ? item.changePercent >= 0 : filter === "Падают" ? item.changePercent < 0 : true)),
    [filter, instruments]
  );

  if (error) return <EmptyState title="Не удалось загрузить рынок" description="Проверьте, что backend запущен, и обновите страницу." />;
  if (instruments.length === 0) return mobile ? <MSkeleton blocks={[44, 70, 50, 290, 400]} /> : <MarketSkeleton />;
  if (mobile) return <MobileMarket instruments={instruments} filters={FILTERS} filter={filter} onFilterChange={setFilter} />;

  const featured = instruments.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Котировки из рыночного движка" title="Рынок" dim="сегодня" />

      <div className="grid gap-4 md:grid-cols-3">
        {featured.map((item, index) => (
          <FeaturedCard key={item.ticker} instrument={item} index={index + 1} />
        ))}
      </div>

      <section className="space-y-4">
        <div className="q-reveal flex flex-wrap items-end justify-between gap-4" style={{ ["--i" as string]: 4 }}>
          <div>
            <p className="flex items-center gap-2 text-[14px] text-steel"><IconActivity className="h-4 w-4" />Котировки в реальном времени</p>
            <h2 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-ink">Все акции</h2>
          </div>
          <div className="w-[300px] max-w-full"><SegmentedControl options={FILTERS} value={filter} onChange={setFilter} size="sm" /></div>
        </div>

        <div className="q-reveal overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0d0d10]" style={{ ["--i" as string]: 5 }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[12.5px] text-steel">
                  <th className="py-3.5 pl-6 font-medium">№</th>
                  <th className="py-3.5 font-medium">Инструмент</th>
                  <th className="py-3.5 font-medium">Цена</th>
                  <th className="py-3.5 font-medium">Изменение</th>
                  <th className="py-3.5 font-medium">Объём</th>
                  <th className="py-3.5 font-medium">Биржа</th>
                  <th className="py-3.5 pr-6" />
                </tr>
              </thead>
              <tbody>
                {rows.map((instrument, index) => {
                  const profile = getStockProfile(instrument.ticker);
                  return (
                    <tr key={instrument.ticker} className="group q-reveal border-t border-white/[0.06] transition-colors duration-200 hover:bg-white/[0.025]" style={{ ["--i" as string]: Math.min(index, 12) + 6 }}>
                      <td className="py-4 pl-6 text-[14px] text-steel">#{index + 1}</td>
                      <td className="py-4">
                        <Link href={`/market/${instrument.ticker}`} className="focus-ring flex items-center gap-3 rounded-lg">
                          {profile ? <StockMark stock={profile} size={34} /> : <span className="grid h-[34px] w-[34px] place-items-center rounded-full bg-white/[0.08] text-[13px] font-semibold">{instrument.ticker[0]}</span>}
                          <span>
                            <span className="block text-[15px] font-medium text-ink transition-colors group-hover:text-magenta-deep">{instrument.name}</span>
                            <span className="block text-[12.5px] text-steel">{instrument.ticker}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="q-num py-4 text-[15px] font-medium text-ink">{money(instrument.price, instrument.currency)}</td>
                      <td className="py-4"><DeltaPill value={instrument.changePercent} size="sm" /></td>
                      <td className="q-num py-4 text-[14px] text-charcoal">{compact(instrument.volume)}</td>
                      <td className="py-4 text-[14px] text-steel">{instrument.exchange}</td>
                      <td className="py-4 pr-6 text-right">
                        <Link href={`/market/${instrument.ticker}`} aria-label={`Открыть ${instrument.ticker}`} className="focus-ring inline-grid h-8 w-8 place-items-center rounded-lg text-fog transition-[color,transform,background-color] duration-200 group-hover:translate-x-0.5 group-hover:bg-white/[0.05] group-hover:text-ink">
                          <IconArrowRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && <p className="border-t border-white/[0.06] px-6 py-8 text-center text-[14px] text-steel">Нет акций по этому фильтру</p>}
        </div>
      </section>
    </div>
  );
}

function FeaturedCard({ instrument, index }: { instrument: Instrument; index: number }) {
  const profile = getStockProfile(instrument.ticker);
  const [series, setSeries] = useState<number[]>([]);
  const up = instrument.changePercent >= 0;
  const color = up ? "#2EBD85" : "#F6465D";
  const accent = profile?.color && profile.color !== "#161616" ? profile.color : "#E8E8EC";

  useEffect(() => {
    getCandles(instrument.ticker, "1h", 40).then((rows) => setSeries(rows.map((row) => row.close))).catch(() => setSeries([]));
  }, [instrument.ticker]);

  return (
    <Link href={`/market/${instrument.ticker}`} className="focus-ring block rounded-[24px]">
      <Card interactive className="q-reveal relative h-[264px] overflow-hidden" style={{ ["--i" as string]: index }}>
        <div className="relative z-10 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] border" style={{ background: `${accent}1f`, borderColor: `${accent}33` }}>
                {profile ? <StockMark stock={profile} size={28} /> : null}
              </span>
              <span>
                <span className="block text-[13px] text-steel">{instrument.ticker} · {instrument.exchange}</span>
                <span className="block text-[17px] font-medium text-ink">{instrument.name.replace(/,? (Inc\.|Corporation|Platforms).*/, "")}</span>
              </span>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-white/[0.08] bg-white/[0.04] text-ink"><IconMore className="h-4 w-4" /></span>
          </div>
          <div className="relative mt-5">
            <span className="absolute -left-5 top-0.5 h-5 w-[2px] rounded-r" style={{ background: accent }} />
            <p className="text-[13px] text-steel">Цена</p>
            <p className="mt-1 text-[34px] font-semibold leading-none tracking-[-0.04em] text-ink"><Money value={instrument.price} currency={instrument.currency} /></p>
            <div className="mt-3 flex items-center gap-2">
              <span className={clsx("grid h-7 w-8 place-items-center rounded-full", up ? "bg-positive/[0.12] text-positive" : "bg-negative/[0.12] text-negative")}>
                <svg viewBox="0 0 16 16" className={clsx("h-3.5 w-3.5", !up && "-scale-y-100")} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 11.5l4-4 3 3 6-6M10.5 4.5h4v4" /></svg>
              </span>
              <DeltaPill value={instrument.changePercent} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-[72%]">
          {series.length > 1 && <AreaChart values={series} height={96} color={color} compact showAxis={false} />}
        </div>
      </Card>
    </Link>
  );
}

function MarketSkeleton() {
  return (
    <div className="space-y-8" aria-label="Загрузка рынка">
      <div className="space-y-3"><div className="skeleton h-5 w-56 rounded-md" /><div className="skeleton h-12 w-72 rounded-xl" /></div>
      <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="skeleton h-[264px] rounded-[24px]" />)}</div>
      <div className="skeleton h-[420px] rounded-[22px]" />
    </div>
  );
}

function money(value: number, currency: string): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value); }
function compact(value: number): string { return new Intl.NumberFormat("ru-RU", { notation: "compact", maximumFractionDigits: 1 }).format(value); }
