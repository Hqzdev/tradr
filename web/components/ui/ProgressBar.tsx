export default function ProgressBar({
  percent,
  color = "#B51686",
  track = "#F0ECF1",
  height = 6,
}: {
  percent: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="w-full overflow-hidden rounded-pill"
      style={{ backgroundColor: track, height }}
    >
      <div
        className="h-full rounded-pill transition-[width] duration-500 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
