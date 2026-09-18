import type { Candle } from "@/lib/types";
import { formatMoney } from "@/lib/fixtures";

const W = 900;
const CHART_H = 210;
const VOL_H = 64;
const GAP = 14;
const PAD_L = 4;
const PAD_R = 56;

export default function CandlestickChart({ candles }: { candles: Candle[] }) {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const priceMax = Math.max(...highs);
  const priceMin = Math.min(...lows);
  const pad = (priceMax - priceMin) * 0.18 || 0.2;
  const domainMax = priceMax + pad;
  const domainMin = priceMin - pad;
  const domainRange = domainMax - domainMin;

  const volMax = Math.max(...candles.map((c) => c.volume));

  const plotW = W - PAD_L - PAD_R;
  const slot = plotW / candles.length;
  const bodyW = Math.max(3, slot * 0.5);

  const yFor = (price: number) =>
    CHART_H - ((price - domainMin) / domainRange) * CHART_H;

  const last = candles[candles.length - 1];
  const lastUp = last.close >= last.open;
  const lastY = yFor(last.close);

  const gridTicks = 4;
  const gridLines = Array.from({ length: gridTicks + 1 }, (_, i) => {
    const price = domainMin + (domainRange * i) / gridTicks;
    return { price, y: yFor(price) };
  }).reverse();

  const labelEvery = Math.ceil(candles.length / 5);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${CHART_H + GAP + VOL_H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: 300 }}
      >
        {/* grid + price labels */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={PAD_L}
              x2={W - PAD_R}
              y1={g.y}
              y2={g.y}
              stroke="#f2f2f2"
              strokeWidth={1}
            />
            <text
              x={W - PAD_R + 8}
              y={g.y + 4}
              fontSize={11}
              fill="#acacac"
              fontFamily="Inter, sans-serif"
            >
              {g.price.toFixed(2).replace(".", ",")}
            </text>
          </g>
        ))}

        {/* current price dashed line */}
        <line
          x1={PAD_L}
          x2={W - PAD_R}
          y1={lastY}
          y2={lastY}
          stroke={lastUp ? "#0c8911" : "#e0294f"}
          strokeWidth={1}
          strokeDasharray="3 4"
          opacity={0.6}
        />
        <rect
          x={W - PAD_R + 2}
          y={lastY - 10}
          width={PAD_R - 4}
          height={20}
          rx={5}
          fill={lastUp ? "#0c8911" : "#e0294f"}
        />
        <text
          x={W - PAD_R + 2 + (PAD_R - 4) / 2}
          y={lastY + 4}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          fill="#ffffff"
        >
          {last.close.toFixed(2).replace(".", ",")}
        </text>

        {/* candles */}
        {candles.map((c, i) => {
          const x = PAD_L + i * slot + slot / 2;
          const up = c.close >= c.open;
          const color = up ? "#0c8911" : "#e0294f";
          const yHigh = yFor(c.high);
          const yLow = yFor(c.low);
          const yOpen = yFor(c.open);
          const yClose = yFor(c.close);
          const bodyTop = Math.min(yOpen, yClose);
          const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));

          return (
            <g
              key={c.time}
              style={{
                transformOrigin: `${x}px ${CHART_H}px`,
                animation: `growUp 260ms cubic-bezier(0.22,1,0.36,1) both`,
                animationDelay: `${i * 12}ms`,
              }}
            >
              <line
                x1={x}
                x2={x}
                y1={yHigh}
                y2={yLow}
                stroke={color}
                strokeWidth={1.4}
              />
              <rect
                x={x - bodyW / 2}
                y={bodyTop}
                width={bodyW}
                height={bodyH}
                rx={1}
                fill={color}
              />
            </g>
          );
        })}

        {/* time axis */}
        {candles.map((c, i) =>
          i % labelEvery === 0 ? (
            <text
              key={c.time}
              x={PAD_L + i * slot + slot / 2}
              y={CHART_H + 16}
              fontSize={11}
              textAnchor="middle"
              fill="#acacac"
            >
              {c.time}
            </text>
          ) : null
        )}

        {/* volume */}
        {candles.map((c, i) => {
          const x = PAD_L + i * slot + slot / 2;
          const up = c.close >= c.open;
          const h = Math.max(2, (c.volume / volMax) * VOL_H);
          const y = CHART_H + GAP + (VOL_H - h);
          return (
            <rect
              key={c.time}
              x={x - bodyW / 2}
              y={y}
              width={bodyW}
              height={h}
              rx={1}
              fill={up ? "#0c8911" : "#e0294f"}
              opacity={0.28}
              style={{
                transformOrigin: `${x}px ${CHART_H + GAP + VOL_H}px`,
                animation: `growUp 260ms cubic-bezier(0.22,1,0.36,1) both`,
                animationDelay: `${i * 12}ms`,
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}
