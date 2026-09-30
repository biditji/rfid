"use client";

import { useEffect, useState } from "react";

/**
 * True once `active` has stayed true for `delayMs`, and false again the moment
 * it stops.
 *
 * The backend can take a minute to answer the first request after it has been
 * idle, and a spinner alone reads as "broken". Callers show a reassuring line
 * while this is true.
 */
export function useSlowHint(active: boolean, delayMs = 6000): boolean {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setSlow(true), delayMs);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [active, delayMs]);

  return active && slow;
}
