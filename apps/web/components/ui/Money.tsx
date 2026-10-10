"use client";

import clsx from "@/lib/clsx";
import { useCountUp } from "@/lib/useCountUp";

const formatter = (currency: string, decimals: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Big balance: integer part bright, fractional part muted (",45"), counts up
// on mount. Signed variant prefixes +/−.
export default function Money({
  value,
  currency = "USD",
  decimals = 2,
  signed = false,
  animate = true,
  className,
  dimClassName = "text-fog",
}: {
  value: number;
  currency?: string;
  decimals?: number;
  signed?: boolean;
  animate?: boolean;
  className?: string;
  dimClassName?: string;
}) {
  const shown = useCountUp(value, 1200, animate ? 0 : value);
  const text = formatter(currency, decimals).format(Math.abs(animate ? shown : value));
  const sep = text.lastIndexOf(",");
  const head = decimals > 0 && sep > -1 ? text.slice(0, sep) : text;
  const tail = decimals > 0 && sep > -1 ? text.slice(sep) : "";
  const sign = signed ? (value >= 0 ? "+" : "−") : value < 0 ? "−" : "";
  return (
    <span className={clsx("q-num whitespace-nowrap", className)}>
      {sign}
      {head}
      {tail && <span className={dimClassName}>{tail}</span>}
    </span>
  );
}
