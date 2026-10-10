"use client";

import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import { IconArrowRight, IconBell, IconCheck, IconInfinity, IconLock, IconMail, IconShield, IconSparkles, IconTarget } from "@/components/icons";
import agents from "@/data/pro-agents.json";

// Visual-only landing for the upcoming Pro agents. There is no backend for
// the waitlist yet — the form and buttons are intentionally not wired.
// TODO(waitlist): connect the email form and "notify" buttons to an API.

const skills = [
  { name: "Анализ сигналов", base: 62, pro: 92 },
  { name: "Дисциплина", base: 54, pro: 90 },
  { name: "Тайминг", base: 66, pro: 88 },
  { name: "Управление риском", base: 47, pro: 94 },
  { name: "Выносливость", base: 58, pro: 90 },
];

const lineupIcons = {
  shield: IconShield,
  target: IconTarget,
  infinity: IconInfinity,
} as const;

const rarities = {
  epic: { label: "Эпическая", color: "#B18CFF" },
  legendary: { label: "Легендарная", color: "#FFC45C" },
  mythic: { label: "Мифическая", color: "#FF7C9B" },
} as const;

export default function ProAgentsScreen() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Ранний доступ · Beta" title="Pro-" dim="агенты" joinDim lead="Агенты с прокачанными навыками и собственными правилами торговли." />

      <div className="grid gap-4 lg:grid-cols-[1fr_440px]">
        <Card
          className="q-reveal flex flex-col overflow-hidden p-7"
          style={{
            ["--i" as string]: 1,
            borderColor: "rgba(108,92,255,0.3)",
            background:
              "radial-gradient(90% 120% at 0% 0%, rgba(108,92,255,0.32) 0%, rgba(108,92,255,0) 60%), radial-gradient(70% 70% at 100% 100%, rgba(167,156,255,0.12) 0%, rgba(167,156,255,0) 70%), #0f0e16",
          }}
        >
          <h2 className="max-w-[520px] text-[30px] font-semibold leading-[1.12] tracking-[-0.04em] text-ink">Агенты, которые держат дисциплину лучше человека</h2>
          <ul className="mt-6 space-y-3">
            {["Навыки 80–98 вместо случайных 45–95 у базовых", "До 5 условий входа и выхода вместо 2", "Разбор каждого решения: почему купил, почему ждал"].map((text, index) => (
              <li key={text} className="q-reveal flex items-center gap-3 text-[14.5px] text-charcoal" style={{ ["--i" as string]: index + 2 }}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-magenta/25 text-magenta-deep"><IconCheck className="h-3 w-3" strokeWidth={2.4} /></span>
                {text}
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          <form className="mt-8 flex flex-col gap-2.5 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
            <label className="flex h-12 flex-1 items-center gap-2.5 rounded-[13px] border border-white/[0.12] bg-white/[0.05] px-4 transition-[border-color,box-shadow] duration-200 focus-within:border-magenta/70 focus-within:shadow-[0_0_0_4px_rgba(108,92,255,0.15)] sm:max-w-[340px]">
              <IconMail className="h-4 w-4 text-steel" />
              <input type="email" placeholder="you@email.com" aria-label="Email" className="w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-fog" />
            </label>
            <button type="submit" className="q-shine press-98 focus-ring flex h-12 items-center justify-center gap-2 rounded-[13px] bg-magenta px-5 text-[14.5px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(108,92,255,0.9)] transition-colors hover:bg-[#7a6bff]">
              Хочу доступ <IconArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 text-[12.5px] text-steel">Цену объявим до запуска. Без автосписаний — только письмо, когда откроем доступ.</p>
        </Card>

        <Card className="q-reveal p-6" style={{ ["--i" as string]: 2 }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[16px] font-semibold text-ink">Навыки: базовый и Pro</p>
            <div className="flex items-center gap-3 text-[12px] text-steel">
              <span className="flex items-center gap-1.5"><span className="h-1 w-2.5 rounded-full bg-[#5a5a66]" />Базовый</span>
              <span className="flex items-center gap-1.5"><span className="h-1 w-2.5 rounded-full bg-magenta" />Pro</span>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between text-[13.5px]">
                  <span className="text-ink">{skill.name}</span>
                  <span className="q-num flex items-center gap-1.5"><span className="text-steel">{skill.base}</span><IconArrowRight className="h-3 w-3 text-fog" /><span className="font-semibold text-magenta-deep">{skill.pro}</span></span>
                </div>
                <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="q-grow-x absolute inset-y-0 left-0 rounded-full" style={{ width: `${skill.pro}%`, background: "linear-gradient(90deg,#6C5CFF,#A79CFF)", ["--i" as string]: index + 3 }} />
                  <div className="q-grow-x absolute inset-y-0 left-0 rounded-full bg-[#5a5a66]" style={{ width: `${skill.base}%`, ["--i" as string]: index }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11.5px] text-fog">Базовые значения — среднее по типам агентов. Значения Pro — плановые.</p>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="q-reveal" style={{ ["--i" as string]: 3 }}>
          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-ink">Линейка Pro-агентов</h2>
          <p className="mt-1 text-[13.5px] text-steel">Каждый усилен в своей области. Доходность не обещаем — только поведение.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {agents.map((agent, index) => {
            const Icon = lineupIcons[agent.icon as keyof typeof lineupIcons];
            const rarity = rarities[agent.rarity as keyof typeof rarities];
            return (
              <Card key={agent.name} interactive className="q-reveal flex flex-col p-5" style={{ ["--i" as string]: index + 4, background: `radial-gradient(120% 80% at 10% 0%, ${agent.color}26 0%, transparent 60%), linear-gradient(180deg,#141418 0%,#0e0e11 100%)` }}>
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-[14px] border" style={{ background: `${agent.color}24`, borderColor: `${agent.color}55` }}>
                    <Icon className="h-[22px] w-[22px]" style={{ color: agent.color }} />
                  </span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="flex h-7 items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.05] px-2.5 text-[12px] text-steel"><IconLock className="h-3 w-3" />Скоро</span>
                    <span className="rounded-full border px-2.5 py-1 text-[11px] font-medium" style={{ color: rarity.color, borderColor: `${rarity.color}55`, background: `${rarity.color}12` }}>{rarity.label}</span>
                  </div>
                </div>
                <p className="mt-4 text-[20px] font-semibold tracking-[-0.02em] text-ink">{agent.name}</p>
                <p className="mt-0.5 text-[13px] font-medium" style={{ color: agent.color }}>{agent.tag}</p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-charcoal">{agent.text}</p>
                <div className="mt-4 space-y-2.5 border-t border-white/[0.07] pt-4">
                  {agent.skills.map(({ name, value }, skillIndex) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="w-[130px] shrink-0 text-[12.5px] text-steel">{name}</span>
                      <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <span className="q-grow-x absolute inset-y-0 left-0 rounded-full" style={{ width: `${value}%`, background: agent.color, ["--i" as string]: index * 2 + skillIndex + 4 }} />
                      </span>
                      <span className="q-num w-6 text-right text-[12.5px] font-semibold text-ink">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-white/[0.07] pt-4">
                  <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-steel"><IconSparkles className="h-3.5 w-3.5" style={{ color: agent.color }} />Уникальные функции</p>
                  <ul className="space-y-3">
                    {agent.abilities.map((ability) => (
                      <li key={ability.name}>
                        <p className="text-[12.5px] font-medium text-ink">{ability.name}</p>
                        <p className="mt-0.5 text-[11.5px] leading-relaxed text-steel">{ability.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1" />
                <button type="button" className="press-98 focus-ring mt-5 flex h-10 items-center justify-center gap-2 rounded-[11px] border border-white/[0.1] bg-white/[0.03] text-[13.5px] font-medium text-ink transition-colors hover:border-white/[0.2] hover:bg-white/[0.06]">
                  <IconBell className="h-4 w-4" />Сообщить о запуске
                </button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
