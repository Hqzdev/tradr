import type { ReactNode } from "react";
import clsx from "@/lib/clsx";

type Side = "top" | "bottom";

// CSS-only hover tooltip — no JS/animation library. `group` + opacity
// transition on hover, per uF1QQ (dark bg #2B2231, white text).
export default function Tooltip({
  label,
  children,
  side = "top",
  className,
}: {
  label: ReactNode;
  children: ReactNode;
  side?: Side;
  className?: string;
}) {
  return (
    <span className={clsx("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute left-1/2 z-40 w-max max-w-[220px] -translate-x-1/2 whitespace-normal rounded-[10px] px-2.5 py-1.5 text-center text-caption font-[485] text-white opacity-0 shadow-elevated transition-opacity duration-150 group-hover:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2"
        )}
        style={{ backgroundColor: "#2B2231" }}
      >
        {label}
        <span
          className={clsx(
            "absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45",
            side === "top" ? "-bottom-1" : "-top-1"
          )}
          style={{ backgroundColor: "#2B2231" }}
        />
      </span>
    </span>
  );
}
