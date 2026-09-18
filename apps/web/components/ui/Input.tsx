import type { InputHTMLAttributes } from "react";
import clsx from "@/lib/clsx";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  /** Ошибка валидации — красная рамка + подпись под полем. Опционально,
   *  существующие вызовы без этого пропа работают как раньше. */
  error?: string;
  className?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className={clsx("block", className)}>
      <span className="text-caption text-steel">{label}</span>
      <input
        {...props}
        aria-invalid={error ? true : undefined}
        className={clsx(
          "focus-ring mt-1.5 h-10 w-full rounded-btn border bg-white px-3 text-body-sm text-ink outline-none transition-colors duration-150 focus:border-magenta",
          error ? "border-negative" : "border-bone"
        )}
      />
      {error && <span className="mt-1 block text-caption text-negative">{error}</span>}
    </label>
  );
}
