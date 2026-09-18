"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Tabs from "@/components/ui/Tabs";
import SearchField from "@/components/ui/SearchField";
import Button from "@/components/ui/Button";
import PercentTag from "@/components/ui/PercentTag";
import { AgentMarketCard } from "@/components/AgentCard";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { IconArrowUpRight, IconDot, IconSliders } from "@/components/icons";
import { agents, assets, formatMoney, indices } from "@/lib/fixtures";
import { useTicker } from "@/lib/useTicker";
import clsx from "@/lib/clsx";

export default function MarketScreen() {
  const [tab, setTab] = useState("Все акции");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("AAPL");

  const featured = agents;
  const activeCount = agents.filter((a) => a.status === "active").length;

  const filtered = useMemo(() => {
    const base = tab === "Избранное" ? assets.slice(0, 3) : assets;
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (a) => a.ticker.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
    );
  }, [tab, query]);

  const aapl = assets[0];
  const ticker = useTicker(aapl.price);

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Рынки / Акции США
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Обзор рынка</h1>
          <p className="mt-1.5 text-body text-steel">
            Котировки, позиции и торговые агенты — в одном рабочем пространстве.
          </p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-2 text-body-sm text-steel">
          <IconDot className="h-2 w-2 text-positive" />
          NASDAQ · 10:42 ET
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-6">
          <div className="grid grid-cols-3 gap-6 border-b border-bone pb-6">
            {indices.map((idx) => (
              <div key={idx.name}>
                <p className="text-caption uppercase tracking-[0.02em] text-steel">
                  {idx.name}
                </p>
                <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">
                  {idx.value}
                </p>
                <div className="mt-1">
                  <PercentTag value={idx.changePercent} size="sm" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-5">
            <Tabs options={["Все акции", "Избранное"]} value={tab} onChange={setTab} />
            <SearchField
              placeholder="Тикер или компания"
              value={query}
              onChange={setQuery}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              compact
              className="mt-4"
              title={emptyStates.search.title}
              description={emptyStates.search.description}
            />
          ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="text-caption text-steel">
                  <th className="pb-2 font-[485]">Инструмент</th>
                  <th className="pb-2 font-[485]">Цена</th>
                  <th className="pb-2 font-[485]">За день</th>
                  <th className="pb-2 font-[485]">Оборот</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset) => {
                  const isSelected = asset.ticker === selected;
                  const isAapl = asset.ticker === "AAPL";
                  const displayPrice = isAapl ? ticker.price : asset.price;
                  return (
                    <tr
                      key={asset.ticker}
                      onClick={() => setSelected(asset.ticker)}
                      className={clsx(
                        "press-98 cursor-pointer transition-colors duration-150",
                        isSelected ? "bg-magenta-tint" : "hover:bg-[#fafafa]"
                      )}
                    >
                      <td className="rounded-l-btn py-3 pl-2">
                        <Link
                          href={`/market/${asset.ticker}`}
                          onClick={(e) => e.stopPropagation()}
                          className="press-98 focus-ring block hover:text-magenta-deep"
                        >
                          <p className="text-body-sm font-[535] text-ink transition-colors duration-150 hover:text-magenta-deep">
                            {asset.ticker}
                          </p>
                          <p className="text-caption text-steel">{asset.name}</p>
                        </Link>
                      </td>
                      <td
                        className={clsx(
                          "py-3 text-body-sm font-[485] tabular-nums transition-colors duration-300",
                          isAapl && ticker.flash === "up"
                            ? "text-positive"
                            : isAapl && ticker.flash === "down"
                              ? "text-negative"
                              : "text-ink"
                        )}
                      >
                        {formatMoney(displayPrice, true)}
                      </td>
                      <td className="py-3">
                        <PercentTag value={asset.changePercent} />
                      </td>
                      <td className="rounded-r-btn py-3 pr-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-body-sm text-ink">{asset.volumeLabel}</span>
                          <IconArrowUpRight
                            className={clsx(
                              "h-4 w-4",
                              asset.changePercent >= 0 ? "text-positive" : "text-negative"
                            )}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-bone pt-4 text-caption text-steel">
            <span>Демо-котировки · USD</span>
            <span>Обновлено в 10:42:08</span>
          </div>
        </Card>

        <div className="flex flex-col">
          <p className="text-subheading font-[485] text-ink">Торговые агенты</p>
          <p className="mt-1 text-caption text-steel">
            {activeCount} агента работают · 2 сделки сегодня
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {featured.map((agent) => (
              <AgentMarketCard key={agent.id} agent={agent} />
            ))}
          </div>

          <Button variant="outline" size="md" className="mt-3" fullWidth icon={<IconSliders className="h-4 w-4" />}>
            Управление агентами
          </Button>

          <div className="mt-6 flex justify-end gap-3">
            <Link href="/portfolio">
              <Button variant="outline">Портфель</Button>
            </Link>
            <Link href="/terminal">
              <Button variant="primary" icon={<IconArrowUpRight className="h-4 w-4" />}>
                Открыть терминал
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
