import clsx from "@/lib/clsx";
import { IconArrowDownRight, IconArrowUpRight } from "@/components/icons";

// Green/red pill with a direction arrow: "↗ +1,84%".
export default function DeltaPill({
  value,
  suffix = "%",
  decimals = 2,
  size = "md",
  className,
  label,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const up = value >= 0;
  const Icon = up ? IconArrowUpRight : IconArrowDownRight;
  return (
    <span
      className={clsx(
        "q-num inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold",
        size === "sm" ? "h-6 px-2 text-[11.5px]" : "h-7 px-2.5 text-[12.5px]",
        up ? "border-positive/25 bg-positive/[0.12] text-positive" : "border-negative/25 bg-negative/[0.12] text-negative",
        className
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.2} />
      {label ?? `${up ? "+" : "−"}${Math.abs(value).toFixed(decimals).replace(".", ",")}${suffix}`}
    </span>
  );
}
