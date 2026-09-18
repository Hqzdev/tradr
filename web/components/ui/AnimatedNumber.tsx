"use client";

import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

export default function AnimatedNumber({
  value,
  format,
  duration = 220,
  className,
}: {
  value: number;
  format: (v: number) => string;
  duration?: number;
  className?: string;
}) {
  const display = useAnimatedNumber(value, duration);
  return <span className={className}>{format(display)}</span>;
}
