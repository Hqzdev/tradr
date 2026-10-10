"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getInstruments, type Instrument } from "@/lib/api/market";
import { STOCK_TICKERS, getStockProfile, stockCatalog } from "@/lib/stocks";

type TickerItem = { ticker: string; price: number; change: number };

// Falls back to the catalog's demo quotes until the market endpoint answers,
// so the strip never renders empty.
const fallback: TickerItem[] = STOCK_TICKERS.slice(0, 12).map((ticker) => ({
  ticker,
  price: stockCatalog[ticker].demoPrice,
  change: stockCatalog[ticker].demoChangePercent,
}));

const price = (value: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);

export default function TickerStrip() {
  const [items, setItems] = useState<TickerItem[]>(fallback);

  useEffect(() => {
    getInstruments()
      .then((rows: Instrument[]) => {
        if (rows.length) setItems(rows.slice(0, 14).map((row) => ({ ticker: row.ticker, price: row.price, change: row.changePercent })));
      })
      .catch(() => undefined);
  }, []);

  const loop = [...items, ...items];

  return (
    <div className="q-marquee-mask relative h-[52px] overflow-hidden border-b border-white/[0.06]">
      <div className="q-marquee h-full items-center">
        {loop.map((item, index) => {
          const stock = getStockProfile(item.ticker);
          const up = item.change >= 0;
          return (
            <Link
              key={`${item.ticker}-${index}`}
              href={`/market/${item.ticker}`}
              aria-hidden={index >= items.length}
              tabIndex={index >= items.length ? -1 : undefined}
              className="group flex h-full shrink-0 items-center gap-2.5 border-r border-white/[0.06] px-6 transition-colors duration-200 hover:bg-white/[0.03]"
            >
              <span className="grid h-[22px] w-[22px] shrink-0 place-items-center overflow-hidden rounded-full" style={{ background: stock?.color ?? "#2a2a31" }}>
                {stock ? <Image src={stock.logoSrc} alt="" width={22} height={22} unoptimized className="h-[58%] w-[58%] object-contain" /> : <span className="text-[10px] font-bold text-white">{item.ticker[0]}</span>}
              </span>
              <span className="text-[14px] font-medium text-ink">{item.ticker}</span>
              <span className="q-num text-[14px] text-charcoal">{price(item.price)}</span>
              <span className={`q-num text-[13px] font-medium ${up ? "text-positive" : "text-negative"}`}>
                {up ? "+" : "−"}{Math.abs(item.change).toFixed(2).replace(".", ",")}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
