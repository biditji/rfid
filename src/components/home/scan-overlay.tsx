"use client";

import { useRef } from "react";
import { Check } from "lucide-react";
import type { ProductSummary } from "@/lib/products";
import { EASE, MOTION_OK, gsap, useGSAP } from "@/lib/motion";
import { tagId } from "@/lib/tag-id";
import { cn } from "@/lib/utils";

/**
 * A reader's view of the product on the hero plate: a beam crosses it, corner
 * brackets lock on, the RF field pulses out from the tag, and the readout goes
 * from "Tag detected" to "Verified" with the product's real catalog ID.
 *
 * Mounted once per slide (keyed by product), so each product is scanned as it
 * arrives. The first one runs the full sequence as the page's opening beat;
 * later ones a shorter pass that fits inside the cross-fade. The resting state
 * — brackets and the verified readout — is what's left on screen while the
 * rotation is held.
 *
 * Decorative and motion-only: callers mount it only when motion is allowed,
 * and the same facts are in the slide's caption as text.
 */
const CORNERS = [
  "top-0 left-0 border-t border-l",
  "top-0 right-0 border-t border-r",
  "bottom-0 left-0 border-b border-l",
  "bottom-0 right-0 border-b border-r",
] as const;

export function ScanOverlay({ product, first }: { product: ProductSummary; first: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        // First load waits for the hero visual's own entrance (hero-visual: 0.45s delay).
        const at = first ? 0.75 : 0.2;
        const pace = first ? 1 : 0.75;

        gsap
          .timeline({ delay: at })
          .fromTo(q("[data-lock]"), { scale: 1.16 }, { scale: 1, duration: 0.6 * pace, ease: EASE.emphasized }, 0)
          .fromTo(
            q("[data-bracket]"),
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.3 * pace, ease: EASE.standard, stagger: 0.04 },
            0
          )
          .fromTo(q("[data-beam]"), { yPercent: -100 }, { yPercent: 0, duration: 0.85 * pace, ease: "power2.inOut" }, 0.05)
          .fromTo(q("[data-beam]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.05)
          .to(q("[data-beam]"), { autoAlpha: 0, duration: 0.15 }, 0.05 + 0.85 * pace - 0.12)
          .fromTo(q("[data-scan-readout]"), { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.emphasized }, 0.15)
          .fromTo(
            q("[data-ring]"),
            { scale: 0.35, autoAlpha: 0.8 },
            { scale: 1.7, autoAlpha: 0, duration: 1.1 * pace, ease: "expo.out", stagger: 0.16 },
            0.45 * pace
          )
          .to(q("[data-detected]"), { autoAlpha: 0, y: -8, duration: 0.2, ease: "power2.in" }, 0.75 * pace)
          .fromTo(
            q("[data-verified]"),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE.emphasized },
            0.85 * pace
          )
          .to(q("[data-bracket]"), { autoAlpha: 0.45, duration: 0.5, ease: EASE.standard }, 1.05 * pace);
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      <div data-beam className="scan-beam invisible absolute inset-0" />

      {/* Lock-on brackets around the product: the frame closes in as they appear. */}
      <div data-lock className="absolute inset-x-[16%] top-[14%] bottom-[20%]">
        {CORNERS.map((corner) => (
          <span key={corner} data-bracket className={cn("invisible absolute size-5 border-foreground/60", corner)} />
        ))}
      </div>
      {/* The RF field, from the tag at the product's centre. */}
      <div className="absolute top-[47%] left-1/2 aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1].map((i) => (
          <span key={i} data-ring className="invisible absolute inset-0 rounded-full border border-brand/70" />
        ))}
      </div>

      <div
        data-scan-readout
        className="invisible absolute top-11 right-5 grid rounded-control border border-border bg-background/85 px-2.5 py-1.5 font-mono text-tech shadow-card backdrop-blur-sm sm:right-8"
      >
        <span data-detected className="col-start-1 row-start-1 flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-rf-ping rounded-full bg-brand" />
            <span className="relative size-1.5 rounded-full bg-brand" />
          </span>
          <span className="text-meta tracking-[0.07em] uppercase">Tag detected</span>
        </span>
        <span data-verified className="invisible col-start-1 row-start-1 flex items-center gap-2">
          <Check className="size-3.5 text-success" strokeWidth={2.25} />
          <span className="text-meta tracking-[0.07em] uppercase">Verified</span>
          <span className="text-muted-foreground">{product.sku ?? tagId(product._id, 2)}</span>
        </span>
      </div>
    </div>
  );
}
