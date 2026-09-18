import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SearchField from "@/components/ui/SearchField";
import { IconArrowUpRight, IconChevronLeft, IconChevronRight, IconUpload } from "@/components/icons";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { instrumentSearchRows, simDatasets } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

export default function SimDataScreen() {
  return (
    <div>
      <Link
        href="/simulation/new"
        className="press-98 focus-ring flex w-fit items-center gap-1.5 text-body-sm text-steel transition-colors duration-150 hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" />
        Настройка симуляции
        <IconChevronRight className="h-3 w-3 text-fog" />
        <span className="text-ink">Исторические данные</span>
      </Link>

      <div className="mt-5">
        <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
          Симуляция / Шаг 1 из 2
        </p>
        <h1 className="mt-2 text-heading font-[485] text-ink">Выбор исторических данных</h1>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Загрузить файл</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-btn border border-dashed border-fog/60 px-4 py-10 text-center">
              <IconUpload className="h-6 w-6 text-steel" />
              <span className="text-body-sm text-ink">Перетащите CSV или нажмите для выбора</span>
              <span className="text-caption text-steel">Формат: время, open, high, low, close, volume</span>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Или выберите из биржи</p>
            <div className="mt-4">
              <SearchField placeholder="Тикер или инструмент" />
            </div>
            <div className="mt-3 flex flex-col">
              {instrumentSearchRows.map((row, i) => (
                <div
                  key={row.ticker}
                  className={clsx(
                    "press-98 flex cursor-pointer items-center justify-between gap-3 py-3",
                    i > 0 && "border-t border-[#F5F3F6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F5F8] text-caption font-[535] text-[#786480]">
                      {row.letter}
                    </span>
                    <div>
                      <p className="text-body-sm font-[535] text-ink">{row.ticker}</p>
                      <p className="text-caption text-steel">{row.company}</p>
                    </div>
                  </div>
                  <span className="text-caption text-fog">{row.rangeLabel}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-[485] text-ink">Загруженные наборы данных</p>
            <span className="text-caption text-steel">{simDatasets.length} наборов</span>
          </div>
          {simDatasets.length === 0 ? (
            <EmptyState compact className="mt-4" title={emptyStates.data.title} description={emptyStates.data.description} />
          ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Инструмент</th>
                <th className="pb-2 font-[485]">Период</th>
                <th className="pb-2 font-[485]">Свечей</th>
                <th className="pb-2 font-[485]">Пропуски</th>
                <th className="pb-2 font-[485]">Размер</th>
                <th className="pb-2 font-[485]">Статус</th>
              </tr>
            </thead>
            <tbody>
              {simDatasets.map((d, i) => (
                <tr key={i} className="border-t border-bone text-body-sm">
                  <td className="py-3 text-ink">{d.instrument}</td>
                  <td className="py-3 text-steel">{d.period}</td>
                  <td className="py-3 tabular-nums text-steel">{d.candles}</td>
                  <td className={clsx("py-3 tabular-nums", d.gapsWarn ? "text-negative" : "text-steel")}>
                    {d.gapsPercent}
                  </td>
                  <td className="py-3 tabular-nums text-steel">{d.size}</td>
                  <td className="py-3">
                    <span
                      className={clsx(
                        "rounded-pill px-2.5 py-1 text-caption font-[485]",
                        d.status === "Готово" ? "bg-positive-tint text-positive" : "bg-[#FFF4DB] text-[#99722C]"
                      )}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          <Link href="/simulation/new">
            <Button variant="primary" fullWidth className="mt-6" icon={<IconArrowUpRight className="h-4 w-4" />}>
              Продолжить к настройке
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
