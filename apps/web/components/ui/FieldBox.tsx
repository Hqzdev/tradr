"use client";

import { useState } from "react";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";

export default function FieldBox({
  label,
  unit,
  value,
  onChange,
  large = true,
  animated = false,
  animationDuration = 220,
  animatedDecimals = 2,
  trimAnimatedZeros = false,
  numericOnly = false,
  onCommit,
  readOnly = false,
  decimalInput = false,
}: {
  label: string;
  unit?: string;
  value: string;
  onChange?: (v: string) => void;
  large?: boolean;
  animated?: boolean;
  animationDuration?: number;
  animatedDecimals?: number;
  trimAnimatedZeros?: boolean;
  /** Strips anything but digits, "." and "," as the user types/pastes. */
  numericOnly?: boolean;
  /** Fires on blur, after a finished edit — for recalculations that
   *  shouldn't run on every half-typed keystroke (e.g. "3" on its way to
   *  "300"). */
  onCommit?: () => void;
  readOnly?: boolean;
  decimalInput?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  const numeric = parseFloat(value.replace(",", ".")) || 0;
  const displayNumeric = useAnimatedNumber(numeric, animationDuration);
  const hasDecimals = value.includes(",") || value.includes(".");
  const fixedText = displayNumeric.toFixed(animatedDecimals);
  const tickedText = trimAnimatedZeros
    ? String(parseFloat(fixedText)).replace(".", ",")
    : hasDecimals
      ? fixedText.replace(".", ",")
      : String(Math.round(displayNumeric));

  // While typing, show exactly what was typed (so partial input like a
  // trailing comma keeps working). Once the field isn't focused, the
  // number ticks up/down to its value instead of snapping.
  const shownValue = animated && !focused ? tickedText : value;

  return (
    <div className="focus-within:ring-2 focus-within:ring-magenta-ring focus-within:border-magenta rounded-btn border border-bone px-4 py-2.5 transition-all duration-150">
      <div className="flex items-center justify-between">
        <span className="text-caption text-steel">{label}</span>
        {unit && <span className="text-caption text-steel">{unit}</span>}
      </div>
      <input
        aria-label={label}
        readOnly={readOnly}
        value={shownValue}
        inputMode={numericOnly || decimalInput ? "decimal" : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onCommit?.();
        }}
        onChange={(e) => {
          const raw = e.target.value;
          onChange?.(numericOnly ? raw.replace(/[^0-9.,]/g, "") : raw);
        }}
        className={
          large
            ? "mt-0.5 w-full bg-transparent text-heading-sm font-[485] tabular-nums text-ink outline-none"
            : "mt-0.5 w-full bg-transparent text-body font-[485] tabular-nums text-ink outline-none"
        }
      />
    </div>
  );
}
