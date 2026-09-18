"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "@/lib/clsx";

// One persistent underline that measures the active tab and slides to it,
// instead of each tab drawing its own scale-x-0/100 underline (which just
// pops in/out in place rather than gliding across) — same convention as
// the segmented-pill nav, see CLAUDE.md ("Segmented controls").
export default function Tabs({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = options.findIndex((opt) => opt === value);
  const [lineStyle, setLineStyle] = useState<{ left: number; width: number } | null>(null);
  const [animated, setAnimated] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = activeIndex >= 0 ? tabRefs.current[activeIndex] : null;
      setLineStyle(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeIndex]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative flex items-center gap-6 border-b border-bone">
      {options.map((opt, index) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            onClick={() => onChange(opt)}
            className={clsx(
              "press-98 focus-ring -mb-px pb-3 text-body-sm font-[485] transition-colors duration-150",
              active ? "text-ink" : "text-steel hover:text-ink"
            )}
          >
            {opt}
          </button>
        );
      })}
      <span
        aria-hidden
        className={clsx(
          "absolute -bottom-px left-0 h-[2px] rounded-full bg-magenta",
          animated && "transition-all duration-200 ease-out"
        )}
        style={{
          width: lineStyle ? `${lineStyle.width}px` : 0,
          transform: `translateX(${lineStyle ? lineStyle.left : 0}px)`,
          opacity: lineStyle ? 1 : 0,
        }}
      />
    </div>
  );
}
