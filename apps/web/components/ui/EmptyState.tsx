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

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  compact,
}: EmptyStateProps) {
  const action = actionLabel ? (
    <span className="inline-flex items-center gap-1 text-body-sm font-[485] text-[#B51686] transition-colors duration-150 group-hover:text-magenta-deep">
      {actionLabel}
      <IconArrowUpRight className="h-3.5 w-3.5" />
    </span>
  ) : null;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-card bg-[#FAFAFB] text-center",
        compact ? "gap-2 px-6 py-8" : "gap-3 px-6 py-14",
        className
      )}
    >
      <span
        className={clsx(
          "flex items-center justify-center rounded-full bg-[#F3EFF5] text-[#B79FBE]",
          compact ? "h-9 w-9" : "h-12 w-12"
        )}
      >
        {icon ?? <IconInbox className={compact ? "h-4.5 w-4.5" : "h-5 w-5"} />}
      </span>
      <div>
        <p className="text-body-sm font-[535] text-[#131313]">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-[320px] text-caption text-[#8B8091]">
            {description}
          </p>
        )}
      </div>
      {action &&
        (actionHref ? (
          <Link href={actionHref} className="group press-98 focus-ring mt-1">
            {action}
          </Link>
        ) : (
          <button type="button" onClick={onAction} className="group press-98 focus-ring mt-1">
            {action}
          </button>
        ))}
    </div>
  );
}
