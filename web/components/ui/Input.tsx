import type { InputHTMLAttributes } from "react";
import clsx from "@/lib/clsx";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  className?: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <label className={clsx("block", className)}>
      <span className="text-caption text-steel">{label}</span>
      <input
        {...props}
        className="focus-ring mt-1.5 h-10 w-full rounded-btn border border-bone bg-white px-3 text-body-sm text-ink outline-none transition-colors duration-150 focus:border-magenta"
      />
    </label>
  );
}
