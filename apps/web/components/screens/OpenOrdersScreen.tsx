"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { cancelOrder, getOrders, type Order } from "@/lib/api/trading";

export default function OpenOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);

  const load = () => getOrders("OPEN").then(setOrders).catch(() => setError(true));
  useEffect(() => { load(); }, []);

  const cancel = async (id: string) => { await cancelOrder(id); load(); };
  if (error) return <EmptyState title="Не удалось загрузить заявки" description="Проверьте подключение к backend и обновите страницу." />;

  return (
    <div>
      <PageHeader eyebrow="Торговля / Активные ордера" title="Открытые заявки" lead="Здесь показаны только реальные ожидающие заявки." />
      <Card className="mt-6 p-6">
        {orders.length === 0 ? <EmptyState title="Открытых заявок нет" description="Новые заявки можно создать в терминале." actionLabel="Открыть терминал" actionHref="/terminal" /> : (
          <table className="w-full border-collapse text-left"><thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Сторона</th><th className="pb-2 font-[485]">Тип</th><th className="pb-2 font-[485]">Количество</th><th className="pb-2 font-[485]">Лимит</th><th className="pb-2" /></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.id} className="border-t border-bone text-body-sm"><td className="py-3 font-[485] text-ink">{order.ticker}</td><td className="py-3 text-ink">{order.side === "BUY" ? "Покупка" : "Продажа"}</td><td className="py-3 text-steel">{order.orderType === "LIMIT" ? "Лимитная" : "Рыночная"}</td><td className="py-3 tabular-nums text-ink">{order.quantity}</td><td className="py-3 tabular-nums text-ink">{order.limitPrice === null ? "—" : money(order.limitPrice)}</td><td className="py-3 text-right"><Button size="sm" variant="outline" onClick={() => cancel(order.id)}>Отменить</Button></td></tr>)}</tbody></table>
        )}
      </Card>
    </div>
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(value); }
