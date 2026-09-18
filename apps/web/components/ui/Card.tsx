import clsx from "@/lib/clsx";
import type { HTMLAttributes } from "react";

export default function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-card border border-bone bg-white shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
