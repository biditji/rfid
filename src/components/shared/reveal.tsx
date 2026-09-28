"use client";

import { useRef, type ReactNode, type RefObject } from "react";
import { DURATION, EASE, MOTION_OK, gsap, useGSAP } from "@/lib/motion";

/**
 * Motion level 2: a short fade-up, once, as the block scrolls into view.
 *
 * Children marked `data-reveal` animate in sequence; with none marked, the
 * block animates as one. Use it on a few sections only — most content should
 * simply be there.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        const marked = root.querySelectorAll<HTMLElement>("[data-reveal]");
        const targets = marked.length ? Array.from(marked) : [root];

        gsap.from(targets, {
          y: 18,
          autoAlpha: 0,
          duration: DURATION.reveal,
          ease: EASE.standard,
          stagger: 0.06,
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    // The union of intrinsic tags shares HTMLElement's ref shape at runtime.
    <Tag ref={ref as RefObject<never>} className={className}>
      {children}
    </Tag>
  );
}
