import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "@/lib/clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "q-shine bg-magenta text-white shadow-[0_10px_30px_-12px_rgba(108,92,255,0.85)] hover:bg-[#7a6bff] hover:shadow-[0_14px_34px_-12px_rgba(108,92,255,1)] disabled:bg-white/[0.06] disabled:text-fog disabled:shadow-none",
  secondary:
    "bg-magenta/15 text-magenta-deep border border-magenta/30 hover:bg-magenta/25 disabled:bg-white/[0.04] disabled:text-fog disabled:border-transparent",
  outline:
    "bg-white/[0.03] text-ink border border-white/[0.1] hover:border-white/[0.2] hover:bg-white/[0.06] disabled:text-fog disabled:border-white/[0.06]",
  ghost: "bg-transparent text-ink hover:bg-white/[0.06] disabled:text-fog",
  destructive:
    "bg-negative/[0.08] text-negative border border-negative/30 hover:bg-negative/15 hover:border-negative/50 disabled:text-fog disabled:border-white/[0.06] disabled:bg-transparent",
  success:
    "q-shine bg-positive text-[#06140e] shadow-[0_10px_30px_-14px_rgba(46,189,133,0.8)] hover:bg-[#3fd197] disabled:bg-white/[0.06] disabled:text-fog disabled:shadow-none",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[12.5px] gap-1.5 rounded-[10px]",
  md: "h-11 px-[18px] text-[14px] gap-2 rounded-[12px]",
  lg: "h-[52px] px-6 text-[15px] gap-2 rounded-[14px]",
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
        "press-98 focus-ring inline-flex items-center justify-center font-medium transition-[background-color,border-color,box-shadow,color,transform] duration-200 ease-out disabled:cursor-not-allowed",
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
