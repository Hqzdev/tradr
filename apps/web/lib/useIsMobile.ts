"use client";

import { useEffect, useState } from "react";

// Matches the `lg` breakpoint: below 1024px the app switches to the mobile
// interface (tab bar, card layouts). The signed-in app renders client-side
// only (ProtectedApp), so reading matchMedia on first render is safe.
const QUERY = "(max-width: 1023.98px)";

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(QUERY);
    const sync = () => setMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return mobile;
}
