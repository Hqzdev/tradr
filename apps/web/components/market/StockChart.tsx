"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartCandlestickIcon, ChartLineData01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import Button from "@/components/ui/Button";
import { TimeframeControl } from "@/components/ui/SegmentedControl";
import type { MarketCandle, MarketTimeframe } from "@/lib/api/market";

type ChartMode = "line" | "candles";

const timeframeLabels: Record<string, MarketTimeframe> = { "1м": "1m", "5м": "5m", "15м": "15m", "1ч": "1h", "1Д": "1d" };
const labelByTimeframe = Object.fromEntries(Object.entries(timeframeLabels).map(([label, value]) => [value, label]));

function money(value: number): string {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
}

export default function StockChart({
  candles,
  timeframe,
  loading,
  error,
  onTimeframeChange,
  onRetry,
}: {
  candles: MarketCandle[];
  timeframe: MarketTimeframe;
  loading: boolean;
  error: string;
  onTimeframeChange: (value: MarketTimeframe) => void;
  onRetry: () => void;
}) {
  const [mode, setMode] = useState<ChartMode>("line");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const width = 760;
  const height = 350;
  const plotTop = 22;
  const plotBottom = 278;

  const geometry = useMemo(() => {
    if (!candles.length) return null;
    const min = Math.min(...candles.map((candle) => candle.low));
    const max = Math.max(...candles.map((candle) => candle.high));
    const range = Math.max(max - min, 0.01);
    const x = (index: number) => 18 + (index / Math.max(candles.length - 1, 1)) * (width - 36);
    const y = (price: number) => plotTop + ((max - price) / range) * (plotBottom - plotTop);
    const points = candles.map((candle, index) => `${x(index)},${y(candle.close)}`).join(" ");
    return { min, max, x, y, points };
  }, [candles]);

  const handlePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (!candles.length || !chartRef.current) return;
    const bounds = chartRef.current.getBoundingClientRect();
    const position = Math.min(Math.max(event.clientX - bounds.left, 0), bounds.width);
    setHoveredIndex(Math.round((position / bounds.width) * (candles.length - 1)));
  };

  const activeCandle = hoveredIndex === null ? candles.at(-1) : candles[hoveredIndex];
  const maxVolume = Math.max(...candles.map((candle) => candle.volume), 1);

  return (
    <section className="rounded-[24px] border border-[#ece8ee] bg-white p-4 shadow-soft sm:p-5" aria-label="График цены">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TimeframeControl
          options={Object.keys(timeframeLabels)}
          value={labelByTimeframe[timeframe] ?? "1ч"}
          onChange={(label) => onTimeframeChange(timeframeLabels[label])}
        />
        <div className="flex rounded-pill border border-bone bg-[#fafafa] p-1" aria-label="Тип графика">
          {(["line", "candles"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`focus-ring grid h-8 w-9 place-items-center rounded-pill transition-colors ${mode === value ? "bg-white text-ink shadow-soft" : "text-steel hover:text-ink"}`}
              onClick={() => setMode(value)}
              aria-label={value === "line" ? "Линейный график" : "Свечной график"}
              aria-pressed={mode === value}
            >
              <HugeiconsIcon icon={value === "line" ? ChartLineData01Icon : ChartCandlestickIcon} className="h-4 w-4" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-h-[350px]">
        {loading ? (
          <div className="skeleton h-[350px] rounded-[18px]" aria-label="Загрузка графика" />
        ) : error ? (
          <div className="flex h-[350px] flex-col items-center justify-center rounded-[18px] bg-[#fafafb] text-center">
            <p className="text-body-sm font-[535] text-ink">Не удалось загрузить свечи</p>
            <p className="mt-1 max-w-sm text-caption text-steel">{error}</p>
            <Button className="mt-4" size="sm" icon={<HugeiconsIcon icon={Refresh01Icon} className="h-4 w-4" />} onClick={onRetry}>Повторить</Button>
          </div>
        ) : !geometry ? (
          <div className="flex h-[350px] items-center justify-center rounded-[18px] bg-[#fafafb] text-body-sm text-steel">Для этого периода пока нет данных</div>
        ) : (
          <div ref={chartRef} className="relative h-[350px] touch-pan-y" onPointerMove={handlePointer} onPointerLeave={() => setHoveredIndex(null)}>
            {activeCandle && (
              <div className="pointer-events-none absolute left-3 top-2 z-10 rounded-xl border border-bone bg-white/90 px-3 py-2 text-caption shadow-soft backdrop-blur">
                <strong className="font-[600] text-ink">{money(activeCandle.close)}</strong>
                <span className="ml-2 text-steel">Объём {activeCandle.volume.toLocaleString("ru-RU")}</span>
              </div>
            )}
            <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={`${mode === "line" ? "Линейный" : "Свечной"} график цены`}>
              <defs>
                <linearGradient id="stockArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff37c7" stopOpacity=".2" /><stop offset="1" stopColor="#ff37c7" stopOpacity="0" /></linearGradient>
              </defs>
              {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="18" x2={width - 18} y1={plotTop + line * 64} y2={plotTop + line * 64} stroke="#f0edf1" strokeWidth="1" />)}
              {mode === "line" ? (
                <>
                  <polygon points={`18,${plotBottom} ${geometry.points} ${width - 18},${plotBottom}`} fill="url(#stockArea)" />
                  <polyline points={geometry.points} fill="none" stroke="#ec23b3" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
                </>
              ) : candles.map((candle, index) => {
                const rising = candle.close >= candle.open;
                const x = geometry.x(index);
                const candleWidth = Math.max(2.5, Math.min(8, (width - 36) / candles.length * .62));
                return <g key={candle.timestamp}><line x1={x} x2={x} y1={geometry.y(candle.high)} y2={geometry.y(candle.low)} stroke={rising ? "#0c8911" : "#e0294f"} strokeWidth="1.2" /><rect x={x - candleWidth / 2} y={Math.min(geometry.y(candle.open), geometry.y(candle.close))} width={candleWidth} height={Math.max(2, Math.abs(geometry.y(candle.open) - geometry.y(candle.close)))} rx="1" fill={rising ? "#0c8911" : "#e0294f"} /></g>;
              })}
              {candles.map((candle, index) => {
                const barWidth = Math.max(2, Math.min(7, (width - 36) / candles.length * .58));
                const barHeight = (candle.volume / maxVolume) * 42;
                return <rect key={`volume-${candle.timestamp}`} x={geometry.x(index) - barWidth / 2} y={height - barHeight - 8} width={barWidth} height={barHeight} rx="1" fill={candle.close >= candle.open ? "#b9dfba" : "#f3beca"} />;
              })}
              {hoveredIndex !== null && <line x1={geometry.x(hoveredIndex)} x2={geometry.x(hoveredIndex)} y1={plotTop} y2={height - 8} stroke="#a8a1aa" strokeDasharray="4 4" />}
            </svg>
          </div>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] text-fog"><span>Цена</span><span>Объём</span></div>
    </section>
  );
}
