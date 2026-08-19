"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

const offset: Record<NonNullable<FadeInProps["direction"]>, string> = {
  up: "translateY(24px)",
  down: "translateY(-24px)",
  left: "translateX(24px)",
  right: "translateX(-24px)",
  none: "none",
};

/**
 * Scroll-triggered fade, using IntersectionObserver and a CSS transition.
 *
 * This was a framer-motion `whileInView` component. It's rendered dozens of
 * times per page and was the only reason framer-motion (2 MB of dist, ~120 KB
 * in the bundle) was pulled into every public route — for an opacity-and-
 * translate transition the platform does natively.
 */
export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Users who asked for reduced motion get the content with no transition.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      // Mirrors the old viewport={{ once: true, margin: "-60px" }}.
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : offset[direction],
        transition: `opacity 500ms cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s, transform 500ms cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
