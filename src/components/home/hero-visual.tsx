"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { ProductSummary } from "@/lib/products";
import { ProductMedia } from "@/components/shared/product-image";
import { StockBadge } from "@/components/shared/status-badge";
import { ActionLink } from "@/components/shared/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { DURATION, EASE, MOTION_OK, gsap, useGSAP, useMotionOk } from "@/lib/motion";
import { useRotation } from "@/lib/use-rotation";
import { cn, formatCurrency } from "@/lib/utils";
import { ScanOverlay } from "./scan-overlay";

/** How long each product holds the plate before the next fades in. */
const SLIDE_SECONDS = 2;

/**
 * The hero's products, presented like spec plates: the photo on the
 * measurement grid, its real overall dimensions drawn as a dimension line, and
 * a readout of the spec sheet underneath. Every figure comes from the product
 * record.
 *
 * With more than one product the plate rotates through them, one per
 * category, cross-fading every few seconds. Slides are stacked in a single
 * grid cell, so the plate is as tall as the tallest one and nothing below it
 * moves when they swap.
 *
 * The rotation stops whenever the visitor might be reading it — pointer over
 * it, keyboard focus in it, scrolled out of view, or paused with the button —
 * and doesn't run at all under reduced motion, which shows the first product
 * with the same controls for stepping through by hand.
 *
 * Each product is scanned as it takes the plate (ScanOverlay): the first one
 * with the full sequence, as the page's opening beat; the rest with a shorter
 * pass. Motion only — the static plate is unchanged.
 */
