"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Toggle from "@/components/ui/Toggle";

export type SettingsSection =
  | "profile"
  | "notifications"
  | "security"
  | "trading"
  | "data"
  | "display"
  | "metrics";

const SECTION_META: Record<SettingsSection, { eyebrow: string; title: string; lead: string }> = {
  profile: {
    eyebrow: "Настройки / Профиль",
    title: "Профиль",
    lead: "Как вас видно в TRADR — имя, почта и публичные данные.",
  },
  notifications: {
    eyebrow: "Настройки / Уведомления",
    title: "Уведомления",
    lead: "Когда и как TRADR должен сообщать вам о сделках и отчётах.",
  },
  security: {
    eyebrow: "Настройки / Безопасность",
    title: "Безопасность",
    lead: "Пароль, вход в аккаунт и активные сессии.",
  },
  trading: {
    eyebrow: "Настройки / Торговля",
    title: "Торговля по умолчанию",
    lead: "Лимиты риска и правила, которые применяются к новым агентам.",
  },
  data: {
    eyebrow: "Настройки / Данные",
    title: "Данные",
    lead: "Источник котировок, глубина истории и выгрузка данных.",
  },
  display: {
    eyebrow: "Настройки / Отображение",
    title: "Отображение",
    lead: "Валюта, язык и формат чисел в интерфейсе.",
  },
  metrics: {
    eyebrow: "Настройки / Метрики",
    title: "Метрики",
    lead: "Какие показатели агентов видны на дашборде и как часто они обновляются.",
  },
};

const EXPERIENCE_OPTIONS = ["Новичок", "Средний", "Продвинутый"];
const ORDER_TYPE_OPTIONS = ["Рыночный", "Лимитный"];
const DATA_SOURCE_OPTIONS = ["Симуляция TRADR", "Задержка 15 минут", "Реальное время (бета)"];
const HISTORY_RANGE_OPTIONS = ["30 дней", "90 дней", "1 год", "Всё время"];
const CURRENCY_OPTIONS = ["USD — доллар США", "EUR — евро", "RUB — российский рубль", "GBP — фунт стерлингов"];
const LANGUAGE_OPTIONS = ["Русский", "English"];
const TIMEZONE_OPTIONS = ["GMT+3 · Москва", "GMT+5 · Екатеринбург", "GMT+0 · Лондон", "GMT-5 · Нью-Йорк"];
const NUMBER_FORMAT_OPTIONS = ["1 234,56", "1,234.56"];
const THEME_OPTIONS = ["Светлая", "Тёмная", "Системная"];
const REFRESH_OPTIONS = ["В реальном времени", "Каждую минуту", "Каждые 5 минут"];
const BENCHMARK_OPTIONS = ["Без сравнения", "S&P 500", "NASDAQ 100"];

