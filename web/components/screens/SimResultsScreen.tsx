import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { IconArrowUpRight, IconDownload, IconHistory, IconIdea } from "@/components/icons";
import { simResults } from "@/lib/tradingExtra";

export default function SimResultsScreen() {
  const min = Math.min(...simResults.equitySeries);
  const max = Math.max(...simResults.equitySeries);
  const range = max - min || 1;
  const points = simResults.equitySeries
    .map((v, i) => {
      const x = (i / (simResults.equitySeries.length - 1)) * 720;
      const y = 160 - ((v - min) / range) * 150;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
        Симуляция / Итоги сессии
      </p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-heading font-[485] text-ink">Результаты симуляции</h1>
          <p className="mt-1.5 text-body-sm text-steel">{simResults.sessionLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-caption uppercase tracking-[0.02em] text-steel">Итоговый капитал</p>
          <p className="mt-1 text-heading-sm font-[485] tabular-nums text-ink">{simResults.totalCapital}</p>
          <p className="mt-0.5 text-caption text-steel">Старт: {simResults.startCapital}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {simResults.cards.map((c) => (
          <Card key={c.label} className={c.tone === "highlight" ? "border-magenta/15 bg-[#FFF5FC] p-5" : "p-5"}>
            <p className="text-body-sm text-steel">{c.label}</p>
            <p className="mt-2 text-heading-sm font-[485] tabular-nums text-ink">{c.value}</p>
            <p className="mt-0.5 text-caption text-steel">{c.sub}</p>
            <p className="mt-2 text-caption text-steel">{c.meaning}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <div className="flex items-start justify-between">
          <p className="text-subheading font-[485] text-ink">Динамика капитала за сессию</p>
          <span className="text-caption text-steel">6 ч 42 мин · USD</span>
        </div>
        <div className="mt-5">
          <svg viewBox="0 0 720 170" className="w-full" style={{ height: 260 }} preserveAspectRatio="none">
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1={0} x2={720} y1={i * 45} y2={i * 45} stroke="#EEEEF2" strokeWidth={1} />
            ))}
            <polyline points={points} fill="none" stroke="#B51686" strokeWidth={2.5} />
          </svg>
          <div className="mt-1 flex justify-between text-caption text-steel">
            <span>1</span>
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
            <span>100 дней</span>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Результаты по инструментам</p>
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Инструмент</th>
                <th className="pb-2 font-[485]">Доходность</th>
                <th className="pb-2 font-[485]">Макс. просадка</th>
                <th className="pb-2 font-[485]">Сделки</th>
              </tr>
            </thead>
            <tbody>
              {simResults.comparisonRows.map((r) => (
                <tr key={r.instrument} className="border-t border-bone text-body-sm">
                  <td className="py-3 text-steel">{r.instrument}</td>
                  <td className="py-3 tabular-nums text-positive">{r.ret}</td>
                  <td className="py-3 tabular-nums text-steel">{r.drawdown}</td>
                  <td className="py-3 tabular-nums text-steel">{r.trades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <IconIdea className="h-4 w-4 text-magenta" />
            <p className="text-subheading font-[485] text-ink">{simResults.insightTitle}</p>
          </div>
          <p className="mt-3 whitespace-pre-line text-body-sm text-steel">{simResults.insightBody}</p>
          <p className="mt-3 text-caption text-fog">{simResults.insightFootnote}</p>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link href="/simulation/results/export">
          <button className="press-98 focus-ring flex items-center gap-2 text-body-sm font-[485] text-ink transition-colors duration-150 hover:text-magenta-deep">
            <IconDownload className="h-4 w-4" />
            Экспорт отчёта
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button variant="outline" icon={<IconHistory className="h-4 w-4" />}>
              История сделок
            </Button>
          </Link>
          <Link href="/terminal">
            <Button variant="primary" icon={<IconArrowUpRight className="h-4 w-4" />}>
              Перейти к торгам
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
