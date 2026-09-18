"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tweens a displayed number toward `target` whenever it changes, so the UI
 * reads as a fast "odometer" count (192 -> 193 -> 194 ...) instead of a
 * hard snap. Re-triggering mid-animation starts a fresh tween from the
 * value currently on screen, so rapid updates stay smooth.
 */
export function useAnimatedNumber(target: number, duration = 220) {
  const [display, setDisplay] = useState(target);
  const displayRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = displayRef.current;
    const to = Number.isFinite(target) ? target : 0;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = from + (to - from) * eased;
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}
