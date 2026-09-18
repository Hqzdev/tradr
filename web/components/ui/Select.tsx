"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown } from "@/components/icons";
import clsx from "@/lib/clsx";

interface SelectProps {
  label?: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
  className?: string;
}

// Our own dropdown, styled like the rest of TRADR — replaces the browser's
// native <select> (which pops up with the OS's own system menu and can't be
// themed) so every dropdown on the site looks and behaves the same way.
export default function Select({ label, value, options, onChange, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      {label && <span className="block text-caption text-steel">{label}</span>}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "press-98 focus-ring flex h-10 w-full items-center justify-between gap-2 rounded-btn border bg-white px-3 text-left text-body-sm text-ink transition-colors duration-150",
          label && "mt-1.5",
          open ? "border-magenta" : "border-bone hover:border-fog/60"
        )}
      >
        <span className="truncate">{value}</span>
        <IconChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-steel transition-transform duration-150",
            open && "rotate-180 text-magenta-deep"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-scale-in absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-auto rounded-card border border-bone bg-white p-1.5 shadow-elevated"
        >
          {options.map((option) => {
            const active = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange?.(option);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-2 text-left text-body-sm transition-colors duration-120",
                  active ? "bg-magenta-tint font-[535] text-magenta-deep" : "text-ink hover:bg-bone/70"
                )}
              >
                <span className="truncate">{option}</span>
                {active && <IconCheck className="h-4 w-4 shrink-0 text-magenta-deep" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
