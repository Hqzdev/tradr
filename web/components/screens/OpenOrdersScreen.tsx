import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import StatTile from "@/components/StatTile";
import EmptyState from "@/components/ui/EmptyState";
import { emptyStates } from "@/lib/emptyStates";
import { IconEdit, IconX } from "@/components/icons";
import { openOrders, openOrdersStats } from "@/lib/tradingExtra";
import clsx from "@/lib/clsx";

const SIDE_TEXT: Record<string, string> = {
  buy: "text-[#7D9DCF]",
  sell: "text-[#D59B8D]",
};

const STATUS_STYLE: Record<string, string> = {
  Ожидает: "bg-[#FFF4DB] text-[#99722C]",
  Частично: "bg-[#E8F7F2] text-[#00856F]",
  Исполнена: "bg-[#E8F7F2] text-[#00856F]",
};

export default function OpenOrdersScreen() {
  return (
    <div>
      <PageHeader
        eyebrow="Торговля / Активные ордера"
        title="Открытые заявки"
        lead="Все ожидающие исполнения заявки — ваши и торговых агентов."
        action={<Button variant="outline" icon={<IconX className="h-4 w-4" />}>Отменить все</Button>}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Активных заявок" value={String(openOrdersStats.activeCount)} />
        <StatTile label="Заблокировано средств" value={openOrdersStats.lockedFunds} />
        <StatTile label="Лимитные / Рыночные" value={openOrdersStats.limitVsMarket} />
        <StatTile label="Ближайшее исполнение" value={openOrdersStats.nextFillEta} />
      </div>

      <Card className="mt-6 p-6">
        {openOrders.length === 0 ? (
          <EmptyState
            title={emptyStates.orders.title}
            description={emptyStates.orders.description}
            actionLabel="Открыть терминал"
            actionHref="/terminal"
          />
        ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="text-caption text-steel">
              <th className="pb-2 font-[485]">Инструмент</th>
              <th className="pb-2 font-[485]">Тип</th>
              <th className="pb-2 font-[485]">Сторона</th>
              <th className="pb-2 font-[485]">Цена заявки</th>
              <th className="pb-2 font-[485]">Количество</th>
              <th className="pb-2 font-[485]">Заполнено</th>
              <th className="pb-2 font-[485]">Статус</th>
              <th className="pb-2 font-[485]"></th>
            </tr>
          </thead>
          <tbody>
            {openOrders.map((o, i) => (
              <tr key={i} className="border-t border-bone text-body-sm">
                <td className="py-3 text-ink">{o.instrument}</td>
                <td className="py-3 text-steel">{o.type}</td>
                <td className={clsx("py-3 text-caption font-[535] tracking-[0.02em]", SIDE_TEXT[o.side])}>
                  {o.side === "buy" ? "ПОКУПКА" : "ПРОДАЖА"}
                </td>
                <td className="py-3 tabular-nums text-ink">{o.priceLabel}</td>
                <td className="py-3 tabular-nums text-steel">{o.qtyLabel}</td>
                <td className="py-3 tabular-nums text-steel">{o.filledLabel}</td>
                <td className="py-3">
                  <span className={clsx("rounded-pill px-2.5 py-1 text-caption font-[485]", STATUS_STYLE[o.status])}>
                    {o.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3 text-steel">
                    <button className="press-98 focus-ring transition-colors duration-150 hover:text-ink" aria-label="Изменить заявку">
                      <IconEdit className="h-4 w-4" />
                    </button>
                    <button className="press-98 focus-ring transition-colors duration-150 hover:text-negative" aria-label="Отменить заявку">
                      <IconX className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </Card>
    </div>
  );
}
