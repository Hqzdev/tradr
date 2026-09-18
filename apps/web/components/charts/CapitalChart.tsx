const W = 730;
const H = 200;

export default function CapitalChart({
  data,
  agentColor,
}: {
  data: { day: number; agent: number; nasdaq: number }[];
  agentColor: string;
}) {
  const allValues = data.flatMap((d) => [d.agent, d.nasdaq]);
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);
  const pad = (max - min) * 0.12 || 1000;
  const domainMax = max + pad;
  const domainMin = min - pad;
  const domainRange = domainMax - domainMin;
  const maxDay = data[data.length - 1].day || 1;

  const xFor = (day: number) => (day / maxDay) * W;
  const yFor = (v: number) => H - ((v - domainMin) / domainRange) * H;

  const gridTicks = 3;
  const gridLines = Array.from({ length: gridTicks + 1 }, (_, i) => {
    const v = domainMin + (domainRange * i) / gridTicks;
    return { v, y: yFor(v) };
  }).reverse();

  const agentPoints = data
    .map((d) => `${xFor(d.day).toFixed(1)},${yFor(d.agent).toFixed(1)}`)
    .join(" ");
  const nasdaqPoints = data
    .map((d) => `${xFor(d.day).toFixed(1)},${yFor(d.nasdaq).toFixed(1)}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 20}`}
      className="w-full"
      preserveAspectRatio="none"
      style={{ height: 220 }}
    >
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={0} x2={W} y1={g.y} y2={g.y} stroke="#f2f2f2" strokeWidth={1} />
          <text x={0} y={g.y - 5} fontSize={11} fill="#acacac">
            {Math.round(g.v).toLocaleString("ru-RU")}
          </text>
        </g>
      ))}
      <polyline
        points={nasdaqPoints}
        fill="none"
        stroke="#C7C2CC"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={agentPoints}
        fill="none"
        stroke={agentColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
