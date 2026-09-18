import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CandlestickChart from "@/components/charts/CandlestickChart";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { IconChevronLeft, IconChevronRight, IconExpand, IconSettings, IconStar } from "@/components/icons";
import { stockCards } from "@/lib/tradingExtra";
import { candles } from "@/lib/fixtures";

const timeframes = ["1м", "5м", "15м", "1ч", "1Д"];

export default function StockCardScreen({ ticker }: { ticker: string }) {
  const stock = stockCards[ticker];
  if (!stock) notFound();

  const positive = stock.dayChangePercent >= 0;

  return (
    <div>
      <Link
        href="/market"
        className="press-98 focus-ring flex w-fit items-center gap-1.5 text-body-sm text-steel transition-colors duration-150 hover:text-ink"
      >
        <IconChevronLeft className="h-4 w-4" />
        Рынок
        <IconChevronRight className="h-3 w-3 text-fog" />
        <span className="text-ink">{stock.ticker}</span>
      </Link>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-bone text-body font-[535] text-ink">
            {stock.ticker[0]}
          </span>
          <div>
            <p className="text-heading-sm font-[485] text-ink">{stock.ticker}</p>
            <p className="text-caption text-steel">{stock.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <p className="text-heading-sm font-[485] tabular-nums text-ink">{stock.price}</p>
            <p className={positive ? "text-caption text-positive" : "text-caption text-negative"}>
              {positive ? "+" : ""}
              {stock.dayChangePercent.toFixed(2).replace(".", ",")}% сегодня
            </p>
          </div>
          <div className="h-11 w-px bg-bone" />
          <div>
            <p className="text-caption text-steel">Оборот за день</p>
            <p className="mt-1 text-body-sm font-[485] tabular-nums text-ink">{stock.volumeLabel}</p>
          </div>
          <Link href="/terminal">
            <Button variant="primary">Купить {stock.ticker}</Button>
          </Link>
          <Button variant="outline" icon={<IconStar className="h-4 w-4" />}>
            В наблюдение
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_376px]">
        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-subheading font-[485] text-ink">{stock.ticker} / USD</p>
                <p className="mt-1 text-caption text-steel">
                  О 192,56 · МАКС 192,65 · МИН 192,39 · З {stock.price.replace("$", "")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-caption text-steel">
                  {timeframes.map((t) => (
                    <span
                      key={t}
                      className={t === "5м" ? "rounded-pill bg-magenta-tint px-2.5 py-1 font-[485] text-magenta-deep" : "px-2.5 py-1"}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <IconSettings className="h-4 w-4 text-steel" />
                <IconExpand className="h-4 w-4 text-steel" />
              </div>
            </div>
            <div className="mt-4">
              <CandlestickChart candles={candles} />
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Показатели</p>
            <div className="mt-4 flex flex-col gap-5">
              {stock.metrics.map((row, i) => (
                <div key={i} className="grid grid-cols-3 gap-6">
                  {row.map((m) => (
                    <div key={m.label}>
                      <p className="text-caption text-steel">{m.label}</p>
                      <p className="mt-1 text-body-sm font-[485] tabular-nums text-ink">{m.value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-[18px]">
            <p className="text-subheading font-[485] text-ink">Стакан заявок</p>
            <div className="mt-3 flex flex-col gap-1">
              {[0.4, 0.15, 0.8].map((w, i) => (
                <div key={"ask" + i} className="flex items-center justify-between text-caption tabular-nums">
                  <span className="text-negative">
                    {(parseFloat(stock.price.replace(/[^0-9,]/g, "").replace(",", ".")) + (3 - i) * 0.12).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-steel">{Math.round(200 + w * 400)}</span>
                </div>
              ))}
              <div className="my-1 border-t border-bone pt-1 text-center text-caption font-[485] text-ink">
                {stock.price}
              </div>
              {[0.6, 0.3, 0.1].map((w, i) => (
                <div key={"bid" + i} className="flex items-center justify-between text-caption tabular-nums">
                  <span className="text-positive">
                    {(parseFloat(stock.price.replace(/[^0-9,]/g, "").replace(",", ".")) - (i + 1) * 0.12).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-steel">{Math.round(200 + w * 400)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-[18px]">
            <p className="text-subheading font-[485] text-ink">Новости</p>
            {stock.news.length === 0 ? (
              <EmptyState
                compact
                className="mt-3"
                title={emptyStates.news.title}
                description={emptyStates.news.description}
              />
            ) : (
              <div className="mt-3 flex flex-col">
                {stock.news.map((n, i) => (
                  <div key={i} className={i > 0 ? "border-t border-[#F5F3F6] py-3" : "pb-3"}>
                    <div className="flex items-center gap-2 text-caption">
                      <span className="font-[485] text-teal">{n.source}</span>
                      <span className="text-steel">{n.time}</span>
                    </div>
                    <p className="mt-1.5 text-body-sm text-ink">{n.headline}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
