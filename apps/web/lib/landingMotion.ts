export interface HeroIntroStep {
  id: "learn" | "market" | "decide";
  text: string;
  delayMs: number;
  mobileBreakAfter?: boolean;
}

export interface OrbMotionConfig {
  floatDurationMs: number;
  rotateDurationMs: number;
}

export interface MetricRollerModel {
  label: string;
  value: string;
  active: boolean;
}

export interface LandingMotionPreset {
  heroIntro: readonly HeroIntroStep[];
  heroBodyDelayMs: number;
  heroTicketDelayMs: number;
  scrollCueDelayMs: number;
  orbMotion: readonly OrbMotionConfig[];
}

export const landingMotionPreset: LandingMotionPreset = {
  heroIntro: [
    { id: "learn", text: "Учись", delayMs: 0 },
    { id: "market", text: "видеть рынок.", delayMs: 100, mobileBreakAfter: true },
    { id: "decide", text: "Решай увереннее.", delayMs: 200 },
  ],
  heroBodyDelayMs: 300,
  heroTicketDelayMs: 400,
  scrollCueDelayMs: 2000,
  orbMotion: [
    { floatDurationMs: 5087, rotateDurationMs: 13333 },
    { floatDurationMs: 4720, rotateDurationMs: 11600 },
    { floatDurationMs: 5360, rotateDurationMs: 14200 },
    { floatDurationMs: 4890, rotateDurationMs: 12800 },
    { floatDurationMs: 5210, rotateDurationMs: 14900 },
    { floatDurationMs: 4650, rotateDurationMs: 12100 },
    { floatDurationMs: 5140, rotateDurationMs: 13700 },
    { floatDurationMs: 4970, rotateDurationMs: 11200 },
    { floatDurationMs: 5430, rotateDurationMs: 14500 },
    { floatDurationMs: 4810, rotateDurationMs: 12600 },
    { floatDurationMs: 5260, rotateDurationMs: 13900 },
    { floatDurationMs: 4590, rotateDurationMs: 11800 },
    { floatDurationMs: 5110, rotateDurationMs: 14700 },
    { floatDurationMs: 4930, rotateDurationMs: 12400 },
    { floatDurationMs: 5380, rotateDurationMs: 14100 },
    { floatDurationMs: 4760, rotateDurationMs: 11500 },
    { floatDurationMs: 5190, rotateDurationMs: 13600 },
    { floatDurationMs: 4860, rotateDurationMs: 12900 },
  ],
};

export function getOrbMotionConfig(id: number): OrbMotionConfig {
  return landingMotionPreset.orbMotion[id - 1] ?? landingMotionPreset.orbMotion[0];
}
