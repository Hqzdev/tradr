import type { StockProfile } from "./stocks";

export const HERO_AGENT_IDS = ["cautious", "aggressive", "random"] as const;

export type HeroAgentId = (typeof HERO_AGENT_IDS)[number];
export type HeroDecisionAction = "buy" | "sell" | "wait";
export type HeroBudgetError = "empty" | "invalid" | "too-small" | "too-large";

export interface HeroAgentProfile {
  id: HeroAgentId;
  name: string;
  shortName: string;
  description: string;
}

export interface HeroAgentDecision {
  action: HeroDecisionAction;
  actionLabel: string;
  quantity: number;
  confidence: number;
  explanation: string;
}

export interface HeroDecisionResult {
  decision: HeroAgentDecision | null;
  error: HeroBudgetError | null;
}

export const heroAgentProfiles: Record<HeroAgentId, HeroAgentProfile> = {
  cautious: {
    id: "cautious",
    name: "Осторожный агент",
    shortName: "Осторожный",
    description: "Ждёт более выраженного движения и избегает слабых сигналов.",
  },
  aggressive: {
    id: "aggressive",
    name: "Агрессивный агент",
    shortName: "Агрессивный",
    description: "Реагирует быстрее и использует большую часть учебного бюджета.",
  },
  random: {
    id: "random",
    name: "Случайный агент",
    shortName: "Случайный",
    description: "Выбирает действие из трёх вариантов для сравнения со стратегиями.",
  },
};

export class HeroAgentDecisionEngine {
  private static readonly MAX_BUDGET = 1_000_000;

  public evaluate(stock: StockProfile, budgetInput: string, agentId: HeroAgentId): HeroDecisionResult {
    const budget = this.parseBudget(budgetInput);
    if (budget === null) {
      return { decision: null, error: budgetInput.trim() ? "invalid" : "empty" };
    }
    if (budget > HeroAgentDecisionEngine.MAX_BUDGET) {
      return { decision: null, error: "too-large" };
    }
    if (budget < stock.demoPrice) {
      return { decision: null, error: "too-small" };
    }

    const quantity = Math.max(1, Math.floor((budget * this.allocation(agentId)) / stock.demoPrice));
    const action = this.actionFor(stock, budget, agentId);
    const confidence = this.confidenceFor(stock, budget, agentId, action);

    return {
      error: null,
      decision: {
        action,
        actionLabel: action === "buy" ? "Купить" : action === "sell" ? "Продать" : "Ждать",
        quantity: action === "wait" ? 0 : quantity,
        confidence,
        explanation: this.explanationFor(stock, agentId, action),
      },
    };
  }

  private parseBudget(value: string): number | null {
    const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
    if (!/^\d+(?:\.\d{0,2})?$/.test(normalized)) return null;
    const budget = Number(normalized);
    return Number.isFinite(budget) && budget > 0 ? budget : null;
  }

  private allocation(agentId: HeroAgentId): number {
    if (agentId === "cautious") return 0.45;
    if (agentId === "aggressive") return 0.9;
    return 0.68;
  }

  private actionFor(stock: StockProfile, budget: number, agentId: HeroAgentId): HeroDecisionAction {
    const change = stock.demoChangePercent;
    if (agentId === "cautious") {
      if (change > 0.8) return "buy";
      if (change < -0.8) return "sell";
      return "wait";
    }
    if (agentId === "aggressive") {
      if (Math.abs(change) >= 0.2) return change > 0 ? "buy" : "sell";
      return this.stableSignal(stock.ticker, budget) > 0 ? "buy" : "sell";
    }
    const signal = Math.abs(this.stableSignal(stock.ticker, budget)) % 3;
    return signal === 0 ? "wait" : signal === 1 ? "buy" : "sell";
  }

  private confidenceFor(
    stock: StockProfile,
    budget: number,
    agentId: HeroAgentId,
    action: HeroDecisionAction,
  ): number {
    const base = agentId === "cautious" ? 62 : agentId === "aggressive" ? 55 : 59;
    const momentum = Math.min(22, Math.round(Math.abs(stock.demoChangePercent) * 9));
    const budgetSignal = Math.abs(this.stableSignal(stock.ticker, budget)) % 7;
    const waitAdjustment = action === "wait" ? 4 : 0;
    return Math.min(91, base + momentum + budgetSignal + waitAdjustment);
  }

  private explanationFor(stock: StockProfile, agentId: HeroAgentId, action: HeroDecisionAction): string {
    const direction = stock.demoChangePercent >= 0 ? "положительное" : "отрицательное";
    if (agentId === "random") {
      return `Случайный агент выбрал ${action === "buy" ? "покупку" : action === "sell" ? "продажу" : "ожидание"} ${stock.ticker} без анализа движения — как контрольный сценарий.`;
    }
    if (action === "wait") {
      return `${heroAgentProfiles[agentId].shortName} не видит достаточно сильного сигнала и сохраняет учебный бюджет.`;
    }
    return `${heroAgentProfiles[agentId].shortName} учитывает ${direction} движение ${stock.ticker} и моделирует ${action === "buy" ? "покупку" : "продажу"}.`;
  }

  private stableSignal(ticker: string, budget: number): number {
    return [...`${ticker}:${Math.round(budget)}`].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) | 0, 7);
  }
}