export default function SettingsScreen({ section }: { section: SettingsSection }) {
  const meta = SECTION_META[section];
  const [saved, setSaved] = useState(false);

  // Профиль
  const [name, setName] = useState("Ярослав");
  const [nickname, setNickname] = useState("hqzdev");
  const [email, setEmail] = useState("yaroslav@tradr.app");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState(EXPERIENCE_OPTIONS[0]);

  // Уведомления
  const [notifyTrades, setNotifyTrades] = useState(true);
  const [notifyLosses, setNotifyLosses] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [volatilityAlerts, setVolatilityAlerts] = useState(false);

  // Торговля
  const [risk, setRisk] = useState(5);
  const [manualReview, setManualReview] = useState(false);
  const [orderType, setOrderType] = useState(ORDER_TYPE_OPTIONS[0]);
  const [autoPause, setAutoPause] = useState(true);

  // Данные
  const [dataSource, setDataSource] = useState(DATA_SOURCE_OPTIONS[0]);
  const [historyRange, setHistoryRange] = useState(HISTORY_RANGE_OPTIONS[1]);
  const [keepHistory, setKeepHistory] = useState(false);

  // Отображение
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [timezone, setTimezone] = useState(TIMEZONE_OPTIONS[0]);
  const [numberFormat, setNumberFormat] = useState(NUMBER_FORMAT_OPTIONS[0]);
  const [theme, setTheme] = useState(THEME_OPTIONS[0]);

  // Метрики
  const [showCapital, setShowCapital] = useState(true);
  const [showReturn, setShowReturn] = useState(true);
  const [showTrades, setShowTrades] = useState(true);
  const [showActiveCount, setShowActiveCount] = useState(true);
  const [refreshRate, setRefreshRate] = useState(REFRESH_OPTIONS[0]);
  const [benchmark, setBenchmark] = useState(BENCHMARK_OPTIONS[0]);

  return (
    <div>
      <PageHeader eyebrow={meta.eyebrow} title={meta.title} lead={meta.lead} />

      <div key={section} className="mt-7 space-y-4">
        {section === "profile" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 2 }}>
              <h2 className="text-[16px] font-semibold text-ink">Профиль</h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/[0.12] bg-[#18181d] text-[15px] font-semibold text-ink">
                  Я
                </div>
                <button className="press-98 focus-ring text-caption font-[485] text-magenta-deep hover:text-ink">
                  Изменить фото
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Имя" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Никнейм" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="sm:col-span-2"
                />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 3 }}>
              <h2 className="text-[16px] font-semibold text-ink">О трейдере</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
                <label className="block">
                  <span className="text-[12.5px] text-steel">О себе</span>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Пара слов о вашем стиле торговли — видно только вам."
                    className="focus-ring mt-2 w-full resize-none rounded-[12px] border border-white/[0.1] bg-white/[0.03] px-3.5 py-3 text-[14.5px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-fog focus:border-magenta/70 focus:shadow-[0_0_0_4px_rgba(108,92,255,0.12)]"
                  />
                </label>
                <Select
                  label="Опыт торговли"
                  value={experience}
                  options={EXPERIENCE_OPTIONS}
                  onChange={setExperience}
                />
              </div>
            </Card>
          </>
        )}

        {section === "notifications" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 4 }}>
              <h2 className="text-[16px] font-semibold text-ink">Сделки агентов</h2>
              <div className="mt-2 divide-y divide-white/[0.06]">
                <Toggle
                  label="Уведомлять о всех сделках агентов"
                  checked={notifyTrades}
                  onChange={setNotifyTrades}
                />
                <Toggle
                  label="Оповещать при закрытии позиции в минус"
                  hint="Отдельно от общего уведомления о сделках"
                  checked={notifyLosses}
                  onChange={setNotifyLosses}
                />
                <Toggle
                  label="Push-уведомления в браузере"
                  checked={notifyPush}
                  onChange={setNotifyPush}
                />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 1 }}>
              <h2 className="text-[16px] font-semibold text-ink">Отчёты</h2>
              <div className="mt-2 divide-y divide-white/[0.06]">
                <Toggle
                  label="Еженедельный отчёт на email"
                  checked={weeklyReport}
                  onChange={setWeeklyReport}
                />
                <Toggle
                  label="Сводка в конце торгового дня"
                  checked={dailyDigest}
                  onChange={setDailyDigest}
                />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 2 }}>
              <h2 className="text-[16px] font-semibold text-ink">Рынок</h2>
              <div className="mt-2 divide-y divide-white/[0.06]">
                <Toggle
                  label="Ценовые алерты по избранным тикерам"
                  checked={priceAlerts}
                  onChange={setPriceAlerts}
                />
                <Toggle
                  label="Уведомлять о высокой волатильности"
                  checked={volatilityAlerts}
                  onChange={setVolatilityAlerts}
                />
              </div>
            </Card>
          </>
        )}

        {section === "security" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 3 }}>
              <h2 className="text-[16px] font-semibold text-ink">Вход в аккаунт</h2>
              <div className="mt-4 divide-y divide-white/[0.06]">
                <SecurityRow label="Пароль" detail="Изменён 3 месяца назад" action="Изменить" />
                <SecurityRow
                  label="Двухфакторная аутентификация"
                  detail="Отключена"
                  action="Включить"
                />
                <SecurityRow label="Вход по Face ID / Touch ID" detail="Отключён" action="Включить" />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 4 }}>
              <h2 className="text-[16px] font-semibold text-ink">Сессии</h2>
              <div className="mt-4 divide-y divide-white/[0.06]">
                <SecurityRow label="Активные сессии" detail="2 устройства" action="Управлять" />
                <SecurityRow label="История входов" detail="Последний вход сегодня" action="Смотреть" />
              </div>
            </Card>
          </>
        )}

        {section === "trading" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 1 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-semibold text-ink">Лимит риска на сделку</h2>
                  <p className="mt-1 text-caption text-steel">
                    Максимальная доля капитала, которой агент рискует в одной сделке.
                  </p>
                </div>
                <span className="q-num rounded-full border border-magenta/40 bg-magenta/15 px-3 py-1 text-[14px] font-semibold text-magenta-deep">{risk}%</span>
              </div>
              <input
                aria-label="Лимит риска"
                type="range"
                min="1"
                max="10"
                value={risk}
                onChange={(event) => setRisk(Number(event.target.value))}
                className="q-range mt-4 w-full cursor-pointer"
                style={{ ["--fill" as string]: `${((risk - 1) / 9) * 100}%` }}
              />
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 2 }}>
              <h2 className="text-[16px] font-semibold text-ink">Правила исполнения</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Тип ордера по умолчанию"
                  value={orderType}
                  options={ORDER_TYPE_OPTIONS}
                  onChange={setOrderType}
                />
              </div>
              <div className="mt-2 divide-y divide-white/[0.06]">
                <Toggle
                  label="Подтверждать каждую заявку вручную"
                  checked={manualReview}
                  onChange={setManualReview}
                />
                <Toggle
                  label="Останавливать агента при просадке более 15%"
                  hint="Агент автоматически ставится на паузу до вашего решения"
                  checked={autoPause}
                  onChange={setAutoPause}
                />
              </div>
            </Card>
          </>
        )}

        {section === "data" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 3 }}>
              <h2 className="text-[16px] font-semibold text-ink">Источник котировок</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Источник рыночных данных"
                  value={dataSource}
                  options={DATA_SOURCE_OPTIONS}
                  onChange={setDataSource}
                />
                <Select
                  label="Глубина истории для анализа"
                  value={historyRange}
                  options={HISTORY_RANGE_OPTIONS}
                  onChange={setHistoryRange}
                />
              </div>
              <div className="mt-2">
                <Toggle
                  label="Хранить историю дольше 12 месяцев"
                  hint="Увеличивает объём данных, доступных для бэктестов"
                  checked={keepHistory}
                  onChange={setKeepHistory}
                />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 4 }}>
              <h2 className="text-[16px] font-semibold text-ink">Экспорт</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="outline">Выгрузить историю сделок (CSV)</Button>
                <Button variant="outline">Выгрузить журнал агентов (CSV)</Button>
              </div>
            </Card>
          </>
        )}

        {section === "display" && (
          <Card className="q-reveal p-6" style={{ ["--i" as string]: 1 }}>
            <h2 className="text-[16px] font-semibold text-ink">Валюта и регион</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
              <Select label="Базовая валюта" value={currency} options={CURRENCY_OPTIONS} onChange={setCurrency} />
              <Select label="Язык интерфейса" value={language} options={LANGUAGE_OPTIONS} onChange={setLanguage} />
              <Select label="Часовой пояс" value={timezone} options={TIMEZONE_OPTIONS} onChange={setTimezone} />
              <Select
                label="Формат чисел"
                value={numberFormat}
                options={NUMBER_FORMAT_OPTIONS}
                onChange={setNumberFormat}
              />
              <Select label="Тема оформления" value={theme} options={THEME_OPTIONS} onChange={setTheme} />
            </div>
          </Card>
        )}

        {section === "metrics" && (
          <>
            <Card className="q-reveal p-6" style={{ ["--i" as string]: 2 }}>
              <h2 className="text-[16px] font-semibold text-ink">Показатели на дашборде агентов</h2>
              <div className="mt-2 divide-y divide-white/[0.06]">
                <Toggle label="Капитал под управлением" checked={showCapital} onChange={setShowCapital} />
                <Toggle label="Средняя доходность" checked={showReturn} onChange={setShowReturn} />
                <Toggle label="Сделок всего" checked={showTrades} onChange={setShowTrades} />
                <Toggle label="Активных агентов" checked={showActiveCount} onChange={setShowActiveCount} />
              </div>
            </Card>

            <Card className="q-reveal p-6" style={{ ["--i" as string]: 3 }}>
              <h2 className="text-[16px] font-semibold text-ink">Обновление и сравнение</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Интервал обновления показателей"
                  value={refreshRate}
                  options={REFRESH_OPTIONS}
                  onChange={setRefreshRate}
                />
                <Select
                  label="Индекс для сравнения доходности"
                  value={benchmark}
                  options={BENCHMARK_OPTIONS}
                  onChange={setBenchmark}
                />
              </div>
            </Card>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost">Отменить</Button>
        <Button variant={saved ? "success" : "primary"} onClick={() => setSaved(true)}>
          {saved ? "Сохранено" : "Сохранить изменения"}
        </Button>
      </div>
    </div>
  );
}

function SecurityRow({ label, detail, action }: { label: string; detail: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-[14.5px] text-ink">{label}</p>
        <p className="mt-0.5 text-[12.5px] text-steel">{detail}</p>
      </div>
      <button className="press-98 focus-ring rounded-[10px] border border-white/[0.1] px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:border-magenta/50 hover:text-magenta-deep">
        {action}
      </button>
    </div>
  );
}
