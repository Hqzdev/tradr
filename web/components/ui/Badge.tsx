import clsx from "@/lib/clsx";
import { IconDot } from "@/components/icons";

type BadgeTone = "active" | "paused" | "error" | "filled" | "pending" | "cancelled";

const toneClasses: Record<BadgeTone, string> = {
  active: "bg-positive-tint text-positive",
  filled: "bg-positive-tint text-positive",
  paused: "bg-bone text-steel",
  cancelled: "bg-bone text-steel",
  error: "bg-negative-tint text-negative",
  pending: "bg-[#fdf3d8] text-[#9a6b06]",
};

export default function Badge({
  tone = "active",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-caption font-[485]",
        toneClasses[tone]
      )}
    >
      <IconDot className="h-1.5 w-1.5" />
      {children}
    </span>
  );
}