export function HeroVisual({ products }: { products: ProductSummary[] }) {
  const root = useRef<HTMLElement>(null);
  const count = products.length;
  const { active, setActive, paused, togglePaused, rotating, running, handlers } = useRotation(
    root,
    count,
    SLIDE_SECONDS
  );

  // Which slide was last on show, so the swap knows what to fade out.
  const previous = useRef(0);

  const scan = useMotionOk();
  // The opening scan plays once; returning to the first slide later gets the short pass.
  const [swapped, setSwapped] = useState(false);
  if (!swapped && active !== 0) setSwapped(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const section = root.current;
        if (!section) return;
        section.removeAttribute("data-intro");

        // Enters after the headline has started, whenever the data arrives.
        gsap.fromTo(
          section,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: DURATION.intro, ease: EASE.emphasized, delay: 0.45 }
        );

        // Scroll: the product eases slightly closer as the hero leaves.
        gsap.to("[data-hero-media]", {
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: section.closest("section:not([data-hero-visual])"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  // Cross-fade to the new slide. Reverted and re-run on every change, so a
  // quick second click starts clean from the new state.
  useGSAP(
    () => {
      const section = root.current;
      const from = previous.current;
      previous.current = active;
      if (!section || !rotating) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", section);
      const [leaving, entering] = [slides[from], slides[active]];

      if (from !== active && leaving && entering) {
        // Resting visibility comes from classes, which already show the new slide;
        // both ends of each fade are stated so the tween doesn't depend on that.
        gsap
          .timeline()
          .fromTo(leaving, { autoAlpha: 1 }, { autoAlpha: 0, duration: DURATION.swap, ease: EASE.standard }, 0)
          .fromTo(
            leaving.querySelector("[data-slide-photo]"),
            { scale: 1 },
            { scale: 0.97, duration: DURATION.swap + 0.2, ease: EASE.standard },
            0
          )
          .fromTo(entering, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.reveal, ease: EASE.standard }, 0.2)
          .fromTo(
            entering.querySelector("[data-slide-photo]"),
            { scale: 1.06 },
            { scale: 1, duration: DURATION.intro + 0.2, ease: EASE.emphasized },
            0.1
          )
          .fromTo(
            entering.querySelectorAll("[data-slide-rise]"),
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: DURATION.reveal, ease: EASE.emphasized, stagger: 0.07 },
            0.3
          );
      }
    },
    { scope: root, dependencies: [active, rotating, count], revertOnUpdate: true }
  );

  return (
    <section
      ref={root}
      data-hero-visual
      data-intro
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative overflow-hidden rounded-card border border-border bg-background"
      {...handlers}
    >
      {count > 1 && (
        <div className="absolute inset-x-5 top-3 z-10 flex items-center gap-3 sm:inset-x-8">
          <span aria-hidden className="shrink-0 font-mono text-tech text-muted-foreground tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <div className="flex flex-1 gap-1.5">
            {products.map((product, i) => (
              <button
                key={product._id}
                type="button"
                aria-label={`Show ${product.name}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
                className="group relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden bg-foreground/15 transition-colors group-hover:bg-foreground/30">
                  {i === active && <span data-progress className="absolute inset-0 origin-left bg-foreground" />}
                </span>
              </button>
            ))}
          </div>
          {rotating && (
            <button
              type="button"
              aria-label={paused ? "Resume product rotation" : "Pause product rotation"}
              onClick={togglePaused}
              className="-mr-1.5 flex size-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
            </button>
          )}
        </div>
      )}

      <div className="grid" aria-live={running ? "off" : "polite"}>
        {products.map((product, i) => (
          <Slide
            key={product._id}
            product={product}
            index={i}
            count={count}
            isActive={i === active}
            scan={scan ? { first: !swapped } : null}
          />
        ))}
      </div>
    </section>
  );
}

function Slide({
  product,
  index,
  count,
  isActive,
  scan,
}: {
  product: ProductSummary;
  index: number;
  count: number;
  isActive: boolean;
  /** Run the scan overlay while this slide is on show. */
  scan: { first: boolean } | null;
}) {
  const specs = product.keySpecs.slice(0, 4);

  return (
    <figure
      data-slide
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${count}`}
      // Inactive slides stay laid out (they set the plate's height) but can't be seen, read or tabbed to.
      inert={!isActive}
      className={cn("col-start-1 row-start-1 flex flex-col", isActive ? "visible opacity-100" : "invisible opacity-0")}
    >
      <div className="relative overflow-hidden">
        <div data-hero-media>
          <div data-slide-photo>
            <ProductMedia
              src={product.image}
              alt={product.name}
              placeholder={product.name}
              sizes="(max-width: 1024px) 100vw, 640px"
              priority={index === 0}
              grid
              className="aspect-[4/3] lg:aspect-[16/11]"
              imageClassName="p-[10%] pb-[13%]"
            />
          </div>
        </div>

        {scan && isActive && <ScanOverlay product={product} first={scan.first} />}

        {product.dimensions && (
          <p className="absolute inset-x-5 bottom-4 flex items-center gap-3 text-muted-foreground sm:inset-x-8">
            <span aria-hidden className="h-3 w-px shrink-0 bg-current" />
            <span aria-hidden className="h-px flex-1 bg-current opacity-50" />
            <span className="shrink-0 font-mono text-tech">
              <span className="sr-only">Dimensions: </span>
              {product.dimensions}
            </span>
            <span aria-hidden className="h-px flex-1 bg-current opacity-50" />
            <span aria-hidden className="h-3 w-px shrink-0 bg-current" />
          </p>
        )}
      </div>

      <figcaption className="relative flex-1 border-t border-border bg-background p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div data-slide-rise className="min-w-0">
            <p className="flex items-center gap-2 text-meta text-muted-foreground uppercase">
              {product.categoryName}
              {product.sku && (
                <>
                  <span aria-hidden className="h-3 w-px bg-border-strong" />
                  <span className="font-mono tracking-normal">{product.sku}</span>
                </>
              )}
            </p>
            <p className="mt-1.5 text-h3">{product.name}</p>
          </div>
          <div data-slide-rise className="flex items-center gap-3">
            <StockBadge stock={product.stock} />
            <p className="text-h3 tabular-nums">{formatCurrency(product.price)}</p>
          </div>
        </div>

        {specs.length > 0 && (
          <dl data-slide-rise className="mt-5 border-t border-border">
            {specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-border py-2.5">
                <dt className="text-meta text-muted-foreground uppercase">{spec.label}</dt>
                <dd className="text-right font-mono text-tech text-pretty">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div data-slide-rise className="mt-5">
          <ActionLink href={`/products/${product.slug}`}>View {product.name}</ActionLink>
        </div>
      </figcaption>
    </figure>
  );
}

/** Same footprint as the loaded visual, so the hero doesn't jump when it streams in. */
export function HeroVisualSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-border">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 border-t border-border p-5 sm:p-6">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-6 w-56" />
        <div className="grid grid-cols-1 gap-x-6 pt-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="my-2.5 h-4" />
          ))}
        </div>
      </div>
    </div>
  );
}
