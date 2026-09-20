"use client";

import { useState, type InputHTMLAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { IconX } from "@/components/icons";
import clsx from "@/lib/clsx";

interface AuthFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  error?: string;
  hint?: string;
  onClear?: () => void;
  className?: string;
}

export function AuthField({ label, error, hint, onClear, className, ...props }: AuthFieldProps) {
  return (
    <label className={clsx("tradr-auth-field", className)}>
      <span>{label}</span>
      <span className="tradr-auth-input-wrap">
        <input {...props} aria-invalid={error ? true : undefined} />
        {onClear && props.value && (
          <button type="button" onClick={onClear} aria-label={`Очистить поле «${label}»`}>
            <IconX />
          </button>
        )}
      </span>
      <FieldMessage error={error} hint={hint} />
    </label>
  );
}

export function AuthPasswordField({ label, error, hint, className, ...props }: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <label className={clsx("tradr-auth-field", className)}>
      <span>{label}</span>
      <span className="tradr-auth-input-wrap">
        <input {...props} type={visible ? "text" : "password"} aria-invalid={error ? true : undefined} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        >
          <HugeiconsIcon icon={visible ? ViewOffSlashIcon : ViewIcon} />
        </button>
      </span>
      <FieldMessage error={error} hint={hint} />
    </label>
  );
}

function FieldMessage({ error, hint }: { error?: string; hint?: string }) {
  if (!error && !hint) return null;
  return (
    <span className={clsx("tradr-auth-field-message", error && "is-error")} aria-live={error ? "polite" : undefined}>
      {error ?? hint}
    </span>
  );
}
