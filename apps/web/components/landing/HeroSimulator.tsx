"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, Cancel01Icon, Search01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { IconAgents } from "@/components/icons";
import {
  HERO_AGENT_IDS,
  HeroAgentDecisionEngine,
  heroAgentProfiles,
  type HeroAgentId,
  type HeroBudgetError,
} from "@/lib/HeroAgentDecisionEngine";
import { landingMotionPreset } from "@/lib/landingMotion";
import { STOCK_TICKERS, stockCatalog, type StockProfile, type StockTicker } from "@/lib/stocks";

const budgetErrors: Record<HeroBudgetError, string> = {
  empty: "Введите учебный бюджет.",
  invalid: "Используйте положительное число, максимум с двумя знаками после запятой.",
  "too-small": "Бюджета не хватает даже на одну акцию выбранной компании.",
  "too-large": "Для быстрого сценария укажите не больше $1 000 000.",
};

function money(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function StockIdentity({ stock, compact = false }: { stock: StockProfile; compact?: boolean }) {
  return (
    <span className={compact ? "tradr-simulator-stock tradr-simulator-stock--compact" : "tradr-simulator-stock"}>
      <i style={{ background: stock.color }}>
        <Image src={stock.logoSrc} alt="" width={32} height={32} unoptimized />
      </i>
      <span><strong>{stock.ticker}</strong>{!compact && <small>{stock.name}</small>}</span>
    </span>
  );
}

function StockSelector({ selected, onSelect }: { selected: StockTicker; onSelect: (ticker: StockTicker) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const stock = stockCatalog[selected];
  const filteredStocks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return STOCK_TICKERS.map((ticker) => stockCatalog[ticker]);
    return STOCK_TICKERS
      .map((ticker) => stockCatalog[ticker])
      .filter((item) => item.ticker.toLowerCase().includes(normalized) || item.name.toLowerCase().includes(normalized));
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const choose = (ticker: StockTicker) => {
    onSelect(ticker);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button className="tradr-simulator-stock-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <StockIdentity stock={stock} compact />
        <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && createPortal(
        <div className="tradr-stock-picker-layer" role="presentation">
          <button className="tradr-stock-picker-backdrop" type="button" aria-label="Закрыть выбор акции" onClick={() => setOpen(false)} />
          <section className="tradr-stock-picker" role="dialog" aria-modal="true" aria-labelledby="stock-picker-title">
            <header>
              <div><span>18 инструментов</span><h2 id="stock-picker-title">Выберите акцию</h2></div>
              <button type="button" aria-label="Закрыть" onClick={() => setOpen(false)}><HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} /></button>
            </header>
            <label className="tradr-stock-picker-search">
              <HugeiconsIcon icon={Search01Icon} strokeWidth={1.8} aria-hidden="true" />
              <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Тикер или компания" />
            </label>
            <div className="tradr-stock-picker-list">
              {filteredStocks.map((item) => (
                <button className={item.ticker === selected ? "is-selected" : ""} type="button" key={item.ticker} onClick={() => choose(item.ticker)}>
                  <StockIdentity stock={item} />
                  <span className="tradr-stock-picker-meta"><strong>{money(item.demoPrice)}</strong><small>{item.exchange}</small></span>
                </button>
              ))}
              {!filteredStocks.length && <p>Ничего не найдено. Попробуйте другой тикер.</p>}
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}

export default function HeroSimulator() {
  const engine = useMemo(() => new HeroAgentDecisionEngine(), []);
  const [ticker, setTicker] = useState<StockTicker>("AAPL");
  const [budget, setBudget] = useState("2500");
  const [agentId, setAgentId] = useState<HeroAgentId>("random");
  const [submittedKey, setSubmittedKey] = useState(0);
  const [error, setError] = useState<HeroBudgetError | null>(null);
  const [decision, setDecision] = useState(() => engine.evaluate(stockCatalog.AAPL, "2500", "random").decision);
  const stock = stockCatalog[ticker];
  const agent = heroAgentProfiles[agentId];

  const runAgent = () => {
    const result = engine.evaluate(stock, budget, agentId);
    setError(result.error);
    if (result.decision) {
      setDecision(result.decision);
      setSubmittedKey((key) => key + 1);
    } else {
      setDecision(null);
    }
  };

  return (
    <div
      className="tradr-ticket tradr-simulator"
      aria-label="Интерактивный симулятор решения учебного агента"
      style={{ "--intro-delay": `${landingMotionPreset.heroTicketDelayMs}ms` } as CSSProperties}
    >
      <div className="tradr-ticket-panel tradr-ticket-panel--top">
        <label className="tradr-ticket-label" htmlFor="hero-budget">Учебный бюджет</label>
        <div className="tradr-simulator-input-row">
          <span aria-hidden="true">$</span>
          <input
            id="hero-budget"
            inputMode="decimal"
            value={budget}
            onChange={(event) => {
              setBudget(event.target.value);
              setError(null);
              setDecision(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") runAgent();
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "hero-budget-error" : "hero-budget-hint"}
          />
          <StockSelector selected={ticker} onSelect={(nextTicker) => {
            setTicker(nextTicker);
            setError(null);
            setDecision(null);
          }} />
        </div>
        <small id={error ? "hero-budget-error" : "hero-budget-hint"} className={error ? "tradr-ticket-error" : ""} role={error ? "alert" : undefined}>
          {error ? budgetErrors[error] : `${stock.name} · ${stock.exchange} · ${money(stock.demoPrice)}`}
        </small>
      </div>

      <div className="tradr-agent-picker" aria-label="Выбор учебного агента">
        {HERO_AGENT_IDS.map((id) => (
          <button className={id === agentId ? "is-active" : ""} type="button" key={id} onClick={() => {
            setAgentId(id);
            setError(null);
            setDecision(null);
          }} aria-pressed={id === agentId}>
            {heroAgentProfiles[id].shortName}
          </button>
        ))}
      </div>

      <div className="tradr-ticket-panel tradr-ticket-panel--bottom" key={`${submittedKey}-${ticker}-${agentId}`} aria-live="polite">
        <span className="tradr-ticket-label">Решение агента</span>
        <div className="tradr-ticket-value">
          <strong className={`tradr-decision tradr-decision--${decision?.action ?? "wait"}`}>{decision?.actionLabel ?? "—"}</strong>
          <span className="tradr-agent-chip"><IconAgents aria-hidden="true" />{agent.shortName}</span>
        </div>
        <div className="tradr-decision-summary">
          <span>{decision?.quantity ? `${decision.quantity} шт.` : "Без сделки"}</span>
          <span>Учебный шанс <b>{decision?.confidence ?? 0}%</b></span>
        </div>
        <small>{decision?.explanation ?? agent.description}</small>
      </div>

      <button className="tradr-ticket-cta" type="button" onClick={runAgent}>
        <HugeiconsIcon icon={Wallet01Icon} strokeWidth={1.9} aria-hidden="true" />
        Запустить агента
      </button>
      <p className="tradr-simulator-disclaimer">Это учебная модель, а не инвестиционная рекомендация.</p>
    </div>
  );
}
