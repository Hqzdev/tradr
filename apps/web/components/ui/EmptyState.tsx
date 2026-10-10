import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "@/lib/clsx";
import { IconArrowUpRight, IconInbox } from "@/components/icons";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export default function EmptyState({ icon, title, description, actionLabel, actionHref, onAction, className, compact }: EmptyStateProps) {
  const action = actionLabel ? (
    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-magenta-deep transition-[gap,color] duration-200 group-hover:gap-2.5 group-hover:text-ink">
      {actionLabel}
      <IconArrowUpRight className="h-3.5 w-3.5" />
    </span>
  ) : null;

  return (
    <div
      className={clsx(
        "q-pop flex flex-col items-center justify-center rounded-[18px] border border-dashed border-white/[0.09] bg-white/[0.015] text-center",
        compact ? "gap-2.5 px-6 py-8" : "gap-3 px-6 py-14",
        className
      )}
    >
      <span className={clsx("grid place-items-center rounded-[14px] border border-white/[0.08] bg-white/[0.04] text-steel", compact ? "h-10 w-10" : "h-12 w-12")}>
        {icon ?? <IconInbox className={compact ? "h-[18px] w-[18px]" : "h-5 w-5"} />}
      </span>
      <div>
        <p className="text-[14.5px] font-medium text-ink">{title}</p>
        {description && <p className="mx-auto mt-1 max-w-[340px] text-[12.5px] leading-relaxed text-steel">{description}</p>}
      </div>
      {action &&
        (actionHref ? (
          <Link href={actionHref} className="group press-98 focus-ring mt-1 rounded-md">
            {action}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="group press-98 focus-ring mt-1 rounded-md">
            {action}
          </button>
        ))}
    </div>
  );
}
