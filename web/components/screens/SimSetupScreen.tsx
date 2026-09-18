"use client";

import { useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/ui/PageHeader";
import Toggle from "@/components/ui/Toggle";
import { IconUpload } from "@/components/icons";
import { simSetupDefaults } from "@/lib/tradingExtra";

export default function SimSetupScreen() {
  const [reinvest, setReinvest] = useState(true);
  const [delay, setDelay] = useState(false);
  const [partialFill, setPartialFill] = useState(true);
  const [commission, setCommission] = useState(0.1);
  const [slippage, setSlippage] = useState(0.05);

  return (
    <div>
      <PageHeader
        eyebrow="Симуляция / Новая сессия"
        title="Настройка симуляции"
        lead="Задайте капитал, издержки и стратегию перед запуском тестовой сессии."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Капитал и период</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
              <div className="rounded-btn border border-bone px-4 py-2.5">
                <p className="text-caption text-steel">Начальный баланс</p>
                <p className="mt-0.5 text-heading-sm font-[485] tabular-nums text-ink">
                  {simSetupDefaults.startingCapital}
                </p>
                <p className="mt-1 text-caption text-steel">Стартовый капитал для сессии</p>
              </div>
              <div className="rounded-btn border border-bone px-4 py-2.5">
                <p className="text-caption text-steel">Валюта</p>
                <p className="mt-0.5 text-body font-[485] text-ink">{simSetupDefaults.currency}</p>
              </div>
            </div>
            <div className="mt-3 rounded-btn border border-bone px-4 py-2.5">
              <p className="text-caption text-steel">Исторический период теста</p>
              <p className="mt-0.5 text-body font-[485] text-ink">{simSetupDefaults.period}</p>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Комиссия и проскальзывание</p>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-steel">Комиссия за сделку</span>
                  <span className="tabular-nums text-ink">{commission.toFixed(2).replace(".", ",")}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={commission}
                  onChange={(e) => setCommission(parseFloat(e.target.value))}
                  className="mt-2 w-full accent-magenta"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-body-sm">
                  <span className="text-steel">Проскальзывание</span>
                  <span className="tabular-nums text-ink">{slippage.toFixed(2).replace(".", ",")}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value))}
                  className="mt-2 w-full accent-magenta"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Условия исполнения</p>
            <div className="mt-2 divide-y divide-bone">
              <Toggle checked={reinvest} onChange={setReinvest} label="Реинвестировать прибыль" />
              <Toggle checked={delay} onChange={setDelay} label="Задержка исполнения (реалистичный режим)" />
              <Toggle checked={partialFill} onChange={setPartialFill} label="Разрешить частичное исполнение" />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Исторические данные</p>
            <Link
              href="/simulation/new/data"
              className="press-98 focus-ring mt-4 flex flex-col items-center justify-center gap-2 rounded-btn border border-dashed border-fog/60 px-4 py-8 text-center transition-colors duration-150 hover:border-magenta/50 hover:bg-magenta-tint/30"
            >
              <IconUpload className="h-6 w-6 text-steel" />
              <span className="text-body-sm text-ink">Перетащите CSV или нажмите для выбора</span>
              <span className="text-caption text-steel">Формат: время, open, high, low, close, volume</span>
            </Link>
            <p className="mt-3 text-center text-caption text-fog">или выберите инструмент из списка</p>
            <div className="mt-2 rounded-btn border border-bone px-4 py-2.5 text-body-sm text-ink">
              {simSetupDefaults.instrument}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-subheading font-[485] text-ink">Стратегия</p>
            <div className="mt-4 rounded-btn border border-bone px-4 py-2.5 text-body-sm text-ink">
              {simSetupDefaults.strategy}
            </div>
            <div className="mt-3 rounded-btn border border-bone px-4 py-3 text-body-sm text-steel">
              Настройки риска стратегии доступны после выбора.
            </div>
          </Card>

          <Card className="bg-[#FCFAFD] p-6">
            <p className="text-subheading font-[485] text-ink">Сводка перед запуском</p>
            <div className="mt-3 flex flex-col gap-2 text-body-sm">
              <div className="flex justify-between">
                <span className="text-steel">Капитал</span>
                <span className="tabular-nums text-ink">{simSetupDefaults.startingCapital} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel">Период</span>
                <span className="tabular-nums text-ink">{simSetupDefaults.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel">Инструмент</span>
                <span className="text-ink">AAPL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel">Стратегия</span>
                <span className="text-ink">Агрессивный</span>
              </div>
              <div className="flex justify-between">
                <span className="text-steel">Издержки</span>
                <span className="tabular-nums text-ink">
                  {commission.toFixed(2).replace(".", ",")}% комиссия · {slippage.toFixed(2).replace(".", ",")}% проскальз.
                </span>
              </div>
            </div>
            <Link href="/simulation/live">
              <Button variant="primary" fullWidth className="mt-5">
                Запустить симуляцию
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
