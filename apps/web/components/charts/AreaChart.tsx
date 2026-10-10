"use client";

import { useId, useMemo, useState, type PointerEvent } from "react";
import { useElementWidth } from "@/lib/useElementWidth";

// Responsive area/line chart drawn in real pixels. The line draws itself in,
// the gradient fades up after it, and hovering shows a crosshair + tooltip.
export default function AreaChart({
  values,
  height = 220,
  color = "#6C5CFF",
  labels,
  formatValue = (v) => v.toFixed(2),
  yTicks = 4,
  showAxis = true,
  axisFormat,
  compact = false,
  className,
}: {
  values: number[];
  height?: number;
  color?: string;
  labels?: string[];
  formatValue?: (value: number) => string;
  yTicks?: number;
  showAxis?: boolean;
  axisFormat?: (value: number) => string;
  compact?: boolean;
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const axisWidth = showAxis && !compact ? 56 : 0;
  const plotW = Math.max(40, width - axisWidth);
  const top = compact ? 4 : 14;
  const bottom = compact ? 4 : 10;

  const geo = useMemo(() => {
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, Math.abs(max) * 0.002, 0.01);
    const lo = min - span * 0.12;
    const hi = max + span * 0.12;
    const x = (i: number) => (i / (values.length - 1)) * plotW;
    const y = (v: number) => top + ((hi - v) / (hi - lo)) * (height - top - bottom);
    const pts = values.map((v, i) => [x(i), y(v)] as const);
    const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
    const area = `${line} L${plotW} ${height} L0 ${height} Z`;
    const ticks = Array.from({ length: yTicks }, (_, i) => hi - ((hi - lo) * (i + 0.5)) / yTicks);
    return { pts, line, area, ticks, y };
  }, [values, plotW, height, top, bottom, yTicks]);

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!geo || compact) return;
    const box = event.currentTarget.getBoundingClientRect();
    const rel = Math.min(Math.max(event.clientX - box.left - axisWidth, 0), plotW);
    setHover(Math.round((rel / plotW) * (values.length - 1)));
  };

  const fmtAxis = axisFormat ?? formatValue;
  const active = hover !== null && geo ? geo.pts[hover] : null;
  const last = geo ? geo.pts[geo.pts.length - 1] : null;

  return (
    <div ref={ref} className={className} style={{ height }} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      {geo ? (
        <div className="relative h-full w-full">
          <svg width={width} height={height} className="block overflow-visible" role="img" aria-label="График">
            <defs>
              <linearGradient id={`g${gradientId}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={color} stopOpacity={compact ? 0.28 : 0.32} />
                <stop offset="1" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            {showAxis && !compact &&
              geo.ticks.map((tick) => (
                <g key={tick}>
                  <line x1={axisWidth} x2={width} y1={geo.y(tick)} y2={geo.y(tick)} stroke="rgba(255,255,255,0.05)" />
                  <text x={0} y={geo.y(tick) + 4} fill="#8A8A93" fontSize="11" className="q-num">
                    {fmtAxis(tick)}
                  </text>
                </g>
              ))}
            <g transform={`translate(${axisWidth},0)`}>
              <path d={geo.area} fill={`url(#g${gradientId})`} className="q-area" />
              <path d={geo.line} pathLength={1} fill="none" stroke={color} strokeWidth={compact ? 1.75 : 2} strokeLinejoin="round" strokeLinecap="round" className="q-draw" />
              {!compact && last && (
                <circle cx={last[0]} cy={last[1]} r="4.5" fill="#0b0b0f" stroke="#fff" strokeWidth="2" className="q-dot-in" />
              )}
              {active && (
                <g className="animate-fade-in">
                  <line x1={active[0]} x2={active[0]} y1={0} y2={height} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 4" />
                  <circle cx={active[0]} cy={active[1]} r="5" fill="#0b0b0f" stroke={color} strokeWidth="2.5" />
                </g>
              )}
            </g>
          </svg>
          {active && hover !== null && (
            <div
              className="pointer-events-none absolute z-10 rounded-[10px] border border-white/[0.1] bg-[#1b1b21]/95 px-3 py-2 shadow-elevated backdrop-blur"
              style={{
                left: Math.min(axisWidth + active[0] + 12, width - 150),
                top: Math.max(4, active[1] - 58),
              }}
            >
              {labels?.[hover] && <p className="text-[11px] text-steel">{labels[hover]}</p>}
              <p className="q-num text-[14px] font-semibold text-ink">{formatValue(values[hover])}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid h-full place-items-center rounded-[14px] border border-dashed border-white/[0.08] text-[13px] text-steel">
          Данных для графика пока нет
        </div>
      )}
    </div>
  );
}
