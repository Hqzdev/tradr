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
      {label && <span className="block text-[12.5px] text-steel">{label}</span>}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          "press-98 focus-ring flex h-11 w-full items-center justify-between gap-2 rounded-[12px] border bg-white/[0.03] px-3.5 text-left text-[14.5px] text-ink transition-[border-color,background-color,box-shadow] duration-200",
          label && "mt-2",
          open ? "border-magenta/70 bg-white/[0.045] shadow-[0_0_0_4px_rgba(108,92,255,0.12)]" : "border-white/[0.1] hover:border-white/[0.18]"
        )}
      >
        <span className="truncate">{value}</span>
        <IconChevronDown
          className={clsx(
            "h-4 w-4 shrink-0 text-steel transition-transform duration-300",
            open && "rotate-180 text-magenta-deep"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="animate-scale-in absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 origin-top overflow-auto rounded-[14px] border border-white/[0.1] bg-[#16161b] p-1.5 shadow-elevated"
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
                  "flex w-full items-center justify-between gap-2 rounded-[10px] px-3 py-2.5 text-left text-[14px] transition-colors duration-150",
                  active ? "bg-magenta/15 font-medium text-magenta-deep" : "text-ink hover:bg-white/[0.05]"
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
