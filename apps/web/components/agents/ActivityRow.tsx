import clsx from "@/lib/clsx";
import { IconAgents } from "@/components/icons";

// One row of the agents' decision feed (buy / sell / wait + reason).
export default function ActivityRow({ name, action, reason, time, index = 0 }: { name: string; action: "buy" | "sell" | "wait"; reason: string; time: string; index?: number }) {
  const tone = action === "buy" ? "text-positive bg-positive/[0.12]" : action === "sell" ? "text-negative bg-negative/[0.12]" : "text-steel bg-white/[0.06]";
  const label = action === "buy" ? "Купить" : action === "sell" ? "Продать" : "Ждать";
  return (
    <div className="q-reveal flex gap-3.5 py-3.5" style={{ ["--i" as string]: index + 2 }}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px] bg-magenta/[0.14] text-magenta-deep"><IconAgents className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-[14px] font-medium text-ink">{name}</p>
          <time className="shrink-0 text-[12px] text-steel">{time}</time>
        </div>
        <div className="mt-1.5 flex min-w-0 items-center gap-2">
          <span className={clsx("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", tone)}>{label}</span>
          <p className="truncate text-[13px] text-charcoal">{reason}</p>
        </div>
      </div>
    </div>
  );
}

