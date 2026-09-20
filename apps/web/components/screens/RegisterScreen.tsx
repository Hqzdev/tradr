"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";
import AuthProgress from "@/components/auth/AuthProgress";
import AuthStepFrame from "@/components/auth/AuthStepFrame";
import {
  IconAgents,
  IconCheck,
  IconChevronLeft,
  IconInfoCircle,
  IconLoading,
  IconShield,
  IconShuffle,
  IconTrendUp,
} from "@/components/icons";
import { ApiError } from "@/lib/api/client";
import { register } from "@/lib/api/auth";
import { authPath } from "@/lib/authRedirect";
import {
  BUDGET_PRESETS,
  DEFAULT_REGISTRATION_DRAFT,
  buildRegistrationPayload,
  formatBudget,
  normalizeBudgetInput,
  validateRegistrationStep,
  type AgentStrategy,
  type RegistrationDraft,
  type RegistrationErrors,
  type RegistrationStep,
} from "@/lib/AuthWizard";

const STRATEGIES = [
  { id: "careful", label: "Осторожный", caption: "Снижает риск", Icon: IconShield },
  { id: "aggressive", label: "Агрессивный", caption: "Ищет рост", Icon: IconTrendUp },
  { id: "random", label: "Случайный", caption: "Проверяет идеи", Icon: IconShuffle },
] as const;

interface RegisterScreenProps {
  nextPath?: string;
  hasExplicitNext?: boolean;
}

