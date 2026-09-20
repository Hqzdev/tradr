"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import clsx from "@/lib/clsx";

interface AuthStepFrameProps {
  stepKey: string | number;
  direction: "forward" | "backward";
  children: ReactNode;
}

export default function AuthStepFrame({ stepKey, direction, children }: AuthStepFrameProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const update = () => setHeight(element.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [stepKey]);

  return (
    <div className="tradr-auth-step-viewport" style={height ? { height } : undefined}>
      <div ref={contentRef} key={stepKey} className={clsx("tradr-auth-step", direction === "backward" && "is-backward")}>
        {children}
      </div>
    </div>
  );
}
