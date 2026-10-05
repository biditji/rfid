"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { EASE, MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/motion";

/** How long the confirmation shows before moving on, with and without motion. */
const HOLD_SECONDS = 2.4;
const STATIC_HOLD_MS = 1600;

/**
 * The end of checkout: once the payment is verified, the screen goes to the
 * inverse surface, "Order verified" rises letter by letter around a check
 * mark, and one RF pulse goes out — the same read signal the storefront
 * opens with. Then `onDone` moves on (to the orders page).
 *
 * Under reduced motion it's the same screen, held still for a moment. A
 * timer backs up the timeline, so the visitor is never left on this screen.
 */
export function OrderVerified({ paymentId, onDone }: { paymentId?: string; onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  const finished = useRef(false);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  // The timeline and the backup timer both end here; only the first counts.
  const finish = useRef(() => {
    if (finished.current) return;
    finished.current = true;
    onDoneRef.current();
  });

  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK).matches;
    const timer = setTimeout(() => finish.current(), motion ? (HOLD_SECONDS + 1) * 1000 : STATIC_HOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const title = q("[data-verified-title]")[0];
        const split = title ? SplitText.create(title, { type: "chars", mask: "chars" }) : null;

        gsap
          .timeline({ onComplete: () => finish.current(), defaults: { ease: EASE.emphasized } })
          .fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: EASE.standard })
          .fromTo(q("[data-mark]"), { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(2.2)" }, 0.15)
          .fromTo(q("[data-check]"), { scale: 0, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" }, 0.35)
          .fromTo(q("[data-pulse]"), { scale: 0.8, autoAlpha: 0.7 }, { scale: 3.2, autoAlpha: 0, duration: 1.6, ease: "expo.out", stagger: 0.18 }, 0.4)
          .from(split?.chars ?? [], { yPercent: 110, duration: 0.7, stagger: 0.025 }, 0.45)
          .fromTo(q("[data-verified-rise]"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 0.9)
          // The whole screen lasts HOLD_SECONDS from the start, however the pulse tails off.
          .to({}, { duration: HOLD_SECONDS }, 0);
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      role="status"
      aria-live="assertive"
      className="surface-inverse fixed inset-0 z-[70] grid place-items-center overflow-hidden px-6"
    >
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_70%)]" />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative grid size-20 place-items-center">
          {[0, 1, 2].map((i) => (
            <span key={i} data-pulse aria-hidden className="invisible absolute inset-0 rounded-full border border-brand/70" />
          ))}
          <span data-mark className="absolute inset-0 rounded-full border border-border-strong bg-surface" />
          <Check data-check aria-hidden className="relative size-9 text-success" strokeWidth={2} />
        </div>
        <p data-verified-title className="mt-10 text-h1 uppercase">
          Order verified
        </p>
        <p data-verified-rise className="mt-4 text-body text-muted-foreground">
          Payment received. Taking you to your orders…
        </p>
        {paymentId && (
          <p data-verified-rise className="mt-6 font-mono text-tech text-muted-foreground">
            <span className="text-meta tracking-[0.07em] uppercase">Payment</span> {paymentId}
          </p>
        )}
      </div>
    </div>
  );
}
