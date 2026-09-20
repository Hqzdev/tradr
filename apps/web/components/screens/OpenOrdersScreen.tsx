"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { getOrders, type Order } from "@/lib/api/trading";

export default function OpenOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState(false);

  const load = () => getOrders("OPEN").then(setOrders).catch(() => setError(true));
  useEffect(() => { load(); }, []);

  if (error) return <EmptyState title="Не удалось загрузить заявки" description="Проверьте подключение к backend и обновите страницу." />;

  return (
    <div>
      <PageHeader eyebrow="Торговля / Активные ордера" title="Открытые заявки" lead="Здесь показаны только реальные ожидающие заявки." />
      <Card className="mt-6 p-6">
        {orders.length === 0 ? <EmptyState title="Открытых заявок нет" description="Агенты создают только исполняемые рыночные заявки." /> : (
          <table className="w-full border-collapse text-left"><thead><tr className="text-caption text-steel"><th className="pb-2 font-[485]">Агент</th><th className="pb-2 font-[485]">Инструмент</th><th className="pb-2 font-[485]">Сторона</th><th className="pb-2 font-[485]">Количество</th><th className="pb-2 font-[485]">Статус</th></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.id} className="border-t border-bone text-body-sm"><td className="py-3 font-[485] text-ink">{order.agentName}</td><td className="py-3 font-[485] text-ink">{order.ticker}</td><td className="py-3 text-ink">{order.side.toLowerCase() === "buy" ? "Покупка" : "Продажа"}</td><td className="py-3 tabular-nums text-ink">{order.quantity}</td><td className="py-3 text-steel">{order.status}</td></tr>)}</tbody></table>
        )}
      </Card>
    </div>
  );
}
