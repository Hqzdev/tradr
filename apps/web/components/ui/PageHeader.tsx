import type { ReactNode } from "react";

// Quantix-style page title: small live eyebrow, big two-tone heading.
// `dim` renders the tail of the title in the muted tone.
export default function PageHeader({
  eyebrow,
  title,
  dim,
  joinDim,
  lead,
  action,
  chip,
}: {
  eyebrow: string;
  title: string;
  dim?: string;
  /** Render `dim` right after the title without a space (e.g. "Pro-" + "агенты"). */
  joinDim?: boolean;
  lead?: string;
  action?: ReactNode;
  chip?: ReactNode;
}) {
  return (
    <div className="q-reveal flex flex-wrap items-end justify-between gap-5" style={{ ["--i" as string]: 0 }}>
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 text-[14px] text-steel">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-white/[0.12] bg-white/[0.05]">
            <span className="h-[7px] w-[7px] rounded-full bg-ink" />
          </span>
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">
          {title}
          {dim && <span className="text-fog">{joinDim ? "" : " "}{dim}</span>}
        </h1>
        {lead && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-steel">{lead}</p>}
      </div>
      {(chip || action) && (
        <div className="flex items-center gap-3">
          {chip}
          {action}
        </div>
      )}
    </div>
  );
}
