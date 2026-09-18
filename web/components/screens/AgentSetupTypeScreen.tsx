"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { IconShield, IconShuffle, IconTrophy } from "@/components/icons";
import { agentTypeOptions, generatedCharacterPreview } from "@/lib/psychologyData";
import type { AgentStrategy } from "@/lib/types";
import clsx from "@/lib/clsx";

const TYPE_ICON: Record<AgentStrategy, typeof IconTrophy> = {
  aggressive: IconTrophy,
  careful: IconShield,
  random: IconShuffle,
};

export default function AgentSetupTypeScreen() {
  const [selected, setSelected] = useState<AgentStrategy>("aggressive");
  const preview = generatedCharacterPreview[selected];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
            Новый торговый агент
          </p>
          <h1 className="mt-2 text-heading font-[485] text-ink">Сначала тип, потом характер</h1>
          <p className="mt-1.5 max-w-xl text-body text-steel">
            Тип задаёт стратегию. Интеллект, темперамент и навыки выпадут случайно в его диапазонах.
          </p>
        </div>
        <span className="rounded-btn bg-[#F5F1F6] px-4 py-2.5 text-caption font-[600] text-[#625B69]">
          Черновик сохранён
        </span>
      </div>

      <div className="mt-8 flex items-center gap-2.5">
        {[
          { n: 1, label: "Тип агента", active: true },
          { n: 2, label: "Случайный характер", active: false },
          { n: 3, label: "Бюджет и запуск", active: false },
        ].map((s) => (
          <div
            key={s.n}
            className={clsx(
              "flex flex-1 items-center gap-2 rounded-btn px-3 py-2.5",
              s.active ? "bg-magenta-tint" : "bg-[#F7F5F8]"
            )}
          >
            <span
              className={clsx(
                "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-[600] text-white",
                s.active ? "bg-magenta" : "bg-[#E8E2EB] text-steel"
              )}
            >
              {s.n}
            </span>
            <span className={clsx("text-caption font-[600]", s.active ? "text-magenta-deep" : "text-steel")}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.78fr_1fr]">
        <div>
          <p className="text-subheading font-[600] text-ink">1. Выберите тип агента</p>
          <p className="mt-1 text-body-sm text-steel">
            Стиль торговли фиксируется. После выбора для типа выпадут случайные личные характеристики.
          </p>

          <div className="mt-3.5 flex flex-col gap-3.5">
            {agentTypeOptions.map((opt) => {
              const Icon = TYPE_ICON[opt.id];
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelected(opt.id)}
                  className={clsx(
                    "press-98 focus-ring rounded-[16px] border p-4 text-left transition-colors duration-150",
                    active ? "border-magenta-ring bg-magenta-tint" : "border-bone bg-white hover:border-fog/60"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-magenta text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span
                      className={clsx(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-full border-2",
                        active ? "border-magenta bg-magenta" : "border-fog/60 bg-white"
                      )}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </div>
                  <p className="mt-4 text-body font-[600] text-magenta-deep">{opt.title}</p>
                  <p className="mt-1 text-body-sm text-[#625B69]">{opt.subtitle}</p>
                  <div className="mt-3 rounded-btn bg-[#FBE1F4] px-3 py-1.5">
                    <p className="text-caption font-[600] text-magenta-deep">{opt.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3.5 rounded-[13px] bg-[#FCFAFD] p-3.5">
            <p className="text-caption text-[#625B69]">
              Агрессивный рискует поведением. Рискованный рискует выбором акций — это разные вещи.
            </p>
          </div>
        </div>

        <div className="rounded-[20px] bg-[#FCFAFD] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption font-[600] text-magenta-deep">2. Случайный характер</p>
              <p className="mt-1 text-subheading font-[600] text-ink">
                Характер для {agentTypeOptions.find((o) => o.id === selected)?.title.toLowerCase()} агента
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[16px] bg-white p-4">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[16px] bg-magenta-tint">
              <IconTrophy className="h-6 w-6 text-magenta-deep" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[17px] font-[600] text-ink">{preview.name}</p>
              <p className="mt-0.5 text-body-sm text-steel">
                Темперамент: {preview.temperament.toLowerCase()} · тип: {agentTypeOptions.find((o) => o.id === selected)?.title.toLowerCase()}
              </p>
            </div>
            <span className="shrink-0 rounded-btn bg-magenta-tint px-3.5 py-1.5 text-[9px] font-[600] uppercase tracking-[0.04em] text-magenta-deep">
              Случайно
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-3 gap-3">
            <div className="rounded-[14px] bg-white p-3.5">
              <p className="text-caption font-[600] uppercase tracking-[0.02em] text-[#8B8091]">Интеллект</p>
              <p className="mt-1.5 text-heading-sm font-[600] tabular-nums text-ink">{preview.intellect} / 100</p>
              <div className="mt-2 h-[5px] w-full rounded-pill bg-[#F0EAF0]">
                <div className="h-full rounded-pill bg-magenta" style={{ width: `${preview.intellect}%` }} />
              </div>
              <p className="mt-2 text-[9px] text-steel">{preview.intellectRange}</p>
            </div>
            <div className="rounded-[14px] bg-white p-3.5">
              <p className="text-caption font-[600] uppercase tracking-[0.02em] text-[#8B8091]">Темперамент</p>
              <p className="mt-1.5 text-body font-[600] text-ink">{preview.temperament}</p>
              <p className="mt-1 text-[9px] leading-tight text-steel">{preview.temperamentNote}</p>
              <p className="mt-1.5 text-[9px] font-[600] text-magenta-deep">{preview.temperamentProbability}</p>
            </div>
            <div className="rounded-[14px] bg-white p-3.5">
              <p className="text-caption font-[600] uppercase tracking-[0.02em] text-[#8B8091]">Склонность к риску</p>
              <p className="mt-1.5 text-heading-sm font-[600] tabular-nums text-ink">{preview.risk} / 100</p>
              <div className="mt-2 h-[5px] w-full rounded-pill bg-[#F0EAF0]">
                <div className="h-full rounded-pill bg-magenta" style={{ width: `${preview.risk}%` }} />
              </div>
              <p className="mt-2 text-[9px] text-steel">{preview.riskRange}</p>
            </div>
          </div>

          <div className="mt-3.5 rounded-[16px] bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-body font-[600] text-ink">Навыки</p>
              <p className="text-caption text-[#8B8091]">выпали случайно</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-4">
              {preview.skills.map((s) => (
                <p key={s.label} className="text-body-sm font-[600] text-[#625B69]">
                  {s.label} · {s.score}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="max-w-[260px] text-caption text-steel">
              Далее вы зададите стартовый бюджет и лимиты.
            </p>
            <button className="press-98 focus-ring shrink-0 rounded-[11px] bg-magenta px-6 py-3 text-body-sm font-[600] text-white transition-colors duration-150 hover:bg-magenta-deep">
              Продолжить к бюджету
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
