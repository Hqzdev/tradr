"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Like useAnimatedNumber, but the first render counts up from `from`
 * (default 0) so balances "roll in" when a screen opens. Later changes tween
 * from the value currently on screen. Pure rAF, no animation library.
 */
export function useCountUp(target: number, duration = 1100, from = 0) {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [display, setDisplay] = useState(reduce ? target : from);
  const displayRef = useRef(reduce ? target : from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = displayRef.current;
    const to = Number.isFinite(target) ? target : 0;
    if (start === to) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      const value = start + (to - start) * eased;
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}
