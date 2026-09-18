"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PercentTag from "@/components/ui/PercentTag";
import SegmentedControl, {
  BuySellToggle,
  TimeframeControl,
} from "@/components/ui/SegmentedControl";
import FieldBox from "@/components/ui/FieldBox";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import Sparkline from "@/components/charts/Sparkline";
import CandlestickChart from "@/components/charts/CandlestickChart";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import clsx from "@/lib/clsx";
import {
  candles,
  dayHigh,
  dayLow,
  dayOpen,
  dayVolumeLabel,
  formatMoney,
  freeCash,
  lastPrice,
  orderRows,
  timeframes,
} from "@/lib/fixtures";
import { useTicker } from "@/lib/useTicker";
import { IconCandles, IconExpand, IconSettings } from "@/components/icons";

const COMMISSION_RATE = 0.001;

// Trims a share count to at most 4 decimals for the input text ("1,2" not
// "1,2000000000000002"), so fractional buys computed from a dollar amount
// read cleanly.
function formatShares(q: number): string {
  if (!Number.isFinite(q) || q <= 0) return "0";
  const trimmed = parseFloat(q.toFixed(4));
  return trimmed.toString().replace(".", ",");
}

// Cosmetic, 2-decimal version for the buy/sell button — the field itself
// (and the totals below it) keep the fuller 4-decimal precision so "$200
// of AAPL" still totals to ~$200, not a number rounded twice.
function formatSharesDisplay(q: number): string {
  if (!Number.isFinite(q) || q <= 0) return "0";
  const trimmed = parseFloat(q.toFixed(2));
  return trimmed.toString().replace(".", ",");
}

function formatAmountStr(a: number): string {
  if (!Number.isFinite(a) || a <= 0) return "0";
  return a.toFixed(2).replace(".", ",");
}

