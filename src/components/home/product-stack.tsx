"use client";

import { useRef } from "react";
import type { ProductSummary } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/motion";

/** Where each sheet sticks: below the 4rem header, each one 1rem lower than the last. */
const STICK_TOP_REM = 5.5;
const STICK_STEP_REM = 1;

/**
 * Featured hardware as a stack of spec sheets.
 *
 * Desktop, motion allowed: each sheet sticks just below the header and the
 * next one slides up over it; as it does, the sheet underneath scales back and
 * dims, like a sheet going under the pile. It's native `position: sticky` in
 * normal document flow — the section is exactly as long as its content, so
 * there's no scroll-jacking and nothing to get stuck in. GSAP only scrubs the
 * scale/shade of the sheet being covered.
 *
 * Mobile or reduced motion: a plain vertical list.
 */
export function ProductStack({ products }: { products: ProductSummary[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-stack-item]", root.current);
        const rootPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

        items.forEach((item, i) => {
          const next = items[i + 1];
          if (!next) return;
          const nextTop = (STICK_TOP_REM + (i + 1) * STICK_STEP_REM) * rootPx;

          gsap
            .timeline({
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: `top ${nextTop}px`,
                scrub: true,
              },
            })
            .to(item.querySelector("[data-stack-sheet]"), { scale: 0.94, y: -8, ease: "none" }, 0)
            .to(item.querySelector("[data-stack-shade]"), { autoAlpha: 1, ease: "none" }, 0);
        });
      });
    },
    { scope: root }
  );

  return (
    <ol ref={root} className="space-y-6 lg:space-y-10">
      {products.map((product, i) => (
        <li
          key={product._id}
          data-stack-item
          className="lg:motion-safe:sticky"
          style={{ top: `${STICK_TOP_REM + i * STICK_STEP_REM}rem` }}
        >
          <div data-stack-sheet className="relative origin-top">
            <ProductCard
              product={product}
              variant="featured"
              index={i + 1}
              total={products.length}
              className="shadow-card lg:min-h-[33rem]"
            />
            {/* Dims the sheet as the next one covers it. Never intercepts clicks. */}
            <div
              data-stack-shade
              aria-hidden
              className="pointer-events-none invisible absolute inset-0 z-20 rounded-card bg-surface/70 opacity-0"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
