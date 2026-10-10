import clsx from "@/lib/clsx";

type BadgeTone = "active" | "paused" | "error" | "filled" | "pending" | "cancelled";

const toneClasses: Record<BadgeTone, string> = {
  active: "bg-positive/[0.12] text-positive",
  filled: "bg-positive/[0.12] text-positive",
  paused: "bg-white/[0.06] text-steel",
  cancelled: "bg-white/[0.06] text-steel",
  error: "bg-negative/[0.12] text-negative",
  pending: "bg-warning/[0.12] text-warning",
};

export default function Badge({ tone = "active", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  const live = tone === "active";
  return (
    <span className={clsx("inline-flex h-7 items-center gap-2 rounded-full px-3 text-[12.5px] font-medium", toneClasses[tone])}>
      {live ? <span className="q-live h-[6px] w-[6px]" /> : <span className="h-[6px] w-[6px] rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}
