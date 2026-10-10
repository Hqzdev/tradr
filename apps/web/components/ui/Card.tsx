import clsx from "@/lib/clsx";
import type { HTMLAttributes } from "react";

// Dark gradient surface with a hairline border. `interactive` adds the hover
// border/shadow lift used on clickable cards.
export default function Card({
  className,
  children,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div className={clsx("q-card", interactive && "q-card-hover q-lift cursor-pointer", className)} {...props}>
      {children}
    </div>
  );
}
