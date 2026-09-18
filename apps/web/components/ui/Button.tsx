import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "@/lib/clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-magenta text-white hover:bg-magenta-deep shadow-soft disabled:bg-bone disabled:text-fog disabled:shadow-none",
  secondary:
    "bg-magenta-tint text-magenta-deep hover:bg-[#fbdcf1] disabled:bg-bone disabled:text-fog",
  outline:
    "bg-white text-ink border border-bone hover:border-ink/20 hover:bg-[#fafafa] disabled:text-fog disabled:border-bone",
  ghost: "bg-transparent text-ink hover:bg-bone/70 disabled:text-fog",
  destructive:
    "bg-white text-negative border border-negative/20 hover:bg-negative-tint disabled:text-fog disabled:border-bone",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-caption gap-1.5 rounded-[10px]",
  md: "h-11 px-5 text-body-sm gap-2 rounded-btn",
  lg: "h-[52px] px-6 text-body gap-2 rounded-[18px]",
};

export default function Button({
  variant = "outline",
  size = "md",
  icon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "press-98 focus-ring inline-flex items-center justify-center font-[485] transition-all duration-120 ease-out disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
