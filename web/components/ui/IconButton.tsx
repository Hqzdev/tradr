import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "@/lib/clsx";

export default function IconButton({
  children,
  className,
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      className={clsx(
        "press-98 focus-ring inline-flex items-center justify-center rounded-btn border border-transparent text-steel transition-colors duration-150 hover:bg-bone/70 hover:text-ink",
        size === "sm" ? "h-7 w-7" : "h-9 w-9",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
