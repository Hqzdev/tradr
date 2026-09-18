import clsx from "@/lib/clsx";
import { formatPercent } from "@/lib/fixtures";

export default function PercentTag({
  value,
  size = "md",
}: {
  value: number;
  size?: "sm" | "md" | "lg";
}) {
  const positive = value > 0;
  const negative = value < 0;
  return (
    <span
      className={clsx(
        "font-[485] tabular-nums",
        positive && "text-positive",
        negative && "text-negative",
        !positive && !negative && "text-steel",
        size === "sm" && "text-caption",
        size === "md" && "text-body-sm",
        size === "lg" && "text-subheading"
      )}
    >
      {formatPercent(value)}
    </span>
  );
}
