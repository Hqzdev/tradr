"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import FieldBox from "@/components/ui/FieldBox";
import SegmentedControl, { BuySellToggle } from "@/components/ui/SegmentedControl";
import { ApiError } from "@/lib/api/client";
import { createOrder, type Holding, type Portfolio } from "@/lib/api/trading";
import { OrderCalculator, type OrderAnchor } from "@/lib/OrderCalculator";

function errorMessage(error: unknown, side: "buy" | "sell"): string {
  if (!(error instanceof ApiError)) return "Backend недоступен. Введённые данные сохранены — попробуйте ещё раз.";
  if (error.status === 400 || error.status === 409 || error.status === 422) {
    return side === "buy" ? "Недостаточно средств или указано неверное значение." : "Недостаточно акций или указано неверное значение.";
  }
  return "Не удалось отправить заявку. Введённые данные сохранены.";
}

export default function StockOrderPanel({
  ticker,
  price,
  portfolio,
  holding,
  onCompleted,
}: {
  ticker: string;
  price: number;
  portfolio: Portfolio | null;
  holding: Holding | null;
  onCompleted: (message: string) => Promise<void>;
}) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [anchor, setAnchor] = useState<OrderAnchor>("amount");
  const [value, setValue] = useState("");
  const [limitPrice, setLimitPrice] = useState(price.toFixed(2).replace(".", ","));
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  const calculationPrice = orderType === "limit" ? limitPrice : price.toFixed(2);
  const preview = useMemo(() => OrderCalculator.calculate(calculationPrice, anchor, value, side), [anchor, calculationPrice, side, value]);
  const balance = portfolio?.cashBalance ?? 0;
  const shares = holding?.quantity ?? 0;
  const canSubmit = preview.valid && !submitting;

  const updateValue = (next: string) => {
    if (OrderCalculator.accepts(next, anchor === "quantity" ? 8 : 2)) setValue(next);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const result = await createOrder({
        ticker,
        side,
        orderType,
        ...(anchor === "quantity" ? { quantity: value.replace(",", ".") } : { amount: value.replace(",", ".") }),
        ...(orderType === "limit" ? { limitPrice: limitPrice.replace(",", ".") } : {}),
      });
      const text = result.status.toUpperCase() === "FILLED" ? "Сделка исполнена" : "Заявка выставлена";
      setNotice({ tone: "success", text });
      setValue("");
      await onCompleted(text);
    } catch (error) {
      setNotice({ tone: "error", text: errorMessage(error, side) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside id="trade-panel" className="rounded-[24px] border border-[#ece8ee] bg-white p-4 shadow-widget sm:p-5" aria-label="Торговая панель">
      <BuySellToggle value={side} onChange={(value) => { setSide(value); setNotice(null); }} />
      <div className="mt-3"><SegmentedControl options={["Рыночная", "Лимитная"]} value={orderType === "market" ? "Рыночная" : "Лимитная"} onChange={(value) => setOrderType(value === "Рыночная" ? "market" : "limit")} size="sm" /></div>
      <div className="mt-3"><SegmentedControl options={["По сумме", "По количеству"]} value={anchor === "amount" ? "По сумме" : "По количеству"} onChange={(value) => { setAnchor(value === "По сумме" ? "amount" : "quantity"); setValue(""); }} size="sm" /></div>

      <div className="mt-4 space-y-3">
        <FieldBox label={anchor === "amount" ? "Сумма" : "Количество"} unit={anchor === "amount" ? "$" : ticker} value={value} onChange={updateValue} numericOnly decimalInput />
        {orderType === "limit" && <FieldBox label="Лимитная цена" unit="$" value={limitPrice} onChange={(next) => { if (OrderCalculator.accepts(next, 2)) setLimitPrice(next); }} numericOnly decimalInput />}
      </div>

      <div className="mt-4 rounded-[16px] bg-[#fafafb] p-4 text-body-sm">
        <div className="flex justify-between text-steel"><span>Цена</span><span className="tabular-nums text-ink">${OrderCalculator.money(Number(calculationPrice.replace(",", ".")) || 0)}</span></div>
        <div className="mt-2 flex justify-between text-steel"><span>Количество</span><span className="tabular-nums text-ink">{OrderCalculator.shares(preview.quantity)} {ticker}</span></div>
        <div className="mt-2 flex justify-between text-steel"><span>Комиссия 0,1%</span><span className="tabular-nums text-ink">${OrderCalculator.money(preview.commission)}</span></div>
        <div className="my-3 border-t border-bone" />
        <div className="flex justify-between font-[600] text-ink"><span>{side === "buy" ? "К оплате" : "К получению"}</span><span className="tabular-nums">${OrderCalculator.money(preview.total)}</span></div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-caption text-steel">
        <span>Доступно<br /><strong className="font-[550] text-ink">${balance.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}</strong></span>
        <span className="text-right">Позиция<br /><strong className="font-[550] text-ink">{OrderCalculator.shares(shares)} {ticker}</strong></span>
      </div>

      {notice && <p role="status" className={`mt-4 rounded-[14px] px-3 py-2.5 text-body-sm ${notice.tone === "success" ? "bg-positive-tint text-positive" : "bg-negative-tint text-negative"}`}>{notice.text}</p>}
      <Button variant="primary" size="lg" fullWidth className="mt-4" disabled={!canSubmit} onClick={handleSubmit}>
        {submitting ? "Отправляем…" : side === "buy" ? `Купить ${ticker}` : `Продать ${ticker}`}
      </Button>
      <p className="mt-3 text-center text-[11px] leading-4 text-fog">Учебная торговля. Реальные средства не используются.</p>
    </aside>
  );
}
