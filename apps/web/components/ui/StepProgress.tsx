"use client";

import clsx from "@/lib/clsx";
import { IconCheck } from "@/components/icons";

export default function StepProgress({
  steps,
  current,
  furthest,
  onSelect,
}: {
  steps: string[];
  current: number;
  furthest?: number;
  onSelect?: (i: number) => void;
}) {
  const max = furthest ?? current;
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const reachable = i <= max;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              onClick={() => reachable && onSelect?.(i)}
              disabled={!reachable}
              className={clsx(
                "press-98 focus-ring flex items-center gap-2.5 disabled:cursor-not-allowed",
                reachable && onSelect && "cursor-pointer"
              )}
            >
              <span
                className={clsx(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-[535] transition-colors duration-200",
                  done && "bg-magenta text-white",
                  active && "bg-magenta-tint text-magenta-deep ring-2 ring-magenta/25",
                  !done && !active && "bg-bone text-steel"
                )}
              >
                {done ? <IconCheck className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={clsx(
                  "whitespace-nowrap text-body-sm font-[485] transition-colors duration-200",
                  active || done ? "text-ink" : "text-steel"
                )}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <span
                className={clsx(
                  "mx-3 h-px flex-1 transition-colors duration-300",
                  done ? "bg-magenta" : "bg-bone"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