export default function TerminalScreen() {
  const [mode, setMode] = useState("Вручную");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState("Лимитная");
  const [timeframe, setTimeframe] = useState<string>("5м");
  const [priceStr, setPriceStr] = useState("192,45");
  const [qtyStr, setQtyStr] = useState("10");
  const [amountStr, setAmountStr] = useState("1924,50");
  const [filter, setFilter] = useState<"Все" | "Мои" | "Агенты">("Все");

  // Сумма is the anchor ("how much money you're putting in"), Количество
  // is derived from Сумма / Цена. Qty <-> amount cross-updates happen on
  // every keystroke (qty*price and amount/price stay close together, no
  // wild swings). Цена is different: it sits in the denominator, so
  // recalculating on every half-typed digit ("3" on its way to "300")
  // makes Количество spike through nonsense values while you type — that
  // recompute only runs once you finish editing Цена (on blur).
  const ticker = useTicker(lastPrice);

  const price = parseFloat(priceStr.replace(",", ".")) || 0;
  const qty = parseFloat(qtyStr.replace(",", ".")) || 0;
  const gross = price * qty;
  const commission = gross * COMMISSION_RATE;
  const total = gross + commission;

  function handleQtyChange(v: string) {
    setQtyStr(v);
    const q = parseFloat(v.replace(",", ".")) || 0;
    setAmountStr(price > 0 ? formatAmountStr(q * price) : "0");
  }

  function handleAmountChange(v: string) {
    setAmountStr(v);
    const a = parseFloat(v.replace(",", ".")) || 0;
    setQtyStr(price > 0 ? formatShares(a / price) : "0");
  }

  function handlePriceCommit() {
    const a = parseFloat(amountStr.replace(",", ".")) || 0;
    setQtyStr(price > 0 ? formatShares(a / price) : "0");
  }

  // Live feedback while typing a new price, without the per-keystroke spike
  // bug: wait 400ms after the last keystroke before recomputing Количество
  // from Сумма/Цена. Any further typing resets the timer. Blur still fires
  // handlePriceCommit() immediately, so finishing by tabbing/clicking away
  // is never stuck waiting on the timer.
  useEffect(() => {
    const t = setTimeout(() => {
      const a = parseFloat(amountStr.replace(",", ".")) || 0;
      setQtyStr(price > 0 ? formatShares(a / price) : "0");
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price]);

  const rows = useMemo(() => {
    if (filter === "Все") return orderRows;
    if (filter === "Мои") return orderRows.filter((r) => r.source.startsWith("Вы"));
    return orderRows.filter((r) => !r.source.startsWith("Вы"));
  }, [filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-magenta" />
          <h1 className="text-heading-sm font-[485] text-ink">Терминал</h1>
          <span className="text-body-sm text-steel">Демо-счёт · USD</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-pill border border-bone bg-white px-3.5 py-2 text-body-sm text-ink">
            Агенты: 3 активны
          </span>
          <Button variant="outline" icon={<IconSettings className="h-4 w-4" />}>
            Настройки
          </Button>
        </div>
      </div>

      <Card className="mt-6 flex items-center justify-between p-5">
        <Link href="/market/AAPL" className="press-98 focus-ring flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-magenta-tint text-body font-[535] text-magenta-deep">
            A
          </div>
          <div>
            <p className="text-body-sm font-[535] text-ink transition-colors duration-150 hover:text-magenta-deep">AAPL</p>
            <p className="text-caption text-steel">Apple Inc. · NASDAQ</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div className="rounded-btn px-2 text-right">
            <p
              className={clsx(
                "text-heading-sm font-[485] tabular-nums transition-colors duration-300",
                ticker.flash === "up" ? "text-positive" : ticker.flash === "down" ? "text-negative" : "text-ink"
              )}
            >
              {formatMoney(ticker.price, true)}
            </p>
            <p className="text-caption text-positive">+1,84% сегодня</p>
          </div>
          <Sparkline candles={candles} />
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-subheading font-[485] text-ink">AAPL / USD</p>
              <p className="mt-1 text-caption text-steel">
                О {dayOpen.toFixed(2).replace(".", ",")} · МАКС{" "}
                {dayHigh.toFixed(2).replace(".", ",")} · МИН{" "}
                {dayLow.toFixed(2).replace(".", ",")} · З{" "}
                {lastPrice.toFixed(2).replace(".", ",")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <TimeframeControl options={timeframes} value={timeframe} onChange={setTimeframe} />
              <div className="flex items-center gap-1 text-steel">
                <IconCandles className="h-4 w-4" />
                <IconExpand className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <CandlestickChart candles={candles} />
          </div>
          <p className="mt-1 text-caption text-steel">Объём · {dayVolumeLabel}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-[485] text-ink">Новая заявка</p>
            <span className="text-caption text-steel">AAPL</span>
          </div>

          <div className="mt-4">
            <SegmentedControl
              options={["Вручную", "Через агента"]}
              value={mode}
              onChange={setMode}
            />
          </div>

          <div className="mt-3">
            <BuySellToggle value={side} onChange={setSide} />
          </div>

          <div className="mt-3 flex items-center gap-4 text-body-sm">
            {["Лимитная", "Рыночная"].map((opt) => (
              <button
                key={opt}
                onClick={() => setOrderType(opt)}
                className={clsx(
                  "press-98 focus-ring pb-1 font-[485] transition-colors duration-150",
                  orderType === opt
                    ? "border-b-2 border-magenta text-ink"
                    : "text-steel hover:text-ink"
                )}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <FieldBox
              label="Цена"
              unit="USD"
              value={priceStr}
              onChange={setPriceStr}
              onCommit={handlePriceCommit}
              animated
              numericOnly
            />
            <FieldBox
              label="Количество"
              unit="акций"
              value={qtyStr}
              onChange={handleQtyChange}
              animated
              numericOnly
            />
            <FieldBox
              label="Сумма"
              unit="USD"
              value={amountStr}
              onChange={handleAmountChange}
              animated
              numericOnly
            />
          </div>
          <p className="mt-1.5 text-caption text-steel">
            Количество и сумма считаются друг из друга по цене — дробные акции разрешены.
          </p>

          <div className="mt-4 flex flex-col gap-1.5 text-body-sm tabular-nums">
            <div className="flex justify-between text-steel">
              <span>Доступно</span>
              <AnimatedNumber
                value={freeCash}
                format={(v) => formatMoney(v, true)}
                className="text-ink"
              />
            </div>
            <div className="flex justify-between text-steel">
              <span>Комиссия · 0,10%</span>
              <AnimatedNumber
                value={commission}
                format={(v) => formatMoney(v, true)}
                className="text-ink"
              />
            </div>
            <div className="flex justify-between text-steel">
              <span>Итого</span>
              <AnimatedNumber
                value={total}
                format={(v) => formatMoney(v, true)}
                className="text-ink"
              />
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth className="mt-4">
            {side === "buy" ? "Купить" : "Продать"}{" "}
            <AnimatedNumber value={qty || 0} format={formatSharesDisplay} /> AAPL
          </Button>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-subheading font-[485] text-ink">Заявки и сделки</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-body-sm">
              {(["Все", "Мои", "Агенты"] as const).map((opt, i) => (
                <span key={opt} className="flex items-center gap-2">
                  {i > 0 && <span className="text-fog">/</span>}
                  <button
                    onClick={() => setFilter(opt)}
                    className={clsx(
                      "press-98 focus-ring font-[485] transition-colors duration-150",
                      filter === opt ? "text-magenta-deep" : "text-steel hover:text-ink"
                    )}
                  >
                    {opt}
                  </button>
                </span>
              ))}
            </div>
            <div className="h-4 w-px bg-bone" />
            <Link
              href="/orders"
              className="press-98 focus-ring text-body-sm font-[485] text-steel transition-colors duration-150 hover:text-ink"
            >
              Открытые заявки
            </Link>
            <Link
              href="/history"
              className="press-98 focus-ring text-body-sm font-[485] text-steel transition-colors duration-150 hover:text-ink"
            >
              История сделок
            </Link>
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            compact
            className="mt-4"
            title={emptyStates.orders.title}
            description={emptyStates.orders.description}
          />
        ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead>
              <tr className="text-caption text-steel">
                <th className="pb-2 font-[485]">Время</th>
                <th className="pb-2 font-[485]">Источник</th>
                <th className="pb-2 font-[485]">Действие</th>
                <th className="pb-2 font-[485]">Кол-во</th>
                <th className="pb-2 font-[485]">Цена</th>
                <th className="pb-2 font-[485]">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-bone text-body-sm">
                  <td className="py-3 text-steel">{row.time}</td>
                  <td className="py-3 text-ink">{row.source}</td>
                  <td className="py-3">
                    <span
                      className={clsx(
                        "text-caption font-[535] tracking-[0.02em]",
                        row.action === "buy" ? "text-positive" : "text-negative"
                      )}
                    >
                      {row.action === "buy" ? "ПОКУПКА" : "ПРОДАЖА"}
                    </span>
                  </td>
                  <td className="py-3 tabular-nums text-ink">{row.quantity}</td>
                  <td className="py-3 tabular-nums text-ink">{formatMoney(row.price, true)}</td>
                  <td className="py-3 tabular-nums text-ink">{formatMoney(row.amount, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
