"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Bookmark01Icon, BookmarkCheck01Icon } from "@hugeicons/core-free-icons";
import AreaChart from "@/components/charts/AreaChart";
import Money from "@/components/ui/Money";
import { IconAgents, IconArrowRight, IconSparkles } from "@/components/icons";
import type { InstrumentDetails, MarketCandle, MarketTimeframe } from "@/lib/api/market";
import type { Trade } from "@/lib/api/trading";
import type { StockProfile } from "@/lib/stocks";
import clsx from "@/lib/clsx";
import { MCard, MCircleButton, MSectionHead, MSegmented, MStock, usd } from "./ui";

const TIMEFRAMES: { label: string; value: MarketTimeframe }[] = [
  { label: "1м", value: "1m" },
  { label: "5м", value: "5m" },
  { label: "15м", value: "15m" },
  { label: "1ч", value: "1h" },
  { label: "1Д", value: "1d" },
];

export default function MobileStockDetail({
  profile,
  details,
  price,
  change,
  candles,
  timeframe,
  chartLoading,
  chartError,
  pageError,
  loading,
  trades,
  agentObservers,
  watched,
  onWatchToggle,
  onTimeframeChange,
  onRetryChart,
  onRetryPage,
}: {
  profile: StockProfile;
  details: InstrumentDetails | null;
  price: number;
  change: number;
  candles: MarketCandle[];
  timeframe: MarketTimeframe;
  chartLoading: boolean;
  chartError: string;
  pageError: string;
  loading: boolean;
  trades: Trade[];
  agentObservers: string[];
  watched: boolean;
  onWatchToggle: () => void;
  onTimeframeChange: (value: MarketTimeframe) => void;
  onRetryChart: () => void;
  onRetryPage: () => void;
}) {
  const up = change >= 0;
  const metrics = details?.metrics.slice(0, 6) ?? [];

  return (
    <div className="m-ui space-y-5">
      <div className="flex items-center justify-between">
        <MCircleButton label="Назад к рынку" href="/market"><HugeiconsIcon icon={ArrowLeft01Icon} className="h-5 w-5" strokeWidth={2} /></MCircleButton>
        <p className="text-[17px] font-bold text-[#F4F4F6]">{profile.ticker}</p>
        <MCircleButton label={watched ? "Убрать из наблюдения" : "Наблюдать"} onClick={onWatchToggle} className={watched ? "!bg-[#6C5CFF]" : undefined}>
          <HugeiconsIcon icon={watched ? BookmarkCheck01Icon : Bookmark01Icon} className="h-5 w-5" strokeWidth={2} />
        </MCircleButton>
      </div>

      <div>
        <p className="flex items-center gap-2 text-[14px] font-semibold text-[#8C8C97]">
          <MStock ticker={profile.ticker} size={24} />
          {profile.name}
        </p>
        <p className="mt-2 text-[40px] font-extrabold leading-none tracking-[-0.035em] text-[#F4F4F6]">
          <Money value={price} animate={false} dimClassName="text-[#5C5C66]" />
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className={clsx("rounded-full px-2.5 py-1 text-[13px] font-extrabold", up ? "bg-[#6C5CFF]/[0.16] text-[#B3A9FF]" : "bg-[#F6465D]/[0.14] text-[#F6465D]")}>
            {up ? "+" : "−"}
            {Math.abs(change).toFixed(2).replace(".", ",")}%
          </span>
          <span className="text-[13px] font-semibold text-[#8C8C97]">сегодня · объём {(details?.instrument.volume ?? 0).toLocaleString("ru-RU")}</span>
        </div>
      </div>

      {pageError && (
        <button type="button" onClick={onRetryPage} className="w-full rounded-[16px] border border-[#F0B429]/30 bg-[#F0B429]/[0.08] px-4 py-3 text-left text-[13px] font-semibold text-[#F0B429]">
          {pageError} Нажмите, чтобы повторить.
        </button>
      )}

      <MSegmented
        options={TIMEFRAMES.map((item) => item.label)}
        value={TIMEFRAMES.find((item) => item.value === timeframe)?.label ?? "1ч"}
        onChange={(label) => onTimeframeChange(TIMEFRAMES.find((item) => item.label === label)?.value ?? "1h")}
      />

      <MCard className="p-4 pr-2">
        {chartLoading ? (
          <div className="skeleton h-[220px] rounded-[16px]" />
        ) : chartError ? (
          <button type="button" onClick={onRetryChart} className="grid h-[220px] w-full place-items-center rounded-[16px] bg-[#212128] px-6 text-center text-[13px] font-semibold text-[#8C8C97]">
            {chartError} Нажмите, чтобы повторить.
          </button>
        ) : candles.length > 1 ? (
          <AreaChart
            values={candles.map((candle) => candle.close)}
            labels={candles.map((candle) => new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(candle.timestamp)))}
            height={220}
            color={up ? "#9C90FF" : "#F6465D"}
            formatValue={(value) => usd(value)}
            axisFormat={(value) => `$${value.toFixed(0)}`}
          />
        ) : (
          <p className="grid h-[220px] place-items-center text-[13px] font-medium text-[#8C8C97]">Нет свечей за этот период</p>
        )}
      </MCard>

      <MCard className="border border-[#6C5CFF]/30 p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[14px] font-bold text-[#F4F4F6]"><IconSparkles className="h-4 w-4 text-[#B3A9FF]" />Мнение агентов</p>
          <span className="text-[12px] font-bold text-[#B3A9FF]">{agentObservers.length ? `держат: ${agentObservers.length}` : "позиций нет"}</span>
        </div>
        <p className="mt-2.5 text-[13px] font-medium leading-[1.45] text-[#8C8C97]">
          Покупать и продавать {profile.ticker} могут только запущенные агенты — по своим правилам риска. Вы наблюдаете и управляете агентами.
        </p>
        {agentObservers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {agentObservers.map((name) => (
              <span key={name} className="rounded-full bg-[#6C5CFF]/[0.16] px-3 py-1.5 text-[12.5px] font-bold text-[#B3A9FF]">{name}</span>
            ))}
          </div>
        )}
      </MCard>

      <div>
        <MSectionHead title="Показатели" />
        {loading ? (
          <div className="mt-3 space-y-2">{Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-10 rounded-[12px]" />)}</div>
        ) : metrics.length ? (
          <div className="mt-1">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between border-b border-white/[0.07] py-3">
                <span className="text-[14px] font-medium text-[#8C8C97]">{metric.label}</span>
                <span className="q-num text-[14px] font-bold text-[#F4F4F6]">{metric.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-[13px] text-[#8C8C97]">Метрики появятся после подключения backend.</p>
        )}
      </div>

      <MCard className="p-4">
        <p className="text-[15px] font-bold text-[#F4F4F6]">О компании</p>
        <p className="mt-2 text-[13.5px] font-medium leading-[1.55] text-[#8C8C97]">{profile.description}</p>
      </MCard>

      <MSectionHead title="Сделки агентов" />
      {trades.length === 0 ? (
        <p className="rounded-[20px] bg-[#16161B] px-5 py-6 text-center text-[13px] font-medium text-[#8C8C97]">Сделок по этой акции пока нет</p>
      ) : (
        <div className="space-y-2.5">
          {trades.slice(0, 10).map((trade) => {
            const buy = trade.side.toLowerCase() === "buy";
            return (
              <div key={trade.id} className="flex items-center gap-3 rounded-[20px] bg-[#16161B] p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#212128] text-[#B3A9FF]"><IconAgents className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold text-[#F4F4F6]">{trade.agentName} · {buy ? "купил" : "продал"} × {trade.quantity}</span>
                  <span className="block text-[12px] font-semibold text-[#8C8C97]">по {usd(trade.price)} · {new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(trade.executedAt))}</span>
                </span>
                <span className={clsx("q-num text-[14px] font-extrabold", buy ? "text-[#2EBD85]" : "text-[#F4F4F6]")}>{usd(trade.total)}</span>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/agents" className="press-98 focus-ring flex h-14 items-center justify-center gap-2 rounded-full bg-[#6C5CFF] text-[16px] font-bold text-white shadow-[0_10px_30px_-12px_rgba(108,92,255,0.9)]">
        Управлять агентами <IconArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
