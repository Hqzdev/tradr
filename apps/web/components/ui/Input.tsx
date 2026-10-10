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
      <span className="text-[12.5px] text-steel">{label}</span>
      <input
        {...props}
        aria-invalid={error ? true : undefined}
        className={clsx(
          "focus-ring mt-2 h-11 w-full rounded-[12px] border bg-white/[0.03] px-3.5 text-[14.5px] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-fog hover:border-white/[0.16] focus:border-magenta/70 focus:bg-white/[0.045] focus:shadow-[0_0_0_4px_rgba(108,92,255,0.12)]",
          error ? "border-negative/70" : "border-white/[0.1]"
        )}
      />
      {error && <span className="mt-1.5 block animate-fade-in text-[12px] text-negative">{error}</span>}
    </label>
  );
}
