"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import FieldBox from "@/components/ui/FieldBox";
import StepProgress from "@/components/ui/StepProgress";
import {
  IconArrowUpRight,
  IconCheck,
  IconChevronRight,
  IconShield,
  IconShuffle,
  IconTrophy,
} from "@/components/icons";
import clsx from "@/lib/clsx";
import { createAgent } from "@/lib/api/agents";

const STEPS = ["Основа", "Правила", "Риск", "Проверка"];

const strategies = [
  {
    id: "aggressive" as const,
    name: "Агрессивный",
    icon: IconTrophy,
    color: "#D85665",
    description: "Входит на импульсе, держит позицию до разворота тренда.",
  },
  {
    id: "careful" as const,
    name: "Осторожный",
    icon: IconShield,
    color: "#00856F",
    description: "Ждёт подтверждённый сигнал, узкий стоп-лосс.",
  },
  {
    id: "random" as const,
    name: "Случайный",
    icon: IconShuffle,
    color: "#8251FB",
    description: "Контрольная группа — случайные сделки в пределах лимита.",
  },
];

export default function CreateAgentScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);

  const [name, setName] = useState("Новый агент");
  const [strategy, setStrategy] = useState<(typeof strategies)[number]["id"]>("aggressive");

  const [instrument, setInstrument] = useState("AAPL");
  const [momentumThreshold, setMomentumThreshold] = useState("2,5");
  const [tradeSize, setTradeSize] = useState("15");

  const [maxCapitalPercent, setMaxCapitalPercent] = useState(40);
  const [stopLossPercent, setStopLossPercent] = useState(5);
  const [autoStop, setAutoStop] = useState(true);
  const [notify, setNotify] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const activeStrategy = strategies.find((s) => s.id === strategy)!;

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(STEPS.length - 1, i));
    setStep(clamped);
    setFurthest((f) => Math.max(f, clamped));
  };

  const isLast = step === STEPS.length - 1;

  const handlePrimary = async () => {
    if (isLast) {
      if (!name.trim()) {
        setRequestError("Введите название агента.");
        return;
      }
      setSubmitting(true);
      setRequestError(null);
      try {
        await createAgent({
          name: name.trim(),
          strategy,
          riskLevel: `${maxCapitalPercent}% капитала, стоп-лосс ${stopLossPercent}%`,
          character: JSON.stringify({ strategy, instrument, momentumThreshold }),
          budget: JSON.stringify({ maxCapitalPercent, tradeSize }),
          skills: JSON.stringify({ stopLossPercent, autoStop, notify }),
        });
        router.push("/agents");
      } catch {
        setRequestError("Не удалось создать агента. Проверьте, что backend запущен.");
      } finally {
        setSubmitting(false);
      }
      return;
    }
    goTo(step + 1);
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 text-caption font-[485] text-steel">
        <Link href="/agents" className="transition-colors duration-150 hover:text-ink">
          Агенты
        </Link>
        <IconChevronRight className="h-3 w-3" />
        <span className="text-ink">Новый агент</span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h1 className="text-heading font-[485] text-ink">{name || "Новый агент"}</h1>
          <Badge tone="paused">Черновик</Badge>
        </div>
        <Link href="/agents">
          <Button variant="ghost">Отмена</Button>
        </Link>
      </div>

      <Card className="mt-6 px-6 py-5">
        <StepProgress steps={STEPS} current={step} furthest={furthest} onSelect={goTo} />
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_410px]">
        <Card className="p-6">
          {step === 0 && (
            <div>
              <p className="text-subheading font-[485] text-ink">Название и стратегия</p>
              <p className="mt-1 text-body-sm text-steel">
                Дайте агенту понятное имя и выберите базовую стратегию поведения.
              </p>
              <div className="mt-4">
                <FieldBox label="Название агента" value={name} onChange={setName} large={false} />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {strategies.map((s) => {
                  const Icon = s.icon;
                  const active = s.id === strategy;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStrategy(s.id)}
                      className={clsx(
                        "press-98 focus-ring flex flex-col items-start gap-2.5 rounded-card border p-4 text-left transition-all duration-150",
                        active
                          ? "border-magenta/30 bg-magenta-tint"
                          : "border-bone bg-white hover:border-ink/15"
                      )}
                    >
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${s.color}1A` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: s.color }} />
                      </span>
                      <span>
                        <p className="text-body-sm font-[535] text-ink">{s.name}</p>
                        <p className="mt-0.5 text-caption text-steel">{s.description}</p>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-subheading font-[485] text-ink">Правила входа</p>
              <p className="mt-1 text-body-sm text-steel">
                Условия, по которым агент открывает и закрывает позиции.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <FieldBox label="Инструмент" value={instrument} onChange={setInstrument} large={false} />
                <FieldBox
                  label="Порог импульса"
                  unit="%"
                  value={momentumThreshold}
                  onChange={setMomentumThreshold}
                  large={false}
                />
                <FieldBox
                  label="Размер сделки"
                  unit="% капитала"
                  value={tradeSize}
                  onChange={setTradeSize}
                  large={false}
                />
              </div>
              <p className="mt-4 text-caption text-steel">
                Агент входит в позицию, когда отклонение цены от средней за 20 дней превышает
                указанный порог импульса, и выходит по стоп-лоссу или развороту сигнала.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-subheading font-[485] text-ink">Ограничения риска</p>
              <p className="mt-1 text-body-sm text-steel">
                Жёсткие лимиты, которые агент не может превысить — даже если сигнал сильный.
              </p>

              <div className="mt-5 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-ink">Макс. капитал в одной сделке</span>
                    <span className="font-[485] tabular-nums text-ink">{maxCapitalPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={maxCapitalPercent}
                    onChange={(e) => setMaxCapitalPercent(Number(e.target.value))}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-pill bg-bone accent-magenta"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="text-ink">Стоп-лосс на сделку</span>
                    <span className="font-[485] tabular-nums text-ink">{stopLossPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={stopLossPercent}
                    onChange={(e) => setStopLossPercent(Number(e.target.value))}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-pill bg-bone accent-magenta"
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-btn border border-bone px-4 py-3">
                  <input
                    type="checkbox"
                    checked={autoStop}
                    onChange={(e) => setAutoStop(e.target.checked)}
                    className="h-4 w-4 accent-magenta"
                  />
                  <span className="text-body-sm text-ink">
                    Автостоп при просадке портфеля более 10%
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-btn border border-bone px-4 py-3">
                  <input
                    type="checkbox"
                    checked={notify}
                    onChange={(e) => setNotify(e.target.checked)}
                    className="h-4 w-4 accent-magenta"
                  />
                  <span className="text-body-sm text-ink">Уведомлять о каждой сделке агента</span>
                </label>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-subheading font-[485] text-ink">Проверка перед запуском</p>
              <p className="mt-1 text-body-sm text-steel">
                После создания агент появится в вашем списке. Первые решения и сделки будут
                показаны только после фактической работы агента.
              </p>

              <div className="mt-4 flex flex-col divide-y divide-bone rounded-card border border-bone">
                <SummaryRow label="Название" value={name || "Новый агент"} />
                <SummaryRow label="Стратегия" value={activeStrategy.name} />
                <SummaryRow label="Инструмент" value={instrument} />
                <SummaryRow label="Порог импульса" value={`${momentumThreshold}%`} />
                <SummaryRow label="Размер сделки" value={`${tradeSize}% капитала`} />
                <SummaryRow label="Макс. капитал в сделке" value={`${maxCapitalPercent}%`} />
                <SummaryRow label="Стоп-лосс" value={`${stopLossPercent}%`} />
                <SummaryRow label="Автостоп при просадке" value={autoStop ? "Включён" : "Выключен"} />
                <SummaryRow label="Уведомления" value={notify ? "Включены" : "Выключены"} />
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-bone pt-5">
            <Button variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
              Назад
            </Button>
            <Button
              variant="primary"
              icon={isLast ? <IconCheck className="h-4 w-4" /> : <IconArrowUpRight className="h-4 w-4" />}
              onClick={handlePrimary}
              disabled={submitting}
            >
              {isLast ? (submitting ? "Создаём..." : "Создать агента") : "Далее"}
            </Button>
          </div>
          {requestError && <p className="mt-3 text-body-sm text-negative">{requestError}</p>}
        </Card>

        <Card className="p-6">
          <p className="text-subheading font-[485] text-ink">Сводка агента</p>

          <div className="mt-3 flex items-center gap-3 rounded-card bg-[#fafafa] p-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${activeStrategy.color}1A` }}
            >
              <activeStrategy.icon className="h-4 w-4" style={{ color: activeStrategy.color }} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-[535] text-ink">{name || "Новый агент"}</p>
              <p className="text-caption text-steel">{activeStrategy.name} · {instrument}</p>
            </div>
          </div>

          <p className="mt-5 text-body-sm font-[485] text-ink">Как принимает решение</p>
          <div className="mt-3 flex flex-col gap-3">
            {["Сигнал", "Проверка правил", "Проверка риска", "Исполнение"].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-magenta-tint text-caption font-[535] text-magenta-deep">
                  {i + 1}
                </span>
                <span className="text-body-sm text-ink">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-card border border-negative/15 bg-negative-tint/40 p-3.5">
            <p className="text-caption font-[485] text-negative">Риск</p>
            <p className="mt-1 text-caption text-steel">
              Агент торгует автоматически в пределах заданных лимитов. Остановить его можно в
              любой момент со страницы агента.
            </p>
          </div>

          <div className="mt-5 border-t border-bone pt-5">
            <p className="text-body-sm font-[485] text-ink">Статистика</p>
            <p className="mt-1 text-caption text-steel">
              Доходность, просадка и сделки появятся после работы агента. Начальных данных нет.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 text-body-sm">
      <span className="text-steel">{label}</span>
      <span className="font-[485] text-ink">{value}</span>
    </div>
  );
}
