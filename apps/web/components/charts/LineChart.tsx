import type { Candle } from "@/lib/types";

const width = 900;
const height = 274;
const left = 4;
const right = 56;

export default function LineChart({ candles }: { candles: Candle[] }) {
  const values = candles.map((candle) => candle.close);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const padding = (max - min) * 0.18 || 0.2;
  const top = max + padding;
  const bottom = min - padding;
  const chartWidth = width - left - right;
  const xFor = (index: number) => left + (index / (candles.length - 1)) * chartWidth;
  const yFor = (value: number) => height - ((value - bottom) / (top - bottom)) * height;
  const points = values.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
  const area = `${left},${height} ${points} ${width - right},${height}`;
  const last = candles[candles.length - 1];
  const lastY = yFor(last.close);

  return <div className="w-full"><svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none" style={{ height: 300 }}><polygon points={area} fill="#dcf3dd" opacity="0.72" /><polyline points={points} fill="none" stroke="#0c8911" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><line x1={left} x2={width - right} y1={lastY} y2={lastY} stroke="#0c8911" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" /><rect x={width - right + 2} y={lastY - 10} width={right - 4} height="20" rx="5" fill="#0c8911" /><text x={width - right / 2} y={lastY + 4} fill="white" fontSize="11" fontWeight="600" textAnchor="middle">{last.close.toFixed(2).replace(".", ",")}</text></svg></div>;
}
