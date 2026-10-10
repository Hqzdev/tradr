"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "@/lib/clsx";

// Hand-drawn, animated sidebar glyphs. Exception to the "Hugeicons only" rule
// (see CLAUDE.md): these are not an icon package but bespoke SVGs whose
// individual parts move — bars grow, the needle sweeps, the robot blinks —
// instead of the whole icon being scaled or rotated from the outside.
//
// Playback: one full run when the parent link/button is pressed (pointer
// down for instant feedback, click for keyboard Enter/Space). No hover
// trigger by design. Pressing again mid-run is ignored.

export type NavIconName = "dashboard" | "market" | "agents" | "pro" | "history" | "settings";

const RUN_MS: Record<NavIconName, number> = {
  dashboard: 900,
  market: 1000,
  agents: 1150,
  pro: 950,
  history: 1000,
  settings: 900,
};

type Props = { name: NavIconName; active?: boolean; open?: boolean; className?: string };

export default function NavIcon({ name, active = false, open = false, className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const busy = useRef(false);
  const timer = useRef<number>();
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    setPlaying(true);
    timer.current = window.setTimeout(() => {
      busy.current = false;
      setPlaying(false);
    }, RUN_MS[name]);
  }, [name]);

  useEffect(() => {
    const host = ref.current?.closest("a,button");
    if (!host) return;
    host.addEventListener("pointerdown", play);
    host.addEventListener("click", play);
    return () => {
      host.removeEventListener("pointerdown", play);
      host.removeEventListener("click", play);
    };
  }, [play]);

  // Reset on unmount (also covers React StrictMode's mount→unmount→mount in
  // dev, which would otherwise leave the icon stuck in its "playing" state).
  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      busy.current = false;
    },
    []
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      data-icon={name}
      data-active={active || undefined}
      data-open={open || undefined}
      className={clsx("sb-ico", playing && "is-playing", className)}
    >
      {GLYPHS[name]}
    </svg>
  );
}

const GLYPHS: Record<NavIconName, JSX.Element> = {
  // Gauge: the arc draws itself, the needle sweeps across and settles.
  dashboard: (
    <>
      <path className="sb-gauge-arc" pathLength={1} d="M6.34 18.66A8 8 0 1 1 17.66 18.66" />
      <path className="sb-gauge-tick" d="M12 6.4v1.1" strokeWidth={1.6} />
      <path className="sb-gauge-needle" d="M12 13.2 12 8.6" />
      <circle className="sb-accent sb-gauge-hub" cx="12" cy="13.2" r="1.7" fill="currentColor" stroke="none" />
    </>
  ),

  // Market: three bars grow from the baseline, then the trend arrow draws up.
  market: (
    <>
      <path className="sb-bar sb-bar-1" pathLength={1} d="M5.5 20.2v-4.4" strokeWidth={2.3} />
      <path className="sb-bar sb-bar-2" pathLength={1} d="M11 20.2v-7" strokeWidth={2.3} />
      <path className="sb-bar sb-bar-3" pathLength={1} d="M16.5 20.2v-9.6" strokeWidth={2.3} />
      <path className="sb-accent sb-trend" pathLength={1} d="M3.6 11.2 8.4 6.9l3.2 2.4 7.9-6" />
      <path className="sb-accent sb-trend-head" d="M15.7 3.3h3.8v3.8" />
    </>
  ),

  // Agent: eyes glance left-right and blink, the antenna light pings.
  agents: (
    <>
      <rect x="4.6" y="8.2" width="14.8" height="11.6" rx="4.2" />
      <path d="M2.6 12.8v2.4M21.4 12.8v2.4" />
      <path className="sb-antenna" d="M12 8.2V5.4" />
      <circle className="sb-accent sb-antenna-ball" cx="12" cy="3.9" r="1.35" fill="currentColor" stroke="none" />
      <g className="sb-eyes">
        <path className="sb-accent sb-eye" d="M9.2 13v1.8" strokeWidth={2.4} />
        <path className="sb-accent sb-eye" d="M14.8 13v1.8" strokeWidth={2.4} />
      </g>
    </>
  ),

  // Pro: the big spark turns a quarter and pulses, small sparks twinkle in.
  pro: (
    <>
      <path className="sb-spark-big" d="M10 5.6Q11 12 17.4 13 11 14 10 20.4 9 14 2.6 13 9 12 10 5.6Z" />
      <path className="sb-accent sb-spark-small" d="M18.4 2.6Q18.8 5.1 21.3 5.5 18.8 5.9 18.4 8.4 18 5.9 15.5 5.5 18 5.1 18.4 2.6Z" strokeWidth={1.5} />
      <circle className="sb-accent sb-spark-dot" cx="19.6" cy="17.6" r="1.05" fill="currentColor" stroke="none" />
    </>
  ),

  // History: the dial rewinds, hands spin back and land on the time.
  history: (
    <>
      <g className="sb-rewind">
        <path d="M4 12a8 8 0 1 0 8-8 8.6 8.6 0 0 0-6 2.5L4 8.5" />
        <path d="M4 4.5v4h4" />
      </g>
      <path className="sb-accent sb-hand-min" d="M12 12V7.8" />
      <path className="sb-accent sb-hand-hour" d="M12 12l2.9 1.8" />
    </>
  ),

  // Settings: eight teeth with filleted corners (generated, r≈0.8); the gear
  // winds back a quarter turn and settles while the hub breathes.
  settings: (
    <>
      <path className="sb-gear" d="M10.30 4.45L10.43 3.61Q10.55 2.81 11.35 2.81L12.65 2.81Q13.45 2.81 13.57 3.61L13.70 4.45Q13.81 5.24 14.55 5.54L14.76 5.63Q15.50 5.94 16.14 5.46L16.82 4.95Q17.47 4.48 18.03 5.04L18.96 5.97Q19.52 6.53 19.05 7.18L18.54 7.86Q18.06 8.50 18.37 9.24L18.46 9.45Q18.76 10.19 19.550 10.30L20.39 10.43Q21.19 10.55 21.19 11.35L21.19 12.65Q21.19 13.45 20.39 13.57L19.55 13.70Q18.76 13.81 18.46 14.55L18.37 14.76Q18.06 15.50 18.54 16.14L19.05 16.82Q19.52 17.47 18.96 18.03L18.03 18.96Q17.47 19.52 16.82 19.05L16.14 18.54Q15.50 18.06 14.76 18.37L14.55 18.46Q13.81 18.76 13.70 19.55L13.57 20.39Q13.45 21.19 12.65 21.19L11.35 21.19Q10.55 21.19 10.43 20.39L10.30 19.55Q10.19 18.76 9.45 18.46L9.24 18.37Q8.50 18.06 7.86 18.54L7.18 19.05Q6.53 19.52 5.97 18.96L5.04 18.03Q4.48 17.47 4.95 16.82L5.46 16.14Q5.94 15.50 5.63 14.76L5.54 14.55Q5.24 13.81 4.45 13.70L3.61 13.57Q2.81 13.45 2.81 12.65L2.81 11.35Q2.81 10.55 3.61 10.43L4.45 10.30Q5.24 10.19 5.54 9.45L5.63 9.24Q5.94 8.50 5.46 7.86L4.95 7.18Q4.48 6.53 5.04 5.97L5.97 5.04Q6.53 4.48 7.18 4.95L7.86 5.46Q8.50 5.94 9.24 5.630L9.45 5.54Q10.19 5.24 10.30 4.45Z" />
      <circle className="sb-accent sb-gear-hub" cx="12" cy="12" r="2.7" />
    </>
  ),
};
