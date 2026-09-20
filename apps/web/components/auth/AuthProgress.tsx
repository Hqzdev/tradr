import type { RegistrationStep } from "@/lib/AuthWizard";

const STEPS: { id: RegistrationStep; label: string }[] = [
  { id: 1, label: "Профиль" },
  { id: 2, label: "Безопасность" },
  { id: 3, label: "Первый агент" },
];

interface AuthProgressProps {
  current: RegistrationStep;
  onBack: (step: RegistrationStep) => void;
}

export default function AuthProgress({ current, onBack }: AuthProgressProps) {
  return (
    <nav className="tradr-auth-progress" aria-label={`Регистрация, шаг ${current} из 3`}>
      {STEPS.map((step, index) => {
        const complete = step.id < current;
        const active = step.id === current;
        return (
          <span key={step.id} className="tradr-auth-progress-item">
            <button
              type="button"
              onClick={() => complete && onBack(step.id)}
              disabled={!complete}
              className={active ? "is-active" : complete ? "is-complete" : ""}
              aria-current={active ? "step" : undefined}
            >
              <i>{step.id}</i>
              <span>{step.label}</span>
            </button>
            {index < STEPS.length - 1 && <b aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}
