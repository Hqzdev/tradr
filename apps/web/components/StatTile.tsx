import type { ReactNode } from "react";
import clsx from "@/lib/clsx";
import Card from "@/components/ui/Card";

export default function StatTile({
  label,
  value,
  caption,
  tone = "default",
  icon,
  index = 0,
}: {
  label: string;
  value: ReactNode;
  caption?: string;
  tone?: "default" | "positive" | "negative" | "warning";
  icon?: ReactNode;
  index?: number;
}) {
  return (
    <Card className="q-reveal q-card-hover rounded-[20px] p-5" style={{ ["--i" as string]: index }}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] border border-white/[0.07] bg-white/[0.05] text-ink">{icon}</span>
        )}
        <p className="text-[13px] text-steel">{label}</p>
      </div>
      <p
        className={clsx(
          "q-num mt-3 text-[26px] font-semibold tracking-[-0.03em]",
          tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : tone === "warning" ? "text-warning" : "text-ink"
        )}
      >
        {value}
      </p>
      {caption && <p className="mt-1.5 text-[12.5px] text-steel">{caption}</p>}
    </Card>
  );
}
