"use client";

/**
 * The storefront's motion system. One engine (GSAP + ScrollTrigger) for
 * everything beyond hover/focus, registered once here.
 *
 * Levels — use the lowest that does the job:
 *   0  static            most content
 *   1  hover / focus     CSS transitions only (180ms, --ease-standard)
 *   2  section reveal    <Reveal> — a short fade-up, once
 *   3  major transition  hero intro, industry switch
 *   4  scroll story      hero depth, product stack, RFID system
 *
 * Every animation runs inside `gsap.matchMedia()` under MOTION_OK, so a
 * visitor who prefers reduced motion gets the static layout — no parallax,
 * pinning, stacking or large transforms — and matchMedia reverts cleanly if
 * that preference changes mid-visit. `useGSAP` scopes and reverts everything
 * (including ScrollTriggers) on unmount.
 */

import { useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** GSAP equivalents of --ease-standard / --ease-emphasized in globals.css. */
export const EASE = {
  standard: "power2.out",
  emphasized: "expo.out",
  inOut: "power2.inOut",
} as const;

export const DURATION = {
  /** Level 2 reveals. */
  reveal: 0.7,
  /** Level 3 intros and swaps. */
  intro: 1,
  swap: 0.5,
} as const;

/** Run motion only for visitors who haven't asked for less of it. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
/** Scroll storytelling layouts (pinned/sticky) only from here up. */
export const DESKTOP = "(min-width: 1024px)";

function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(MOTION_OK);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Whether motion is allowed, for render decisions (what to mount, whether
 * something should run on a timer). Animations themselves still go through
 * `gsap.matchMedia()`. False on the server and during hydration, so the
 * static layout is what first renders.
 */
export function useMotionOk() {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(MOTION_OK).matches,
    () => false
  );
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