export default function RegisterScreen({ nextPath = "/dashboard", hasExplicitNext = false }: RegisterScreenProps) {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [draft, setDraft] = useState<RegistrationDraft>(DEFAULT_REGISTRATION_DRAFT);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [requestError, setRequestError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  const update = <Key extends keyof RegistrationDraft>(key: Key, value: RegistrationDraft[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setRequestError("");
  };

  const moveTo = (nextStep: RegistrationStep, nextDirection: "forward" | "backward") => {
    setDirection(nextDirection);
    setStep(nextStep);
    setErrors({});
    setRequestError("");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || complete) return;

    const nextErrors = validateRegistrationStep(step, draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (step < 3) {
      moveTo((step + 1) as RegistrationStep, "forward");
      return;
    }

    setSubmitting(true);
    setRequestError("");
    try {
      const result = await register(buildRegistrationPayload(draft));
      setComplete(true);
      window.setTimeout(() => router.replace(nextPath), 420);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        moveTo(1, "backward");
        setErrors({ email: "Этот e-mail уже используется" });
      } else {
        setRequestError("Не удалось создать аккаунт. Проверьте подключение и попробуйте ещё раз.");
      }
      setSubmitting(false);
    }
  };

  const back = () => {
    if (step > 1 && !submitting) moveTo((step - 1) as RegistrationStep, "backward");
  };

  return (
    <AuthCard footer={<p>Уже есть аккаунт? <Link href={authPath("/login", hasExplicitNext ? nextPath : null)}>Войти</Link></p>}>
      <AuthProgress current={step} onBack={(target) => moveTo(target, "backward")} />

      <form className="tradr-auth-form tradr-auth-register-form" onSubmit={handleSubmit} noValidate>
        <AuthStepFrame stepKey={step} direction={direction}>
          {step === 1 && <ProfileStep draft={draft} errors={errors} update={update} />}
          {step === 2 && <SecurityStep draft={draft} errors={errors} update={update} />}
          {step === 3 && <AgentStep draft={draft} errors={errors} update={update} />}
        </AuthStepFrame>

        {requestError && <p className="tradr-auth-request-error" role="alert">{requestError}</p>}

        <div className="tradr-auth-actions">
          {step > 1 && (
            <button type="button" className="tradr-auth-back" onClick={back} disabled={submitting}>
              <IconChevronLeft />Назад
            </button>
          )}
          <button type="submit" className="tradr-auth-primary" disabled={submitting || complete}>
            {complete ? <IconCheck /> : submitting ? <IconLoading className="is-spinning" /> : null}
            {complete ? "Готово" : submitting ? "Создаём…" : step === 3 ? "Создать аккаунт" : "Продолжить"}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}

interface StepProps {
  draft: RegistrationDraft;
  errors: RegistrationErrors;
  update: <Key extends keyof RegistrationDraft>(key: Key, value: RegistrationDraft[Key]) => void;
}

function ProfileStep({ draft, errors, update }: StepProps) {
  return (
    <div className="tradr-auth-step-content">
      <StepHeading eyebrow="Шаг 1 из 3" title="Создайте профиль" body="Представьтесь — так мы персонализируем вашу рабочую среду." />
      <div className="tradr-auth-fields">
        <AuthField label="Имя" autoComplete="name" placeholder="Как к вам обращаться" value={draft.displayName} onChange={(event) => update("displayName", event.target.value)} error={errors.displayName} />
        <AuthField label="E-mail" type="email" autoComplete="email" placeholder="you@example.com" value={draft.email} onChange={(event) => update("email", event.target.value)} error={errors.email} />
      </div>
    </div>
  );
}

function SecurityStep({ draft, errors, update }: StepProps) {
  const longEnough = draft.password.length >= 8;
  const matches = draft.confirmPassword.length > 0 && draft.confirmPassword === draft.password;
  return (
    <div className="tradr-auth-step-content">
      <StepHeading eyebrow="Шаг 2 из 3" title="Защитите аккаунт" body="Придумайте пароль для безопасного доступа к учебному портфелю." />
      <div className="tradr-auth-fields">
        <AuthPasswordField label="Пароль" autoComplete="new-password" placeholder="Минимум 8 символов" value={draft.password} onChange={(event) => update("password", event.target.value)} error={errors.password} />
        <AuthPasswordField label="Повторите пароль" autoComplete="new-password" placeholder="Повторите пароль" value={draft.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} error={errors.confirmPassword} />
      </div>
      <div className="tradr-auth-checklist" aria-label="Требования к паролю">
        <span className={longEnough ? "is-ready" : ""}><i><IconCheck /></i>Не менее 8 символов</span>
        <span className={matches ? "is-ready" : ""}><i><IconCheck /></i>Пароли совпадают</span>
      </div>
    </div>
  );
}

function AgentStep({ draft, errors, update }: StepProps) {
  const budget = Number(draft.budget || 0);
  return (
    <div className="tradr-auth-step-content">
      <StepHeading eyebrow="Шаг 3 из 3" title="Настройте первого агента" body="Выберите характер и лимит капитала. Всё можно изменить позже." />

      <AuthField label="Название агента" autoComplete="off" value={draft.agentName} onChange={(event) => update("agentName", event.target.value)} onClear={() => update("agentName", "")} error={errors.agentName} />

      <fieldset className="tradr-auth-strategy">
        <legend>Стратегия</legend>
        <div>
          {STRATEGIES.map(({ id, label, caption, Icon }) => (
            <label key={id} className={draft.strategy === id ? "is-selected" : ""}>
              <input type="radio" name="strategy" value={id} checked={draft.strategy === id} onChange={() => update("strategy", id as AgentStrategy)} />
              <Icon />
              <span><b>{label}</b><small>{caption}</small></span>
              <i><IconCheck /></i>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="tradr-auth-budget">
        <div className="tradr-auth-budget-heading">
          <span>Бюджетный лимит</span>
          <span className="tradr-auth-tooltip"><IconInfoCircle /><span>Максимальная совокупная экспозиция агента.</span></span>
        </div>
        <label className={errors.budget ? "has-error" : ""}>
          <span>$</span>
          <input inputMode="numeric" aria-label="Бюджетный лимит" value={formatBudget(draft.budget)} onChange={(event) => update("budget", normalizeBudgetInput(event.target.value))} />
        </label>
        {errors.budget && <p className="tradr-auth-field-message is-error" role="alert">{errors.budget}</p>}
        <div className="tradr-auth-budget-presets">
          <span className="tradr-auth-budget-line" aria-hidden="true" />
          {BUDGET_PRESETS.map((amount) => (
            <button key={amount} type="button" onClick={() => update("budget", String(amount))} className={budget === amount ? "is-active" : ""} aria-label={`Установить лимит ${formatBudget(amount)} долларов`}>
              <i />
              <span>{amount === 100000 ? "$100k" : `$${amount / 1000}k`}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tradr-auth-summary">
        <span><IconAgents /></span>
        <div><small>Агент</small><b>{draft.agentName || "Без названия"}</b></div>
        <div><small>Стратегия</small><b>{STRATEGIES.find((item) => item.id === draft.strategy)?.label}</b></div>
        <div><small>Лимит</small><b>${formatBudget(draft.budget)}</b></div>
      </div>
    </div>
  );
}

function StepHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <header className="tradr-auth-step-heading">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}
