import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  lead,
  action,
  chip,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  action?: ReactNode;
  chip?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-caption font-[485] uppercase tracking-[0.02em] text-magenta-deep">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-heading font-[485] text-ink">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-body text-steel">{lead}</p>
      </div>
      <div className="flex items-center gap-3">
        {chip}
        {action}
      </div>
    </div>
  );
}
