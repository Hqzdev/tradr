"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const DIGITS = "0123456789";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function IntroReveal({ children, delayMs }: { children: ReactNode; delayMs: number }) {
  return (
    <span className="tradr-intro-reveal" style={{ "--intro-delay": `${delayMs}ms` } as CSSProperties}>
      {children}
    </span>
  );
}

export function MotionPresence({
  children,
  className = "",
  once = false,
}: {
  children: (visible: boolean, inViewport: boolean) => ReactNode;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inViewport, setInViewport] = useState(reducedMotion);
  const [hasEntered, setHasEntered] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setInViewport(true);
      setHasEntered(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
        if (entry.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.12, rootMargin: "8% 0px 8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, reducedMotion]);

  const visible = reducedMotion || (once ? hasEntered : inViewport);

  return (
    <div
      ref={ref}
      className={`tradr-motion-presence ${visible ? "tradr-motion-presence--visible" : ""} ${inViewport ? "tradr-motion-presence--in-viewport" : ""} ${className}`}
    >
      {children(visible, inViewport)}
    </div>
  );
}

export function AnimatedMetric({ value, visible }: { value: string; visible: boolean }) {
  return (
    <strong className={`tradr-metric-value ${visible ? "tradr-metric-value--visible" : ""}`} aria-label={value}>
      <span aria-hidden="true">
        {Array.from(value).map((character, index) => {
          if (!/\d/.test(character)) {
            return <span className="tradr-metric-static" key={`${character}-${index}`}>{character}</span>;
          }

          return (
            <span className="tradr-metric-digit" key={`${character}-${index}`}>
              <span
                className="tradr-metric-strip"
                style={{ "--digit-target": Number(character), "--digit-delay": `${index * 35}ms` } as CSSProperties}
              >
                {Array.from(DIGITS).map((digit) => <span key={digit}>{digit}</span>)}
              </span>
            </span>
          );
        })}
      </span>
    </strong>
  );
}
