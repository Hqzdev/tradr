"use client";

import { useState, type InputHTMLAttributes } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import clsx from "@/lib/clsx";

// Не в components/icons.tsx намеренно — эти два глифа используются только
// здесь, а не в паре мест, так что по правилу из CLAUDE.md ("Icon library")
// импортируем напрямую, как Sidebar.tsx.

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type"> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export default function PasswordInput({
  label,
  error,
  hint,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={clsx("block", className)}>
      <span className="text-caption text-steel">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          {...props}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          className={clsx(
            "focus-ring h-10 w-full rounded-btn border bg-white py-2 pl-3 pr-10 text-body-sm text-ink outline-none transition-colors duration-150 focus:border-magenta",
            error ? "border-negative" : "border-bone"
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
          className="press-98 absolute right-2.5 top-1/2 -translate-y-1/2 text-fog transition-colors duration-150 hover:text-steel"
        >
          <HugeiconsIcon
            icon={visible ? ViewOffSlashIcon : ViewIcon}
            className="h-4 w-4"
            strokeWidth={1.75}
          />
        </button>
      </span>
      {error && <span className="mt-1 block text-caption text-negative">{error}</span>}
      {!error && hint && <span className="mt-1 block text-caption text-fog">{hint}</span>}
    </label>
  );
}
