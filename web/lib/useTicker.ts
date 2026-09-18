"use client";

import { useEffect, useRef, useState } from "react";

// Fixed, non-random demo scenario: a short looped sequence of price deltas.
const SCENARIO = [0, 0.02, 0.05, 0.03, -0.02, 0.04, 0.06, 0.02, -0.03, 0.05];

export function useTicker(basePrice: number, intervalMs = 2600) {
  const [step, setStep] = useState(0);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prev = useRef(basePrice);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % SCENARIO.length;
        const price = basePrice + SCENARIO[next];
        setFlash(price >= prev.current ? "up" : "down");
        prev.current = price;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [basePrice, intervalMs]);

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(null), 320);
    return () => clearTimeout(id);
  }, [flash]);

  const price = Number((basePrice + SCENARIO[step]).toFixed(2));
  return { price, flash };
}
