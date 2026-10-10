"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AreaChart from "@/components/charts/AreaChart";
import Money from "@/components/ui/Money";
import { IconExchange, IconSearch, IconX } from "@/components/icons";
import { getCandles, type Instrument } from "@/lib/api/market";
import { MChange, MCircleButton, MSectionHead, MSegmented, MStock, MTitle } from "./ui";

export default function MobileMarket({
  instruments,
  filters,
  filter,
  onFilterChange,
}: {
  instruments: Instrument[];
  filters: string[];
  filter: string;
  onFilterChange: (value: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return instruments
      .filter((item) => (filter === "Растут" ? item.changePercent >= 0 : filter === "Падают" ? item.changePercent < 0 : true))
      .filter((item) => !q || item.ticker.toLowerCase().includes(q) || item.name.toLowerCase().includes(q));
  }, [filter, instruments, query]);

  const featured = instruments.slice(0, 3);

  return (
    <div className="m-ui space-y-[22px]">
      <div className="flex items-center justify-between">
        <MTitle>Рынок</MTitle>
        <MCircleButton label={searchOpen ? "Закрыть поиск" : "Поиск"} onClick={() => { setSearchOpen((value) => !value); setQuery(""); }}>
          {searchOpen ? <IconX className="h-5 w-5" /> : <IconSearch className="h-5 w-5" />}
        </MCircleButton>
      </div>

      {searchOpen ? (
        <label className="flex h-12 animate-slide-down-fade items-center gap-2.5 rounded-full border border-white/[0.07] bg-[#16161B] px-4">
          <IconSearch className="h-[18px] w-[18px] text-[#8C8C97]" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Тикер или компания" aria-label="Поиск акции" className="w-full bg-transparent text-[15px] font-medium text-[#F4F4F6] outline-none placeholder:text-[#5C5C66]" />
        </label>
      ) : (
        <p className="text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#F4F4F6]">
          Все акции —<br />под присмотром агентов<span className="text-[#6C5CFF]">.</span>
        </p>
      )}

      <MSegmented options={filters} value={filter} onChange={onFilterChange} />

      {!query && (
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          {featured.map((item) => (
            <FeaturedCard key={item.ticker} instrument={item} />
          ))}
        </div>
      )}

      <MSectionHead title={query ? `Найдено: ${rows.length}` : "Все акции"} />
      {rows.length === 0 ? (
        <p className="rounded-[20px] bg-[#16161B] px-5 py-8 text-center text-[14px] font-medium text-[#8C8C97]">Нет акций по этому фильтру</p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((item) => (
            <Link key={item.ticker} href={`/market/${item.ticker}`} className="focus-ring flex items-center gap-3 rounded-[20px] bg-[#16161B] p-3.5 transition-colors active:bg-[#1c1c22]">
              <MStock ticker={item.ticker} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-bold text-[#F4F4F6]">{shortName(item.name)}</span>
                <span className="block text-[12px] font-semibold text-[#8C8C97]">{item.ticker} · {item.exchange}</span>
              </span>
              <span className="text-right">
                <span className="q-num block text-[15px] font-bold text-[#F4F4F6]">{price(item.price, item.currency)}</span>
                <MChange value={item.changePercent} className="block text-[12px]" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedCard({ instrument }: { instrument: Instrument }) {
  const [series, setSeries] = useState<number[]>([]);
  const up = instrument.changePercent >= 0;

  useEffect(() => {
    getCandles(instrument.ticker, "1h", 40).then((rows) => setSeries(rows.map((row) => row.close))).catch(() => setSeries([]));
  }, [instrument.ticker]);

  return (
    <Link
      href={`/market/${instrument.ticker}`}
      className="focus-ring block w-[290px] shrink-0 snap-start rounded-[28px] border border-white/[0.07] p-[18px]"
      style={{ background: "linear-gradient(180deg, #211C3D 0%, #16161B 100%)" }}
    >
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-2.5">
          <MStock ticker={instrument.ticker} size={40} />
          <span>
            <span className="block text-[16px] font-extrabold text-[#F4F4F6]">{instrument.ticker}</span>
            <span className="block max-w-[150px] truncate text-[12px] font-semibold text-[#8C8C97]">{shortName(instrument.name)}</span>
          </span>
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#212128] text-[#F4F4F6]"><IconExchange className="h-[18px] w-[18px]" /></span>
      </span>
      <span className="mt-4 block text-[13px] font-semibold text-[#8C8C97]">Цена</span>
      <span className="mt-0.5 block text-[34px] font-extrabold leading-none tracking-[-0.03em] text-[#F4F4F6]">
        <Money value={instrument.price} currency={instrument.currency} dimClassName="text-[#5C5C66]" />
      </span>
      <span className="relative mt-3 block h-[88px]">
        {series.length > 1 && <AreaChart values={series} height={88} color={up ? "#9C90FF" : "#F6465D"} compact showAxis={false} />}
        <span className={`absolute right-0 top-0 rounded-full px-2.5 py-1 text-[12px] font-extrabold text-white ${up ? "bg-[#6C5CFF]" : "bg-[#F6465D]"}`}>
          {up ? "+" : "−"}
          {Math.abs(instrument.changePercent).toFixed(2).replace(".", ",")}%
        </span>
      </span>
    </Link>
  );
}

function shortName(name: string) { return name.replace(/,? (Inc\.|Corporation|Platforms|Corp\.|Company).*/, ""); }
function price(value: number, currency: string) { return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value); }
