"use client";

import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { DURATION, EASE, MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/motion";

/**
 * RFID's three bands and what each is used for — the scale the catalogue
 * spans (LF access readers, HF desktop readers, UHF readers/antennas/tags).
 */
const BANDS = [
  { band: "LF", range: "125 kHz", use: "Access & ID" },
  { band: "HF", range: "13.56 MHz", use: "Cards & NFC" },
  { band: "UHF", range: "860–960 MHz", use: "Supply chain & assets" },
];

/**
 * Home hero. Headline, copy and CTAs are static markup and paint at once; the
 * product visual streams in behind its own Suspense boundary (`visual`).
 *
 * Motion (level 3 + 4, never under reduced motion):
 *   load    headline lines rise from a mask, then a reader beam crosses
 *           "RFID" and draws its brand underline → copy → CTAs → band scale;
 *           the product visual runs its own entrance (and first scan) when
 *           it arrives
 *   scroll  copy drifts up toward the next section, the measurement grid
 *           moves slower than the page for depth
 */
export function Hero({ visual }: { visual: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current;
        if (!section) return;
        const title = section.querySelector<HTMLElement>("[data-hero-title]");
        const steps = gsap.utils.toArray<HTMLElement>("[data-hero-step]", section);
        if (!title) return;

        // Hand over from the CSS pre-paint state to GSAP in the same frame.
        gsap.set([title, ...steps], { autoAlpha: 1 });
        [title, ...steps].forEach((el) => el.removeAttribute("data-intro"));

        SplitText.create(title, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          // Returned, so a re-split on resize picks the timeline up where it was.
          onSplit: (self) => {
            const word = title.querySelector<HTMLElement>("[data-hero-rfid]");
            const tl = gsap.timeline().from(self.lines, {
              yPercent: 105,
              duration: DURATION.intro + 0.1,
              ease: EASE.emphasized,
              stagger: 0.09,
            });
            if (!word) return tl;
            const beam = word.querySelector("[data-rfid-beam]");
            const line = word.querySelector("[data-rfid-line]");
            return tl
              .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.75, ease: "power2.inOut" }, 0.6)
              .fromTo(
                beam,
                { x: 0, autoAlpha: 0 },
                { x: word.offsetWidth, autoAlpha: 1, duration: 0.75, ease: "power2.inOut" },
                0.6
              )
              .to(beam, { autoAlpha: 0, duration: 0.2 }, ">-0.1");
          },
        });

        gsap.from(steps, {
          y: 16,
          autoAlpha: 0,
          duration: DURATION.reveal,
          ease: EASE.emphasized,
          stagger: 0.1,
          delay: 0.35,
        });

        // Scroll depth. Scrubbed to the hero leaving the viewport.
        const leave = { trigger: section, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-copy]", { y: -56, autoAlpha: 0.35, ease: "none", scrollTrigger: leave });
        gsap.to("[data-hero-grid]", { y: 96, ease: "none", scrollTrigger: leave });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
      {/* Measurement grid, fading out toward the fold. */}
      <div
        data-hero-grid
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-x-0 -top-24 -bottom-24 [mask-image:linear-gradient(to_bottom,black_20%,transparent_80%)]"
      />

      <PageContainer className="relative grid grid-cols-1 gap-12 pt-12 pb-14 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pt-20 lg:pb-20">
        <div data-hero-copy className="flex flex-col lg:col-span-6 lg:pr-4">
          <div data-hero-step data-intro>
            <Eyebrow>RFID readers · antennas · tags</Eyebrow>
          </div>

          <h1 id="hero-title" data-hero-title data-intro className="mt-6 text-display text-balance">
            Enterprise{" "}
            <span data-hero-rfid className="relative inline-block">
              RFID
              {/* The read: a beam crosses the word and leaves the brand mark under it. */}
              <span
                data-rfid-line
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[0.055em] origin-left bg-brand"
              />
              <span
                data-rfid-beam
                aria-hidden
                className="invisible absolute -top-[0.02em] bottom-0 left-0 w-[2px] bg-brand shadow-[0_0_12px_color-mix(in_oklab,var(--brand)_55%,transparent)]"
              />
            </span>{" "}
            hardware
          </h1>

          <p data-hero-step data-intro className="mt-6 max-w-lg text-lead text-pretty text-muted-foreground">
            Readers, antennas and tags across LF, HF and UHF — with full spec sheets, live stock and prices
            shown up front.
          </p>

          <div data-hero-step data-intro className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/products" size="lg" endIcon={<ArrowRight />}>
              Browse the catalog
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline">
              Request a quote
            </ButtonLink>
          </div>

          <div data-hero-step data-intro className="mt-14 lg:mt-20">
            <div aria-hidden className="bg-ruler h-2 opacity-60" />
            <dl className="grid grid-cols-3 border-t border-foreground/80">
              {BANDS.map((b) => (
                <div key={b.band} className="border-l border-border pt-3 pl-3 first:border-l-0 first:pl-0">
                  <dt className="text-meta text-foreground uppercase">{b.band}</dt>
                  <dd className="mt-1 font-mono text-tech">{b.range}</dd>
                  <dd className="mt-0.5 text-meta text-muted-foreground">{b.use}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="lg:col-span-6">{visual}</div>
      </PageContainer>
    </section>
  );
}
