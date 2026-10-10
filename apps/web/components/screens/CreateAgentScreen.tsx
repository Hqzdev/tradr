"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import FieldBox from "@/components/ui/FieldBox";
import PageHeader from "@/components/ui/PageHeader";
import { IconAlertCircle, IconCheck, IconEye, IconPause, IconSend, IconShield, IconShuffle, IconTrophy, IconX } from "@/components/icons";
import { createAgent } from "@/lib/api/agents";
import { getDashboard } from "@/lib/api/dashboard";
import clsx from "@/lib/clsx";

const strategies = [
  { id: "aggressive", name: "Агрессивный", range: "от -5% до +3%", icon: IconTrophy, color: "#6C5CFF", description: "Быстро реагирует на заметное снижение цены." },
  { id: "careful", name: "Осторожный", range: "от -2% до +2%", icon: IconShield, color: "#2EBD85", description: "Ищет более спокойные и редкие точки входа." },
  { id: "random", name: "Случайный", range: "от -8% до +8%", icon: IconShuffle, color: "#A79CFF", description: "Сам выбирает момент и инструмент в широком диапазоне." },
] as const;

const flow = [
  { icon: IconEye, title: "Наблюдает", text: "Видит все доступные акции." },
  { icon: IconShield, title: "Выбирает покупку", text: "Сам, по правилам своего типа." },
  { icon: IconSend, title: "Торгует своим капиталом", text: "Не выходит за выделенный лимит." },
  { icon: IconPause, title: "Под вашим контролем", text: "Остановить или запустить — со страницы агента." },
];

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
      setRequestError(`В резерве ${new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD" }).format(reserve)}. Переведите свободную прибыль действующего агента в резерв или уменьшите его лимит на паузе.`);
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

  const SelectedIcon = selected.icon;
  const share = reserve > 0 ? Math.min(100, (budget / reserve) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Черновик · после создания агент будет на паузе"
        title="Создание"
        dim="агента"
        lead="Агент сам наблюдает за всеми доступными акциями и выбирает подходящую покупку."
        action={<Link href="/agents"><Button variant="ghost" icon={<IconX className="h-4 w-4" />}>Отмена</Button></Link>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 1 }}>
            <p className="text-[16px] font-semibold text-ink">Имя и стратегия</p>
            <p className="mt-1 text-[12.5px] text-steel">Эти данные можно изменить позже.</p>
            <div className="mt-5"><FieldBox label="Название агента" value={name} onChange={setName} large={false} /></div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {strategies.map((item, index) => {
                const Icon = item.icon;
                const active = item.id === strategy;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStrategy(item.id)}
                    className={clsx(
                      "q-reveal press-98 focus-ring group flex flex-col items-start gap-3 rounded-[18px] border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300",
                      active ? "border-magenta/60 bg-magenta/[0.09] shadow-[0_0_0_4px_rgba(108,92,255,0.08)]" : "border-white/[0.08] bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/[0.16]"
                    )}
                    style={{ ["--i" as string]: index + 2 }}
                  >
                    <span className="flex w-full items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-[12px] transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: `${item.color}24` }}>
                        <Icon className="h-[18px] w-[18px]" style={{ color: item.color }} />
                      </span>
                      <span className={clsx("grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors duration-200", active ? "border-magenta bg-magenta" : "border-white/[0.2]")}>
                        <span className={clsx("h-[6px] w-[6px] rounded-full bg-white transition-transform duration-300", active ? "scale-100" : "scale-0")} />
                      </span>
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-ink">{item.name}</span>
                      <span className="mt-1 block text-[12.5px] leading-relaxed text-steel">{item.description}</span>
                    </span>
                    <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[11.5px] text-charcoal">{item.range}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="q-reveal p-5 sm:p-6" style={{ ["--i" as string]: 5 }}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[16px] font-semibold text-ink">Капитал агента</p>
              <p className="text-[12.5px] text-steel">В резерве {money(reserve)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[10000, 25000, 50000, 75000, 100000].map((value) => (
                <button key={value} type="button" disabled={value > reserve} onClick={() => setBudget(value)} className={clsx("press-98 focus-ring rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30", budget === value ? "border-magenta/60 bg-magenta/15 text-magenta-deep" : "border-white/[0.1] text-steel hover:border-white/[0.2] hover:text-ink")}>
                  {money(value)}
                </button>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-[12.5px] text-steel">Точный лимит, $</span>
              <input type="number" min={1000} max={Math.min(100000, reserve)} value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="focus-ring mt-2 h-11 w-full rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-3.5 text-[14.5px] text-ink outline-none transition-[border-color,box-shadow] duration-200 focus:border-magenta/70 focus:shadow-[0_0_0_4px_rgba(108,92,255,0.12)]" />
            </label>
            <div className="mt-5">
              <div className="flex justify-between text-[12.5px]"><span className="text-steel">Доля резерва</span><span className="q-num text-ink">{share.toFixed(0)}%</span></div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full rounded-full transition-[width] duration-500 ease-out" style={{ width: `${share}%`, background: `linear-gradient(90deg, ${selected.color}, #A79CFF)` }} />
              </div>
            </div>
          </Card>
        </div>

        <Card className="q-reveal flex flex-col overflow-hidden p-5 sm:p-6" style={{ ["--i" as string]: 3, background: "radial-gradient(120% 70% at 50% 0%, rgba(108,92,255,0.18) 0%, rgba(108,92,255,0) 60%), linear-gradient(180deg,#131318 0%,#0d0d10 100%)" }}>
          <p className="text-[16px] font-semibold text-ink">Как будет работать</p>
          <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-white/[0.08] bg-white/[0.03] p-3.5">
            <span key={selected.id} className="animate-pop grid h-11 w-11 shrink-0 place-items-center rounded-[13px] border" style={{ background: `${selected.color}24`, borderColor: `${selected.color}55` }}>
              <SelectedIcon className="h-5 w-5" style={{ color: selected.color }} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-ink">{name.trim() || "Без названия"}</p>
              <p className="text-[12.5px] text-steel">{selected.name} · диапазон {selected.range}</p>
            </div>
          </div>
          <div className="mt-5">
            {flow.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.title} className="q-reveal flex gap-3" style={{ ["--i" as string]: index + 4 }}>
                  <div className="flex flex-col items-center">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.12] bg-white/[0.04] text-ink"><StepIcon className="h-[15px] w-[15px]" /></span>
                    {index < flow.length - 1 && <span className="my-1 w-px flex-1 bg-white/[0.1]" />}
                  </div>
                  <div className="pb-5 pt-1">
                    <p className="text-[13.5px] font-semibold text-ink">{step.title}</p>
                    <p className="mt-0.5 text-[12.5px] text-steel">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1" />
          <div className="flex gap-2.5 rounded-[14px] border border-warning/25 bg-warning/[0.07] p-3.5">
            <IconAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-[12.5px] leading-relaxed text-warning/90">Агент сможет распоряжаться суммой до {money(budget)}. Все действия появятся в обзоре.</p>
          </div>
        </Card>
      </div>

      <div className="q-reveal flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/[0.09] bg-white/[0.025] p-3 pl-5" style={{ ["--i" as string]: 8 }}>
        <div className="min-h-5 text-[13px]">
          {requestError ? <span className="animate-fade-in text-negative">{requestError}</span> : <span className="text-steel">Агент останется на паузе, пока вы его не запустите.</span>}
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/agents"><Button variant="ghost">Отмена</Button></Link>
          <Button variant="primary" icon={<IconCheck className="h-4 w-4" />} onClick={create} disabled={submitting}>{submitting ? "Создаём..." : "Создать агента"}</Button>
        </div>
      </div>
    </div>
  );
}

function money(value: number): string { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value); }
