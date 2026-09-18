const values = [0, 130, 70, 520, 340, 900, 680, 1310, 1120, 1740, 1590, 2140];
const width = 720;
const height = 270;
const padding = 22;

export default function PositionProfitChart() {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const xFor = (index: number) => (index / (values.length - 1)) * width;
  const yFor = (value: number) => height - padding - ((value - min) / (max - min)) * (height - padding * 2);
  const points = values.map((value, index) => `${xFor(index)},${yFor(value)}`).join(" ");
  const area = `0,${height} ${points} ${width},${height}`;
  const lastX = xFor(values.length - 1);
  const lastY = yFor(values[values.length - 1]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[260px] w-full" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((step) => (
        <line key={step} x1="0" x2={width} y1={height * step} y2={height * step} stroke="#f2f2f2" />
      ))}
      <polygon points={area} fill="#dcf3dd" opacity="0.72" />
      <polyline points={points} fill="none" stroke="#168b69" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill="#168b69" />
      <g transform={`translate(${Math.max(lastX - 88, 8)} ${Math.max(lastY - 38, 8)})`}>
        <rect width="82" height="26" rx="8" fill="#131313" />
        <text x="41" y="17" fill="white" fontSize="11" textAnchor="middle">+$1 140,00</text>
      </g>
      <text x="0" y={height - 4} fill="#acacac" fontSize="11">−$200</text>
      <text x={width} y={height - 4} fill="#acacac" fontSize="11" textAnchor="end">сейчас</text>
    </svg>
  );
}
