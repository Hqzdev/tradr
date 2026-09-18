import type { Candle } from "@/lib/types";

export default function Sparkline({
  candles,
  color = "#ff37c7",
  width = 96,
  height = 32,
}: {
  candles: Candle[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const closes = candles.map((c) => c.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const step = width / (closes.length - 1);

  const points = closes
    .map((c, i) => {
      const x = i * step;
      const y = height - ((c - min) / range) * (height - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline
        points={points}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
