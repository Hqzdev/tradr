"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import CandlestickChart from "@/components/charts/CandlestickChart";
import { IconArrowUpRight, IconPause, IconShield, IconShuffle, IconTrophy } from "@/components/icons";
import { liveDecisions, liveSimInfo, liveTimeline } from "@/lib/tradingExtra";
import { candles } from "@/lib/fixtures";
import clsx from "@/lib/clsx";

const STRATEGY_ICON = { aggressive: IconTrophy, careful: IconShield, random: IconShuffle };
const STRATEGY_MARK = { aggressive: "#E91BAC", careful: "#8251FB", random: "#77727D" };

export default function SimLiveScreen() {
  const [paused, setPaused] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            {liveSimInfo.sessionLabel}
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Симуляция в реальном времени</h1>
          <p className="mt-1.5 max-w-xl text-body text-steel">{liveSimInfo.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-pill bg-positive-tint px-3 py-1.5 text-caption font-[485] text-positive">
            ● LIVE
          </span>
          <span className="rounded-pill border border-bone bg-white px-3 py-1.5 text-caption font-[485] text-ink">1×</span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="press-98 focus-ring flex items-center gap-1.5 rounded-pill border border-bone bg-white px-3.5 py-2 text-body-sm font-[485] text-ink transition-colors duration-150 hover:border-fog/60"
          >
            <IconPause className="h-4 w-4" />
            {paused ? "Продолжить" : "Пауза"}
          </button>
          <Link href="/simulation/results">
            <Button variant="primary">Завершить</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-caption text-steel">Текущий день</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{liveSimInfo.currentDay}</p>
          <p className="mt-0.5 text-caption text-teal">{liveSimInfo.daysLeft}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Цена AAPL</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{liveSimInfo.price}</p>
          <p className="mt-0.5 text-caption text-teal">{liveSimInfo.priceStepNote}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Общий капитал</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{liveSimInfo.totalCapital}</p>
          <p className="mt-0.5 text-caption text-teal">{liveSimInfo.totalCapitalNote}</p>
        </Card>
        <Card className="p-4">
          <p className="text-caption text-steel">Активных агентов</p>
          <p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{liveSimInfo.activeAgents}</p>
          <p className="mt-0.5 text-caption text-teal">{liveSimInfo.activeAgentsNote}</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-subheading font-[485] text-ink">AAPL · Цена и объём</p>
              <p className="mt-1 text-caption text-fog">{liveSimInfo.chartCaption}</p>
            </div>
            <span className="rounded-pill bg-positive-tint px-2.5 py-1 text-caption font-[485] text-positive">
              {liveSimInfo.price} +1,43%
            </span>
          </div>
          <div className="mt-4">
            <CandlestickChart candles={candles} />
          </div>
        </Card>

        <Card className="bg-[#FCFAFD] p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-[485] text-ink">Решения агентов</p>
            <span className="text-caption font-[485] text-magenta-deep">3 новых</span>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {liveDecisions.map((d, i) => {
              const Icon = STRATEGY_ICON[d.strategy];
              return (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: STRATEGY_MARK[d.strategy] }}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </span>
                  <div>
                    <p className="text-body-sm font-[485] text-ink">{d.title}</p>
                    <p className="mt-0.5 text-caption text-steel">{d.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link
            href="/agents/aggressive/log"
            className="press-98 focus-ring mt-4 block text-body-sm font-[485] text-magenta-deep transition-colors duration-150 hover:text-magenta"
          >
            Открыть журнал решений
          </Link>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-subheading font-[485] text-ink">Ход сессии</p>
            <span className="text-caption text-fog">Сегодня · 62-й день</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {liveTimeline.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
                <div>
                  <p className="text-caption text-fog">{t.time}</p>
                  <p className="text-body-sm text-ink">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-steel">Контроль риска</p>
          <p className="mt-1 text-subheading font-[485] text-ink">Загрузка капитала</p>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-heading-sm font-[485] tabular-nums text-ink">{liveSimInfo.riskCurrent}%</span>
            <span className="text-caption font-[485] text-magenta-deep">лимит {liveSimInfo.riskLimit}%</span>
          </div>
          <div className="mt-2">
            <ProgressBar percent={liveSimInfo.riskCurrent} color="#E91BAC" />
          </div>
          <p className="mt-3 text-caption text-steel">
            Защита включена: новые сделки будут ограничены при достижении лимита.
          </p>
        </Card>
      </div>
    </div>
  );
}
