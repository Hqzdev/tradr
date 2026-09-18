import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { IconChevronLeft, IconChevronRight, IconPlus } from "@/components/icons";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { positions } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

const TONE_TEXT: Record<string, string> = {
  neutral: "text-ink",
  positive: "text-positive",
  info: "text-[#7D9DCF]",
};

export default function PositionDetailScreen({ ticker }: { ticker: string }) {
  const pos = positions[ticker];
  if (!pos) notFound();

  const min = Math.min(...pos.pnlSeries);
  const max = Math.max(...pos.pnlSeries);
  const range = max - min || 1;
  const points = pos.pnlSeries
    .map((v, i) => {
      const x = (i / (pos.pnlSeries.length - 1)) * 300;
      const y = 90 - ((v - min) / range) * 80;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <Link
        href="/portfolio"
        className="press-98 focus-ring flex w-fit items-center gap-1.5 text-body-sm text-steel transition-colors duration-150 hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" />
        Портфель
        <IconChevronRight className="h-3 w-3 text-fog" />
        <span className="text-ink">{pos.ticker}</span>
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-bone text-body font-[535] text-ink">
            {pos.ticker[0]}
          </span>
          <div>
            <p className="text-heading-sm font-[485] text-ink">{pos.ticker}</p>
            <p className="text-caption text-steel">
              {pos.quantity} акций · {pos.agentName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Закрыть позицию</Button>
          <Link href="/terminal">
            <Button variant="primary" icon={<IconPlus className="h-4 w-4" />}>
              Докупить
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-caption text-steel">Средняя цена</p>
          <p className="mt-1.5 text-body font-[485] tabular-nums text-ink">{pos.avgPrice}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Текущая цена</p>
          <p className="mt-1.5 text-body font-[485] tabular-nums text-ink">{pos.currentPrice}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Прибыль</p>
          <p className="mt-1.5 text-body font-[485] tabular-nums text-positive">{pos.profit}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Доля портфеля</p>
          <p className="mt-1.5 text-body font-[485] tabular-nums text-ink">{pos.portfolioSharePercent}%</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-subheading font-[485] text-ink">Прибыль по позиции</p>
              <p className="mt-1 text-caption text-steel">
                С момента открытия {pos.openedDaysAgo} дня назад
              </p>
            </div>
            <span className="rounded-pill bg-positive-tint px-2.5 py-1 text-caption font-[485] text-positive">
              {pos.profitPercent > 0 ? "+" : ""}
              {pos.profitPercent}%
            </span>
          </div>
          <div className="mt-5">
            <svg viewBox="0 0 300 100" className="w-full" style={{ height: 200 }} preserveAspectRatio="none">
              <polyline points={points} fill="none" stroke="#00856F" strokeWidth={2} />
              <circle
                cx={0}
                cy={90 - ((pos.pnlSeries[0] - min) / range) * 80}
                r={3.5}
                fill="#00856F"
              />
            </svg>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">История входов и выходов</p>
          {pos.history.length === 0 ? (
            <EmptyState compact className="mt-4" title={emptyStates.trades.title} description={emptyStates.trades.description} />
          ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Время</th>
                <th className="pb-2 font-[485]">Тип</th>
                <th className="pb-2 font-[485]">Цена</th>
                <th className="pb-2 font-[485]">Кол-во</th>
                <th className="pb-2 font-[485]">Итог</th>
              </tr>
            </thead>
            <tbody>
              {pos.history.map((row, i) => (
                <tr key={i} className="border-t border-bone text-body-sm">
                  <td className="py-3 text-ink">{row.time}</td>
                  <td className={clsx("py-3 font-[485]", TONE_TEXT[row.tone])}>{row.type}</td>
                  <td className="py-3 tabular-nums text-ink">{row.price}</td>
                  <td className="py-3 tabular-nums text-steel">{row.qty}</td>
                  <td className={clsx("py-3 tabular-nums", row.total.startsWith("+") ? "text-positive" : "text-ink")}>
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </Card>
      </div>
    </div>
  );
}
