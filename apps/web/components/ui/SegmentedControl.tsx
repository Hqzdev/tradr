"use client";

import clsx from "@/lib/clsx";

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
      className="relative grid rounded-pill border border-bone bg-[#fafafa] p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-1 left-1 rounded-pill bg-white shadow-soft transition-transform duration-200 ease-out"
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
              "press-98 focus-ring relative z-10 whitespace-nowrap rounded-pill font-[485] transition-colors duration-180",
              size === "sm" ? "px-3 py-1.5 text-caption" : "px-4 py-2 text-body-sm",
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

export function TimeframeControl({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={clsx(
              "press-98 focus-ring rounded-pill px-2.5 py-1 text-caption font-[485] transition-all duration-150",
              active ? "bg-magenta-tint text-magenta-deep" : "text-steel hover:bg-bone/70"
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
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange("buy")}
        className={clsx(
          "press-98 focus-ring h-11 rounded-btn text-body-sm font-[485] transition-all duration-180",
          value === "buy"
            ? "bg-positive-tint text-ink"
            : "border border-bone bg-white text-steel hover:bg-[#fafafa]"
        )}
      >
        Купить
      </button>
      <button
        onClick={() => onChange("sell")}
        className={clsx(
          "press-98 focus-ring h-11 rounded-btn text-body-sm font-[485] transition-all duration-180",
          value === "sell"
            ? "bg-negative-tint text-ink"
            : "border border-bone bg-white text-steel hover:bg-[#fafafa]"
        )}
      >
        Продать
      </button>
    </div>
  );
}
