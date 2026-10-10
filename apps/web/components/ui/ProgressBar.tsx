// Track + fill; the fill grows in from the left on mount (CSS only) and
// eases to new values afterwards.
export default function ProgressBar({
  percent,
  color = "linear-gradient(90deg, #6C5CFF 0%, #A79CFF 100%)",
  track = "rgba(255,255,255,0.07)",
  height = 6,
}: {
  percent: number;
  color?: string;
  track?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="w-full overflow-hidden rounded-full" style={{ background: track, height }}>
      <div className="q-grow-x h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${clamped}%`, background: color }} />
    </div>
  );
}
