"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { NfcIcon } from "@hugeicons/core-free-icons";
import StockMark from "@/components/market/StockMark";
import { IconLogo } from "@/components/icons";
import { getStockProfile } from "@/lib/stocks";
import clsx from "@/lib/clsx";

// Mobile design tokens — mirror the `m-*` variables in design.pen
// ("Tradr Mobile" section). Accent is the product violet #6C5CFF.
export const M = {
  bg: "#0A0A0D",
  card: "#16161B",
  card2: "#212128",
  muted: "#8C8C97",
  dim: "#5C5C66",
  accent: "#6C5CFF",
  accentLight: "#B3A9FF",
  line: "#9C90FF",
  ink: "#0E0B22",
  up: "#2EBD85",
  down: "#F6465D",
} as const;

export function MCard({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={clsx("rounded-[24px] bg-[#16161B]", className)} style={style}>
      {children}
    </div>
  );
}

export function MCircleButton({
  label,
  href,
  onClick,
  children,
  accent = false,
  className,
}: {
  label: string;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  const cls = clsx(
    "press-98 focus-ring grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-colors duration-200",
    accent ? "bg-[#6C5CFF] shadow-[0_8px_20px_-6px_rgba(108,92,255,0.7)]" : "bg-[#212128] hover:bg-[#2a2a33]",
    className
  );
  if (href) return <Link href={href} aria-label={label} className={cls}>{children}</Link>;
  return <button type="button" aria-label={label} onClick={onClick} className={cls}>{children}</button>;
}

export function MSectionHead({ title, action, href }: { title: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[17px] font-bold text-[#F4F4F6]">{title}</h2>
      {action && href && (
        <Link href={href} className="focus-ring rounded-md text-[13px] font-semibold text-[#8C8C97] transition-colors hover:text-white">
          {action}
        </Link>
      )}
    </div>
  );
}

export function MTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#F4F4F6]">{children}</h1>;
}

// Pill segmented control with one persistent sliding indicator (CLAUDE.md rule).
export function MSegmented({
  options,
  value,
  onChange,
  tone = "accent",
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  tone?: "accent" | "neutral";
}) {
  const index = Math.max(options.indexOf(value), 0);
  return (
    <div className="relative grid rounded-full bg-[#16161B] p-[5px]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-y-[5px] left-[5px] rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          tone === "accent" ? "bg-[#6C5CFF]" : "bg-[#212128]"
        )}
        style={{ width: `calc((100% - 10px) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={clsx(
              "press-98 focus-ring relative z-10 h-[40px] whitespace-nowrap rounded-full px-2 text-[13.5px] font-bold transition-colors duration-200",
              active ? (tone === "accent" ? "text-white" : "text-[#F4F4F6]") : "text-[#8C8C97]"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function MSpark({ values, width = 56, height = 26, color = M.line }: { values: number[]; width?: number; height?: number; color?: string }) {
  if (values.length < 2) return <span style={{ width, height }} className="inline-block" />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const d = values
    .map((value, i) => `${i === 0 ? "M" : "L"}${((i * width) / (values.length - 1)).toFixed(1)} ${(height - 3 - ((value - min) / range) * (height - 6)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden className="shrink-0">
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MStock({ ticker, size = 44 }: { ticker: string; size?: number }) {
  const profile = getStockProfile(ticker);
  if (profile) return <StockMark stock={profile} size={size} />;
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-[#212128] font-extrabold text-white" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {ticker[0]}
    </span>
  );
}

export function MAgentAvatar({ color, size = 48, radius = 16, children }: { color: string; size?: number; radius?: number; children: ReactNode }) {
  return (
    <span
      className="grid shrink-0 place-items-center text-white"
      style={{ width: size, height: size, borderRadius: radius, background: `linear-gradient(135deg, ${color} 0%, ${color}55 100%)` }}
    >
      {children}
    </span>
  );
}

export function MStatusDot({ status }: { status: string }) {
  const color = status === "active" ? M.up : status === "error" ? M.down : "#F0B429";
  return <span className="inline-block h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: color }} />;
}

export function MChange({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span className={clsx("q-num font-bold", up ? "text-[#2EBD85]" : "text-[#F6465D]", className)}>
      {up ? "+" : "−"}
      {Math.abs(value).toFixed(2).replace(".", ",")}%
    </span>
  );
}

export function MEmpty({ title, description, actionLabel, actionHref }: { title: string; description: string; actionLabel?: string; actionHref?: string }) {
  return (
    <MCard className="px-5 py-8 text-center">
      <p className="text-[15px] font-bold text-[#F4F4F6]">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-5 text-[#8C8C97]">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="press-98 focus-ring mt-4 inline-flex h-11 items-center rounded-full bg-[#6C5CFF] px-5 text-[14px] font-bold text-white">
          {actionLabel}
        </Link>
      )}
    </MCard>
  );
}

export function MSkeleton({ blocks = [226, 180, 120, 240] }: { blocks?: number[] }) {
  return (
    <div className="m-ui space-y-4" aria-label="Загрузка">
      {blocks.map((height, index) => (
        <div key={index} className="skeleton rounded-[24px]" style={{ height }} />
      ))}
    </div>
  );
}

// TRADR Visa card from the "M01 Главная" mock: a back card peeking out and
// the violet front card with chip, contactless mark, masked number and VISA.
export function TradrCard({ holder, last4 = "3377", plan = "Учебный счёт" }: { holder: string; last4?: string; plan?: string }) {
  return (
    <div className="relative h-[226px]" aria-label={`Карта TRADR Visa, •• ${last4}`}>
      <div className="absolute inset-x-[18px] top-0 h-[200px] rounded-[24px] opacity-55" style={{ background: "linear-gradient(90deg, #4A3BD6 0%, #8F82FF 100%)" }} />
      <div
        className="absolute inset-x-0 top-[14px] flex h-[212px] flex-col justify-between overflow-hidden rounded-[26px] p-[22px] text-[#0E0B22] shadow-[0_16px_40px_rgba(108,92,255,0.3)]"
        style={{ background: "radial-gradient(130% 140% at 10% 5%, #DCD6FF 0%, #A194FF 40%, #6C5CFF 80%, #5242E8 100%)" }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(110deg, transparent 55%, rgba(255,255,255,0.16) 62%, transparent 76%)" }} />
        <div className="relative flex items-start justify-between">
          <div>
            <div className="flex items-center gap-[7px]">
              <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-[7px] bg-[#0E0B22]">
                <IconLogo className="h-5 w-5" />
              </span>
              <span className="text-[20px] font-extrabold tracking-[-0.03em]">tradr</span>
            </div>
            <p className="mt-1 text-[12px] font-semibold text-[#0E0B22]/65">{plan}</p>
          </div>
          <HugeiconsIcon icon={NfcIcon} className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <span aria-hidden className="relative h-8 w-[42px] rounded-[7px] border border-[#0E0B22]/20" style={{ background: "linear-gradient(135deg, #F1EEFF 0%, #BDB3FF 100%)" }} />
        <div className="relative flex items-end justify-between">
          <div>
            <p className="q-num text-[16px] font-bold tracking-[0.06em]">••&nbsp;&nbsp;{last4}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[#0E0B22]/60">{holder}</p>
          </div>
          <span className="font-sans text-[30px] font-black italic leading-none tracking-[-0.02em]">VISA</span>
        </div>
      </div>
    </div>
  );
}

export const usd = (value: number, decimals = 2) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
export const signedUsd = (value: number, decimals = 2) => `${value >= 0 ? "+" : "−"}${usd(Math.abs(value), decimals)}`;
export const hhmm = (value: string) => new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
export const actionText = (action: string) => (action === "buy" ? "Покупка" : action === "sell" ? "Продажа" : "Анализ");
