"use client";

import clsx from "@/lib/clsx";

// One persistent indicator that slides between options (CLAUDE.md rule).
export default function SegmentedControl({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  size?: "sm" | "md";
}) {
  const activeIndex = Math.max(options.indexOf(value), 0);

  return (
    <div
      className="relative grid rounded-[12px] border border-white/[0.07] bg-white/[0.02] p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 rounded-[9px] border border-magenta/40 bg-magenta/[0.16] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={clsx(
              "press-98 focus-ring relative z-10 whitespace-nowrap rounded-[9px] font-medium transition-colors duration-200",
              size === "sm" ? "px-3 py-1.5 text-[12.5px]" : "px-4 py-2 text-[13.5px]",
              active ? "text-magenta-deep" : "text-steel hover:text-ink"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function TimeframeControl({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const activeIndex = Math.max(options.indexOf(value), 0);
  return (
    <div className="relative flex items-center gap-0.5 rounded-[11px] border border-white/[0.07] bg-white/[0.02] p-[3px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-[3px] left-[3px] rounded-[8px] border border-white/[0.12] bg-white/[0.08] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: 44, transform: `translateX(${activeIndex * 46}px)` }}
      />
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={clsx(
              "press-98 focus-ring relative z-10 h-[30px] w-[44px] rounded-[8px] text-[12.5px] font-medium transition-colors duration-200",
              active ? "text-ink" : "text-steel hover:text-ink"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function BuySellToggle({
  value,
  onChange,
}: {
  value: "buy" | "sell";
  onChange: (v: "buy" | "sell") => void;
}) {
  return (
    <div className="relative grid grid-cols-2 gap-1 rounded-[12px] border border-white/[0.07] bg-white/[0.02] p-1">
      <span
        aria-hidden
        className={clsx(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-6px)] rounded-[9px] border transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          value === "buy" ? "translate-x-0 border-positive/40 bg-positive/[0.14]" : "translate-x-[calc(100%+4px)] border-negative/40 bg-negative/[0.14]"
        )}
      />
      {(["buy", "sell"] as const).map((side) => (
        <button
          key={side}
          onClick={() => onChange(side)}
          className={clsx(
            "press-98 focus-ring relative z-10 h-10 rounded-[9px] text-[14px] font-medium transition-colors duration-200",
            value === side ? (side === "buy" ? "text-positive" : "text-negative") : "text-steel hover:text-ink"
          )}
        >
          {side === "buy" ? "Купить" : "Продать"}
        </button>
      ))}
    </div>
  );
}
