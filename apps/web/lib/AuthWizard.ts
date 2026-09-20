export type RegistrationStep = 1 | 2 | 3;
export type AgentStrategy = "careful" | "aggressive" | "random";

export interface RegistrationDraft {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agentName: string;
  strategy: AgentStrategy;
  budget: string;
}

export interface RegistrationErrors {
  displayName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agentName?: string;
  budget?: string;
}

export interface RegistrationPayload {
  displayName: string;
  email: string;
  password: string;
  firstAgent: {
    name: string;
    strategy: AgentStrategy;
    budgetLimit: number;
  };
}

export const BUDGET_PRESETS = [10000, 25000, 50000, 75000, 100000] as const;
export const DEFAULT_REGISTRATION_DRAFT: RegistrationDraft = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  agentName: "Мой первый агент",
  strategy: "careful",
  budget: "75000",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegistrationStep(step: RegistrationStep, draft: RegistrationDraft): RegistrationErrors {
  if (step === 1) {
    return {
      ...(draft.displayName.trim().length < 2 ? { displayName: "Введите имя — минимум 2 символа" } : {}),
      ...(!EMAIL_RE.test(draft.email.trim()) ? { email: "Введите корректный e-mail" } : {}),
    };
  }

  if (step === 2) {
    return {
      ...(draft.password.length < 8 ? { password: "Минимум 8 символов" } : {}),
      ...(draft.confirmPassword !== draft.password ? { confirmPassword: "Пароли не совпадают" } : {}),
    };
  }

  const budget = Number(draft.budget);
  return {
    ...(draft.agentName.trim().length < 2 ? { agentName: "Введите название агента" } : {}),
    ...(!Number.isFinite(budget) || budget < 1000 || budget > 100000
      ? { budget: "Укажите сумму от $1 000 до $100 000" }
      : {}),
  };
}

export function buildRegistrationPayload(draft: RegistrationDraft): RegistrationPayload {
  const steps: RegistrationStep[] = [1, 2, 3];
  const errors = Object.assign({}, ...steps.map((step) => validateRegistrationStep(step, draft)));
  if (Object.keys(errors).length > 0) {
    throw new Error("Registration draft is invalid");
  }

  return {
    displayName: draft.displayName.trim(),
    email: draft.email.trim(),
    password: draft.password,
    firstAgent: {
      name: draft.agentName.trim(),
      strategy: draft.strategy,
      budgetLimit: Number(draft.budget),
    },
  };
}

export function normalizeBudgetInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function formatBudget(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value || 0);
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(amount);
}
