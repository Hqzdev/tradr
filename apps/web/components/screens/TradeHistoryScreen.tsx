"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import StatTile from "@/components/StatTile";
import StockMark from "@/components/market/StockMark";
import ActivityRow from "@/components/agents/ActivityRow";
import { IconAgents, IconCoins, IconExchange, IconHistory } from "@/components/icons";
import { getTradeStats, getTrades, type Trade, type TradeStats } from "@/lib/api/trading";
import { getDashboard, type DashboardActivity } from "@/lib/api/dashboard";
import { getStockProfile } from "@/lib/stocks";
import { useIsMobile } from "@/lib/useIsMobile";

export default function TradeHistoryScreen() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [activity, setActivity] = useState<DashboardActivity[]>([]);
  const [error, setError] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => { Promise.all([getTrades(), getTradeStats(), getDashboard()]).then(([tradeRows, tradeStats, dashboard]) => { setTrades(tradeRows); setStats(tradeStats); setActivity(dashboard.activity); }).catch(() => setError(true)); }, []);
  if (error) return <EmptyState title="Не удалось загрузить историю" description="Проверьте подключение к backend и обновите страницу." />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Активность агентов" title="История" dim="сделок" lead="Покупки и продажи выполняют только ваши агенты. Здесь можно наблюдать их результат." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile index={1} icon={<IconHistory className="h-[15px] w-[15px]" />} label="Сделок сегодня" value={stats ? String(stats.tradesToday) : "…"} caption={stats ? `${stats.buyCount} покупок · ${stats.sellCount} продаж` : undefined} />
        <StatTile index={2} icon={<IconExchange className="h-[15px] w-[15px]" />} label="Оборот" value={stats ? <Money value={stats.turnover} decimals={0} /> : "…"} caption="сумма исполненных сделок" />
        <StatTile index={3} icon={<IconCoins className="h-[15px] w-[15px]" />} label="Комиссия" value={stats ? <Money value={stats.commission} /> : "…"} caption="учтена в результате" />
        <StatTile index={4} icon={<IconAgents className="h-[15px] w-[15px]" />} label="Открытых заявок" value={stats ? String(stats.openOrders) : "…"} caption="ждут исполнения" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 2xl:grid-cols-[1fr_380px]">
        <div className="q-reveal overflow-hidden rounded-[22px] border border-white/[0.09] bg-[#0d0d10]" style={{ ["--i" as string]: 5 }}>
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <p className="text-[16px] font-semibold text-ink">Исполненные сделки</p>
              <span className="rounded-md bg-white/[0.07] px-2 py-0.5 text-[12px] font-medium text-ink">{trades.length}</span>
            </div>
          </div>
          {trades.length === 0 ? (
            <div className="border-t border-white/[0.06] p-6"><EmptyState title="Сделок пока нет" description="Запустите агента — его исполненные покупки и продажи появятся здесь." /></div>
          ) : mobile ? (
            <div className="m-ui space-y-2 border-t border-white/[0.06] p-3">
              {trades.map((trade) => {
                const buy = trade.side.toLowerCase() === "buy";
                const profile = getStockProfile(trade.ticker);
                return (
                  <Link key={trade.id} href={`/market/${trade.ticker}`} className="focus-ring flex items-center gap-3 rounded-[18px] bg-[#16161B] p-3.5">
                    {profile ? <StockMark stock={profile} size={40} /> : <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.08] text-[14px] font-bold text-ink">{trade.ticker[0]}</span>}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-bold text-ink">{trade.ticker} · {buy ? "покупка" : "продажа"} × {trade.quantity}</span>
                      <span className="block truncate text-[12px] font-semibold text-steel">{trade.agentName} · {new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(trade.executedAt))}</span>
                    </span>
                    <span className="text-right">
                      <span className={`q-num block text-[14px] font-extrabold ${buy ? "text-positive" : "text-ink"}`}>{money(trade.total)}</span>
                      <span className="q-num block text-[11.5px] font-semibold text-steel">по {money(trade.price)}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-t border-white/[0.06] bg-white/[0.02] text-[12.5px] text-steel">
                    <th className="py-3 pl-6 font-medium">Время</th>
                    <th className="py-3 font-medium">Агент</th>
                    <th className="py-3 font-medium">Инструмент</th>
                    <th className="py-3 font-medium">Действие</th>
                    <th className="py-3 font-medium">Кол-во</th>
                    <th className="py-3 font-medium">Цена</th>
                    <th className="py-3 pr-6 text-right font-medium">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade, index) => {
                    const buy = trade.side.toLowerCase() === "buy";
                    const profile = getStockProfile(trade.ticker);
                    return (
                      <tr key={trade.id} className="q-reveal border-t border-white/[0.06] text-[14px] transition-colors duration-200 hover:bg-white/[0.025]" style={{ ["--i" as string]: Math.min(index, 12) + 6 }}>
                        <td className="py-3.5 pl-6 text-steel">{dateTime(trade.executedAt)}</td>
                        <td className="py-3.5">
                          <span className="flex items-center gap-2.5">
                            <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-magenta/[0.14] text-magenta-deep"><IconAgents className="h-[14px] w-[14px]" /></span>
                            <span className="font-medium text-ink">{trade.agentName}</span>
                          </span>
                        </td>
                        <td className="py-3.5">
                          <Link href={`/market/${trade.ticker}`} className="flex items-center gap-2.5 font-medium text-ink transition-colors hover:text-magenta-deep">
                            {profile && <StockMark stock={profile} size={24} />}
                            {trade.ticker}
                          </Link>
                        </td>
                        <td className="py-3.5"><span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${buy ? "bg-positive/[0.12] text-positive" : "bg-negative/[0.12] text-negative"}`}>{buy ? "Покупка" : "Продажа"}</span></td>
                        <td className="q-num py-3.5 text-ink">{trade.quantity}</td>
                        <td className="q-num py-3.5 text-ink">{money(trade.price)}</td>
                        <td className="q-num py-3.5 pr-6 text-right font-medium text-ink">{money(trade.total)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 6 }}>
          <div className="flex items-center gap-2.5">
            <p className="text-[16px] font-semibold text-ink">Решения агентов</p>
            {activity.length > 0 && <span className="flex items-center gap-1.5 rounded-full bg-negative/[0.12] px-2 py-0.5 text-[10.5px] font-bold tracking-wider text-negative"><span className="q-live h-[5px] w-[5px]" />LIVE</span>}
          </div>
          {activity.length === 0 ? (
            <EmptyState compact className="mt-4" title="Решений пока нет" description="После запуска здесь появятся анализ, покупки, ожидание и продажи." />
          ) : (
            <div className="mt-2 divide-y divide-white/[0.06]">
              {activity.slice(0, 12).map((item, index) => (
                <ActivityRow key={item.id} index={index} name={item.agentName} action={item.action} reason={item.reason} time={dateTime(item.timestamp)} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function dateTime(value: string): string { return new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short" }).format(new Date(value)); }
