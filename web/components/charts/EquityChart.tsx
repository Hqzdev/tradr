import type { EquityPoint } from "@/lib/types";
import { formatMoney } from "@/lib/fixtures";

const W = 760;
const H = 220;
const PAD_R = 0;

const SERIES: { key: keyof Omit<EquityPoint, "day">; label: string; color: string }[] = [
  { key: "aggressive", label: "Агрессивный", color: "#e01a2b" },
  { key: "careful", label: "Осторожный", color: "#0c8911" },
  { key: "random", label: "Случайный", color: "#8251fb" },
];

export default function EquityChart({ data }: { data: EquityPoint[] }) {
  const allValues = data.flatMap((d) => [d.aggressive, d.careful, d.random]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const pad = (max - min) * 0.1 || 1000;
  const domainMax = max + pad;
  const domainMin = min - pad;
  const domainRange = domainMax - domainMin;

  const xFor = (day: number) => (day / 100) * (W - PAD_R);
  const yFor = (v: number) => H - ((v - domainMin) / domainRange) * H;

  const gridTicks = 4;
  const gridLines = Array.from({ length: gridTicks + 1 }, (_, i) => {
    const v = domainMin + (domainRange * i) / gridTicks;
    return { v, y: yFor(v) };
  }).reverse();

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
      <svg
        viewBox={`0 0 ${W} ${H + 24}`}
        className="w-full flex-1"
        preserveAspectRatio="none"
        style={{ height: 260 }}
      >
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={0} x2={W} y1={g.y} y2={g.y} stroke="#f2f2f2" strokeWidth={1} />
            <text x={0} y={g.y - 5} fontSize={11} fill="#acacac">
              {Math.round(g.v).toLocaleString("ru-RU")}
            </text>
          </g>
        ))}

        {[0, 20, 40, 60, 80, 100].map((d) => (
          <text
            key={d}
            x={xFor(d)}
            y={H + 18}
            fontSize={11}
            textAnchor={d === 0 ? "start" : d === 100 ? "end" : "middle"}
            fill="#acacac"
          >
            {d === 100 ? "100 дней" : d}
          </text>
        ))}

        {SERIES.map((s) => {
          const points = data
            .map((d) => `${xFor(d.day).toFixed(1)},${yFor(d[s.key]).toFixed(1)}`)
            .join(" ");
          return (
            <polyline
              key={s.key}
              points={points}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>

      <div className="flex shrink-0 flex-row gap-6 lg:flex-col lg:gap-4">
        {SERIES.map((s) => {
          const finalPoint = data[data.length - 1];
          return (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <div>
                <p className="text-body-sm font-[535] tabular-nums text-ink">
                  {formatMoney(finalPoint[s.key])}
                </p>
                <p className="text-caption text-steel">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
