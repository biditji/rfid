"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type RefObject } from "react";
import { gsap, useGSAP, useMotionOk } from "@/lib/motion";

/**
 * Auto-advance for a set of slides (the hero's products, a product's photos).
 * Owns *when* to change slide; each component owns how the change looks.
 *
 * The countdown is a GSAP tween on the `[data-progress]` element inside `root`
 * (scaleX 0 → 1, so the same element doubles as a progress bar) and the slide
 * advances when it completes. Pausing the tween holds the bar and the timer in
 * step, and resuming carries on from the same point.
 *
 * It holds whenever the visitor might be reading: pointer over `root`,
 * keyboard focus inside it, scrolled out of view, or paused with the button.
 * Under reduced motion it never runs — `rotating` is false, so callers should
 * hide the pause button and play no transition, and slides change only when
 * selected by hand.
 */
export function useRotation(root: RefObject<HTMLElement | null>, count: number, seconds: number) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  const rotating = useMotionOk() && count > 1;
  const running = rotating && !paused && !hovered && !focused && onScreen;

  const countdown = useRef<gsap.core.Tween | null>(null);
  const runningRef = useRef(running);

  // A new countdown for every slide. Reverted and rebuilt on each change, so
  // picking a slide mid-count restarts cleanly from the new one.
  useGSAP(
    () => {
      if (!rotating) return;
      countdown.current = gsap.fromTo(
        root.current?.querySelector("[data-progress]") ?? {},
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: seconds,
          ease: "none",
          paused: !runningRef.current,
          onComplete: () => setActive((current) => (current + 1) % count),
        }
      );
    },
    { scope: root, dependencies: [active, rotating, count], revertOnUpdate: true }
  );

  // Hold and release the countdown as the visitor engages.
  useEffect(() => {
    runningRef.current = running;
    countdown.current?.paused(!running);
  }, [running]);

  // Counting down on something nobody can see just burns frames.
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [root]);

  return {
    active,
    setActive,
    paused,
    togglePaused: () => setPaused((current) => !current),
    /** Motion is allowed and there's more than one slide. */
    rotating,
    /** The countdown is actually ticking right now. */
    running,
    /**
     * Spread onto `root`. Only a mouse counts as hovering — a tap would leave a
     * touch screen "hovered" for good — and only keyboard focus (:focus-visible)
     * counts as focus, so a click leaving focus on a button doesn't hold the
     * rotation forever.
     */
    handlers: {
      onPointerEnter: (e: PointerEvent) => {
        if (e.pointerType === "mouse") setHovered(true);
      },
      onPointerLeave: (e: PointerEvent) => {
        if (e.pointerType === "mouse") setHovered(false);
      },
      onFocus: (e: FocusEvent<HTMLElement>) => {
        if (e.target.matches(":focus-visible")) setFocused(true);
      },
      onBlur: (e: FocusEvent<HTMLElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      },
    },
  };
}
