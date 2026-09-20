"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FieldBox from "@/components/ui/FieldBox";
import { IconCheck, IconChevronRight, IconShield, IconShuffle, IconTrophy } from "@/components/icons";
import { createAgent } from "@/lib/api/agents";
import { getDashboard } from "@/lib/api/dashboard";
import clsx from "@/lib/clsx";

const strategies = [
  { id: "aggressive", name: "Агрессивный", range: "от -5% до +3%", icon: IconTrophy, color: "#D85665", description: "Быстро реагирует на заметное снижение цены." },
  { id: "careful", name: "Осторожный", range: "от -2% до +2%", icon: IconShield, color: "#00856F", description: "Ищет более спокойные и редкие точки входа." },
  { id: "random", name: "Случайный", range: "от -8% до +8%", icon: IconShuffle, color: "#8251FB", description: "Сам выбирает момент и инструмент в широком диапазоне." },
] as const;

export default function CreateAgentScreen() {
  const router = useRouter();
  const [name, setName] = useState("Новый агент");
  const [strategy, setStrategy] = useState<(typeof strategies)[number]["id"]>("aggressive");
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [budget, setBudget] = useState(75000);
  const [reserve, setReserve] = useState(100000);
  const selected = strategies.find((item) => item.id === strategy)!;

  useEffect(() => {
    getDashboard().then((value) => {
      setReserve(value.reserveCash);
      setBudget(Math.min(75000, Math.max(1000, value.reserveCash)));
    }).catch(() => undefined);
  }, []);

  const create = async () => {
    if (!name.trim()) {
      setRequestError("Введите название агента.");
      return;
    }
    if (budget < 1000 || budget > Math.min(100000, reserve)) {
      setRequestError("Укажите лимит от $1 000 до доступного резерва.");
      return;
    }
    setSubmitting(true);
    setRequestError(null);
    try {
      const agent = await createAgent({ name: name.trim(), strategy, budgetLimit: budget });
      router.push(`/agents/${agent.id}`);
    } catch {
      setRequestError("Не удалось создать агента. Проверьте, что backend запущен.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption font-[485] text-steel">
        <Link href="/agents" className="transition-colors duration-150 hover:text-ink">Агенты</Link>
        <IconChevronRight className="h-3 w-3" />
        <span className="text-ink">Новый агент</span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2.5"><h1 className="text-heading font-[485] text-ink">Новый агент</h1><Badge tone="paused">Черновик</Badge></div>
        <Link href="/agents"><Button variant="ghost">Отмена</Button></Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Имя и тип агента</p>
          <p className="mt-1 text-body-sm text-steel">Агент сам наблюдает за всеми доступными акциями и выбирает подходящую покупку.</p>
          <div className="mt-5"><FieldBox label="Название агента" value={name} onChange={setName} large={false} /></div>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {strategies.map((item) => {
              const Icon = item.icon;
              const active = item.id === strategy;
              return <button key={item.id} type="button" onClick={() => setStrategy(item.id)} className={clsx("press-98 focus-ring flex flex-col items-start gap-2.5 rounded-card border p-4 text-left transition-all duration-150", active ? "border-magenta/30 bg-magenta-tint" : "border-bone bg-white hover:border-ink/15")}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${item.color}1A` }}><Icon className="h-4 w-4" style={{ color: item.color }} /></span>
                <span><p className="text-body-sm font-[535] text-ink">{item.name}</p><p className="mt-0.5 text-caption text-steel">{item.description}</p></span>
              </button>;
            })}
          </div>
          <div className="mt-6 border-t border-bone pt-5">
            <div className="flex items-baseline justify-between gap-3"><p className="text-body-sm font-[535] text-ink">Капитал агента</p><p className="text-caption text-steel">В резерве {money(reserve)}</p></div>
            <div className="mt-3 flex flex-wrap gap-2">{[10000, 25000, 50000, 75000, 100000].map((value) => <button key={value} type="button" disabled={value > reserve} onClick={() => setBudget(value)} className={clsx("focus-ring rounded-pill border px-3 py-2 text-caption font-[485] transition-colors disabled:cursor-not-allowed disabled:opacity-35", budget === value ? "border-magenta bg-magenta-tint text-magenta-deep" : "border-bone text-steel hover:border-magenta/30")}>{money(value)}</button>)}</div>
            <label className="mt-3 block"><span className="text-caption text-steel">Точный лимит, $</span><input type="number" min={1000} max={Math.min(100000, reserve)} value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="focus-ring mt-1.5 h-11 w-full rounded-btn border border-bone px-3 text-body-sm text-ink" /></label>
          </div>
          <div className="mt-6 flex justify-end border-t border-bone pt-5"><Button variant="primary" icon={<IconCheck className="h-4 w-4" />} onClick={create} disabled={submitting}>{submitting ? "Создаём..." : "Создать агента"}</Button></div>
          {requestError && <p className="mt-3 text-body-sm text-negative">{requestError}</p>}
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Как будет работать</p>
          <div className="mt-4 rounded-card bg-[#fafafa] p-4"><p className="text-body-sm font-[535] text-ink">{selected.name}</p><p className="mt-1 text-caption text-steel">Диапазон изменения цены: {selected.range}</p></div>
          <div className="mt-5 flex flex-col gap-4 text-body-sm text-ink">
            <p>Агент видит все доступные акции.</p>
            <p>Он выбирает покупку сам по правилам своего типа.</p>
            <p>После создания его можно остановить или запустить со страницы агента.</p>
          </div>
          <p className="mt-5 border-t border-bone pt-5 text-caption text-steel">После создания агент останется на паузе. Запустите его, когда будете готовы; все действия появятся в обзоре.</p>
        </Card>
      </div>
    </div>
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
