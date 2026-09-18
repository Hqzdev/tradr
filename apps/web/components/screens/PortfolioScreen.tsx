"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { getPortfolio, type Portfolio } from "@/lib/api/trading";
import { IconArrowUpRight } from "@/components/icons";

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPortfolio().then(setPortfolio).catch(() => setError(true));
  }, []);

  if (error) return <EmptyState title="Не удалось загрузить портфель" description="Проверьте, что backend запущен, и обновите страницу." />;
  if (!portfolio) return <p className="text-body-sm text-steel">Загружаем портфель...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">Счёт / Обзор активов</p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Портфель</h1>
          <p className="mt-1.5 text-body text-steel">Ваши реальные позиции и доступный баланс.</p>
        </div>
        <div className="text-right">
          <p className="text-caption uppercase tracking-[0.02em] text-steel">Общая стоимость</p>
          <p className="mt-1 text-heading-sm font-[485] tabular-nums text-ink">{money(portfolio.totalValue)}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ValueCard label="Доступно" value={money(portfolio.cashBalance)} />
        <ValueCard label="В позициях" value={money(portfolio.holdingsValue)} />
        <ValueCard label="Открытых позиций" value={String(portfolio.holdings.length)} />
      </div>

      <Card className="mt-6 p-6">
        <p className="text-subheading font-[485] text-ink">Позиции</p>
        {portfolio.holdings.length === 0 ? (
          <EmptyState className="mt-4" title="Портфель пока пуст" description="После первой исполненной заявки позиция появится здесь." actionLabel="Открыть терминал" actionHref="/terminal" />
        ) : (
          <table className="mt-4 w-full border-collapse text-left">
            <thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Количество</th><th className="pb-2 font-[485]">Текущая цена</th><th className="pb-2 font-[485]">Стоимость</th><th className="pb-2 font-[485]">Результат</th></tr></thead>
            <tbody>{portfolio.holdings.map((holding) => (
              <tr key={holding.ticker} className="border-t border-bone text-body-sm">
                <td className="py-3"><Link href={`/portfolio/${holding.ticker}`} className="font-[485] text-ink hover:text-magenta-deep">{holding.ticker}</Link><p className="text-caption text-steel">{holding.name}</p></td>
                <td className="py-3 tabular-nums text-ink">{holding.quantity}</td>
                <td className="py-3 tabular-nums text-ink">{money(holding.currentPrice)}</td>
                <td className="py-3 tabular-nums text-ink">{money(holding.marketValue)}</td>
                <td className={holding.profit >= 0 ? "py-3 tabular-nums text-positive" : "py-3 tabular-nums text-negative"}>{signedMoney(holding.profit)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <div className="mt-6 flex justify-end border-t border-bone pt-5"><Link href="/terminal"><Button variant="primary" icon={<IconArrowUpRight className="h-4 w-4" />}>Перейти к торгам</Button></Link></div>
      </Card>
    </div>
  );
}

function ValueCard({ label, value }: { label: string; value: string }) {
  return <Card className="px-5 py-4"><p className="text-body-sm text-steel">{label}</p><p className="mt-1.5 text-heading-sm font-[485] tabular-nums text-ink">{value}</p></Card>;
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
function signedMoney(value: number): string { return `${value > 0 ? "+" : ""}${money(value)}`; }
