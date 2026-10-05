"use client";

import { useRef } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { ProductSummary } from "@/lib/products";
import { ProductMedia } from "@/components/shared/product-image";
import { ActionLink, SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { DESKTOP, EASE, MOTION_OK, gsap, useGSAP } from "@/lib/motion";
import { STOCK_META, stockState } from "@/lib/status";
import { tagId } from "@/lib/tag-id";
import { useAddToCart } from "@/lib/use-add-to-cart";
import { cn, formatCurrency } from "@/lib/utils";

const PHASES = ["Scan", "Detect", "Verify", "Order"] as const;

/**
 * Where each floating readout sits around the product on desktop, and the
 * point (in % of the stage) its connection line runs to. Key specs take the
 * corners; category and availability take the middle.
 */
const SLOTS = {
  tl: { className: "lg:right-[70%] lg:bottom-[70%]", anchor: [30, 30] },
  tr: { className: "lg:left-[70%] lg:bottom-[70%]", anchor: [70, 30] },
  ml: { className: "lg:right-[73%] lg:top-[46%] lg:-translate-y-1/2", anchor: [27, 46] },
  mr: { className: "lg:left-[73%] lg:top-[46%] lg:-translate-y-1/2", anchor: [73, 46] },
  bl: { className: "lg:right-[70%] lg:top-[62%]", anchor: [30, 62] },
  br: { className: "lg:left-[70%] lg:top-[62%]", anchor: [70, 62] },
} as const;
const SPEC_SLOTS = ["tl", "tr", "bl", "br"] as const;
/** The product's centre on the stage, in %. */
const CENTRE = [50, 46] as const;
/** Depth of each readout as the camera moves, so nearer ones travel further. */
const DEPTH = [90, 40, 120, 60, 30, 100];

/**
 * Data particles: fixed positions on a golden-angle spiral. Rounded, because
 * Math.cos/sin can differ in the last digits between the server and the
 * browser, which would be a hydration mismatch.
 */
const round2 = (n: number) => Math.round(n * 100) / 100;
const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = i * 2.39996;
  const radius = 30 + (i % 4) * 4.5;
  return { left: round2(50 + Math.cos(angle) * radius * 1.25), top: round2(46 + Math.sin(angle) * radius) };
});

/**
 * The centring shift on an element (Tailwind's -translate-x-1/2 and friends),
 * in px — offsetLeft/Top don't include it. Once GSAP animates an element it
 * folds the CSS `translate` into its own xPercent/yPercent, so read both.
 */
function centringShift(el: HTMLElement) {
  const value = getComputedStyle(el).translate;
  const [tx = "0px", ty = "0px"] = !value || value === "none" ? [] : value.split(" ");
  const px = (v: string, size: number) => (v.endsWith("%") ? (parseFloat(v) / 100) * size : parseFloat(v) || 0);
  const percent = (prop: "xPercent" | "yPercent") => Number(gsap.getProperty(el, prop)) || 0;
  return {
    x: px(tx, el.offsetWidth) + (percent("xPercent") / 100) * el.offsetWidth,
    y: px(ty, el.offsetHeight) + (percent("yPercent") / 100) * el.offsetHeight,
  };
}

/**
 * Centre of `el` in `stage`'s coordinates, from layout plus centring shifts —
 * so the transforms GSAP animates (the camera move, entrances) don't skew it.
 */
function centreIn(el: HTMLElement, stage: HTMLElement) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== stage) {
    const shift = centringShift(node);
    x += node.offsetLeft + shift.x;
    y += node.offsetTop + shift.y;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * The home page's "read → product → order" moment, on an inverse surface.
 *
 * One real product is read the way a reader reads a tag: a beam crosses it,
 * the RF field expands, the readout goes from "Tag detected" to "Verified",
 * and its spec sheet comes out as floating readouts wired back to it. The
 * camera moves around the composition, the price resolves, then everything
 * collapses into the product's Add to cart.
 *
 * Desktop, motion allowed: a tall track with a sticky stage; the sequence is
 * scrubbed to scroll (native sticky, like the product stack — no pinning, so
 * the page scrolls at its normal speed and nothing gets stuck).
 * Smaller screens: the same story as a short, time-based sequence played once
 * on arrival — no camera move or particles, and the readouts stay as a grid.
 * Reduced motion: the finished composition, static.
 */
export function ScanSpotlight({ product }: { product: ProductSummary }) {
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const { status, added, justAdded, add } = useAddToCart();

  const purchasable = product.stock >= product.minimumQuantity;
  const href = `/products/${product.slug}`;

  const readouts = [
    ...product.keySpecs.slice(0, 4).map((spec, i) => ({ slot: SPEC_SLOTS[i], label: spec.label, value: spec.value })),
    ...(product.categoryName ? [{ slot: "ml" as const, label: "Category", value: product.categoryName }] : []),
    {
      slot: "mr" as const,
      label: "Availability",
      value: `${STOCK_META[stockState(product.stock)].label}${product.stock > 0 ? ` · ${product.stock} units` : ""}`,
    },
  ];

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const q = gsap.utils.selector(section);
      const stage = q<HTMLElement>("[data-stage]")[0];
      const price = q<HTMLElement>("[data-price]")[0];
      if (!stage || !price) return;

      /** The price resolving from zero, on a tween so a scrub can reverse it. */
      const countUp = () => {
        const tally = { value: 0 };
        return gsap.fromTo(
          tally,
          { value: 0 },
          {
            value: product.price,
            ease: "power2.out",
            onUpdate: () => {
              price.textContent = formatCurrency(
                tally.value >= product.price ? product.price : Math.round(tally.value)
              );
            },
          }
        );
      };

      /**
       * Staggered fromTo() tweens only apply their start state as the playhead
       * reaches each target, so whatever starts hidden is hidden up front.
       */
      const hideUntilRead = () => {
        gsap.set(q("[data-readout]"), { autoAlpha: 0 });
        gsap.set(q("[data-bracket], [data-ring], [data-particle], [data-verified]"), { autoAlpha: 0 });
        // The readout chip arrives showing "Tag detected" (statically it shows "Verified").
        gsap.set(q("[data-detected]"), { autoAlpha: 1 });
        gsap.set(q("[data-line]"), { strokeDashoffset: 1 });
        gsap.set(q("[data-phase-bar]"), { scaleX: 0 });
      };

      const mm = gsap.matchMedia();

      // ── Desktop: scrubbed to the track ────────────────────────────────
      mm.add(`${DESKTOP} and ${MOTION_OK}`, () => {
        // The stage sticks below the 4rem header, so the story starts there.
        const headerPx = 4 * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
        hideUntilRead();
        const button = q<HTMLElement>("[data-order-button]")[0];
        const toButton = (axis: "x" | "y") => (_: number, el: HTMLElement) => {
          if (!button) return 0;
          return centreIn(button, stage)[axis] - centreIn(el, stage)[axis];
        };
        const toCentre = (axis: "x" | "y") => (_: number, el: HTMLElement) =>
          (axis === "x" ? stage.offsetWidth * (CENTRE[0] / 100) : stage.offsetHeight * (CENTRE[1] / 100)) -
          centreIn(el, stage)[axis];

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q("[data-track]")[0],
              start: () => `top ${headerPx}px`,
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          // 01 Scan — the product comes out of the dark; the beam crosses it.
          .fromTo(q("[data-phase-bar]")[0], { scaleX: 0 }, { scaleX: 1, duration: 2.4 }, 0)
          .fromTo(plate.current, { scale: 0.78, autoAlpha: 0.15 }, { scale: 1, autoAlpha: 1, duration: 1.2, ease: EASE.standard }, 0)
          .fromTo(q("[data-lock]"), { scale: 1.2 }, { scale: 1, duration: 1, ease: EASE.standard }, 0.9)
          .fromTo(q("[data-bracket]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, 0.9)
          .fromTo(q("[data-beam]"), { yPercent: -100 }, { yPercent: 0, duration: 1.4, ease: "power1.inOut" }, 1)
          .fromTo(q("[data-beam]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 1)
          .to(q("[data-beam]"), { autoAlpha: 0, duration: 0.2 }, 2.3)
          .fromTo(q("[data-particle]"), { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.5, stagger: 0.02 }, 0.4)
          .to(q("[data-particle]"), { x: toCentre("x"), y: toCentre("y"), autoAlpha: 0, duration: 1.4, ease: "power2.in", stagger: 0.03 }, 1.2)

          // 02 Detect — the field expands and the tag answers.
          .fromTo(q("[data-phase-bar]")[1], { scaleX: 0 }, { scaleX: 1, duration: 1.2 }, 2.4)
          .fromTo(q("[data-ring]"), { scale: 0.5, autoAlpha: 0.8 }, { scale: 2.6, autoAlpha: 0, duration: 1.6, ease: "power2.out", stagger: 0.25 }, 2.3)
          .fromTo(q("[data-readout-chip]"), { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 2.5)
          .fromTo(q("[data-detected]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 3.4)

          // 03 Verify — the spec sheet comes out, wired back to the product.
          .fromTo(q("[data-phase-bar]")[2], { scaleX: 0 }, { scaleX: 1, duration: 1.8 }, 3.6)
          .fromTo(q("[data-verified]"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.6)
          .fromTo(q("[data-line]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, 3.7)
          .fromTo(
            q("[data-readout]"),
            { autoAlpha: 0, scale: 0.86, z: -60 },
            { autoAlpha: 1, scale: 1, z: (i: number) => DEPTH[i] ?? 0, duration: 0.8, ease: EASE.standard, stagger: 0.14 },
            3.9
          )

          // The camera moves around the composition; the price resolves.
          .fromTo(q("[data-camera]"), { rotateY: -9, rotateX: 7 }, { rotateY: 9, rotateX: -2, duration: 2.6, ease: "sine.inOut" }, 3.6)
          .fromTo(q("[data-order]"), { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.standard }, 5.2)
          .add(countUp().duration(1), 5.3)

          // 04 Order — everything collapses into Add to cart.
          .fromTo(q("[data-phase-bar]")[3], { scaleX: 0 }, { scaleX: 1, duration: 1.8 }, 6.6)
          .to(q("[data-camera]"), { rotateY: 0, rotateX: 0, duration: 1.2, ease: "sine.inOut" }, 6.6)
          .to(q("[data-line]"), { strokeDashoffset: -1, duration: 0.6, stagger: 0.05 }, 6.6)
          .to(
            q("[data-readout]"),
            { x: toButton("x"), y: toButton("y"), z: 0, scale: 0.2, autoAlpha: 0, duration: 1, ease: "power2.in", stagger: 0.06 },
            6.8
          )
          .to(q("[data-lock]"), { scale: 1.12, autoAlpha: 0, duration: 0.6 }, 6.8)
          .to(plate.current, { scale: 0.9, y: -12, duration: 1.2, ease: EASE.standard }, 6.8)
          .fromTo(q("[data-order-ring]"), { scale: 0.9, autoAlpha: 0 }, { scale: 1.25, autoAlpha: 0.9, duration: 0.5 }, 7.7)
          .to(q("[data-order-ring]"), { scale: 1.6, autoAlpha: 0, duration: 0.6 }, 8.2)
          .fromTo(button, { scale: 1 }, { scale: 1.06, duration: 0.3, ease: "power2.out" }, 7.7)
          .to(button, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 8)
          // A beat of rest on the finished state before the section scrolls on.
          .to({}, { duration: 0.8 }, 8.6);

        // Reverting mid-count would otherwise leave a partial price on screen.
        return () => {
          price.textContent = formatCurrency(product.price);
        };
      });

      // ── Smaller screens: the same story, timed, once on arrival ────────
      mm.add(`not ${DESKTOP} and ${MOTION_OK}`, () => {
        hideUntilRead();
        gsap
          .timeline({
            defaults: { ease: EASE.emphasized },
            scrollTrigger: { trigger: stage, start: "top 75%", once: true },
          })
          .fromTo(q("[data-phase-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power1.inOut", stagger: 0.45 }, 0)
          .fromTo(plate.current, { scale: 0.92, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7 }, 0)
          .fromTo(q("[data-lock]"), { scale: 1.15 }, { scale: 1, duration: 0.6 }, 0.25)
          .fromTo(q("[data-bracket]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.04 }, 0.25)
          .fromTo(q("[data-beam]"), { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: "power2.inOut" }, 0.3)
          .fromTo(q("[data-beam]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.3)
          .to(q("[data-beam]"), { autoAlpha: 0, duration: 0.15 }, 1.05)
          .fromTo(q("[data-ring]"), { scale: 0.5, autoAlpha: 0.7 }, { scale: 1.8, autoAlpha: 0, duration: 1, ease: "expo.out", stagger: 0.15 }, 0.7)
          .fromTo(q("[data-readout-chip]"), { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.6)
          .fromTo(q("[data-detected]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 1.1)
          .fromTo(q("[data-verified]"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.2)
          .fromTo(q("[data-readout]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.07 }, 1.25)
          .fromTo(q("[data-order]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 1.55)
          .add(countUp().duration(0.9), 1.6);

        return () => {
          price.textContent = formatCurrency(product.price);
        };
      });
    },
    { scope: root, dependencies: [product._id] }
  );

  return (
    <section ref={root} aria-labelledby="spotlight-title" className="surface-inverse relative overflow-clip">
      <PageContainer className="pt-20 lg:pt-28">
        <SectionHeader
          id="spotlight-title"
          eyebrow="From read to order"
          title="Scan it. Verify it. Order it."
          description="One product from the catalog, read the way a reader reads a tag — identified, checked against its spec sheet, and one step from your cart."
        />
      </PageContainer>

      {/* Desktop with motion: a tall track the sticky stage plays along. */}
      <div data-track className="relative lg:motion-safe:h-[340vh]">
        <div className="pt-10 pb-20 lg:motion-reduce:pb-28 lg:motion-safe:sticky lg:motion-safe:top-16 lg:motion-safe:flex lg:motion-safe:h-[calc(100svh-4rem)] lg:motion-safe:flex-col lg:motion-safe:py-6">
          <PageContainer size="wide" className="flex min-h-0 flex-1 flex-col">
            <ol aria-hidden className="grid grid-cols-4 gap-3 sm:gap-6">
              {PHASES.map((phase, i) => (
                <li key={phase}>
                  <span className="block h-px overflow-hidden bg-border">
                    <span data-phase-bar className="block h-full origin-left bg-brand" />
                  </span>
                  <span className="mt-2 flex gap-2 text-meta text-muted-foreground uppercase tabular-nums">
                    <span className="text-foreground">{String(i + 1).padStart(2, "0")}</span>
                    {phase}
                  </span>
                </li>
              ))}
            </ol>

            {/* The stage. `data-camera` carries the whole composition, so moving it moves the view. */}
            <div data-stage className="relative mt-8 min-h-0 flex-1 lg:min-h-[32rem] lg:motion-reduce:min-h-[40rem] lg:[perspective:1600px]">
              <div
                data-camera
                className="relative flex flex-col items-center gap-6 lg:absolute lg:inset-0 lg:block lg:[transform-style:preserve-3d]"
              >
                <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 hidden [mask-image:radial-gradient(ellipse_at_50%_46%,black_10%,transparent_65%)] lg:block" />

                {/* Connection lines from the product to each readout, in % of the stage (no viewBox, so no stretching). */}
                <svg aria-hidden className="pointer-events-none absolute inset-0 hidden size-full text-border-strong lg:block">
                  {readouts.map(({ slot }) => {
                    const [x, y] = SLOTS[slot].anchor;
                    return (
                      <line
                        key={slot}
                        data-line
                        x1={`${CENTRE[0]}%`}
                        y1={`${CENTRE[1]}%`}
                        x2={`${x}%`}
                        y2={`${y}%`}
                        pathLength={1}
                        strokeDasharray="1 1"
                        stroke="currentColor"
                        strokeWidth={1}
                      />
                    );
                  })}
                </svg>

                {PARTICLES.map((p, i) => (
                  <span
                    key={i}
                    data-particle
                    aria-hidden
                    className="invisible absolute hidden size-1 rounded-full bg-foreground/70 lg:block"
                    style={{ left: `${p.left}%`, top: `${p.top}%` }}
                  />
                ))}

                {/* The product, lit on the dark stage. */}
                <div className="relative w-full max-w-md lg:absolute lg:top-[46%] lg:left-1/2 lg:w-[min(44vh,26rem)] lg:max-w-none lg:-translate-x-1/2 lg:-translate-y-1/2">
                  {/* The RF field, behind the plate. */}
                  <div aria-hidden className="pointer-events-none absolute inset-[8%]">
                    {[0, 1, 2].map((i) => (
                      <span key={i} data-ring className="invisible absolute inset-0 rounded-full border border-brand/60" />
                    ))}
                  </div>

                  <div
                    ref={plate}
                    data-flight-source
                    className="surface-default relative overflow-hidden rounded-card border border-border shadow-overlay"
                  >
                    <ProductMedia
                      src={product.image}
                      alt={product.name}
                      placeholder={product.name}
                      sizes="(max-width: 1024px) 100vw, 420px"
                      grid
                      className="aspect-square"
                      imageClassName="p-[12%]"
                    />
                    <div aria-hidden className="pointer-events-none absolute inset-0">
                      <div data-beam className="scan-beam invisible absolute inset-0" />
                      <div data-lock className="absolute inset-[12%]">
                        {[
                          "top-0 left-0 border-t border-l",
                          "top-0 right-0 border-t border-r",
                          "bottom-0 left-0 border-b border-l",
                          "bottom-0 right-0 border-b border-r",
                        ].map((corner) => (
                          <span key={corner} data-bracket className={cn("absolute size-5 border-foreground/60", corner)} />
                        ))}
                      </div>
                      <div
                        data-readout-chip
                        className="absolute top-3 left-3 grid rounded-control border border-border bg-background/90 px-2.5 py-1.5 font-mono text-tech shadow-card"
                      >
                        <span data-detected className="invisible col-start-1 row-start-1 flex items-center gap-2">
                          <span className="relative flex size-1.5">
                            <span className="absolute inset-0 animate-rf-ping rounded-full bg-brand" />
                            <span className="relative size-1.5 rounded-full bg-brand" />
                          </span>
                          <span className="text-meta tracking-[0.07em] uppercase">Tag detected</span>
                        </span>
                        <span data-verified className="col-start-1 row-start-1 flex items-center gap-2">
                          <Check className="size-3.5 text-success" strokeWidth={2.25} />
                          <span className="text-meta tracking-[0.07em] uppercase">Verified</span>
                          <span className="text-muted-foreground">{tagId(product._id, 3)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The spec sheet as floating readouts (a grid below the product on smaller screens). */}
                <dl className="grid w-full max-w-md grid-cols-2 gap-3 lg:contents">
                  {readouts.map(({ slot, label, value }) => (
                    <div
                      key={slot}
                      data-readout
                      className={cn(
                        "rounded-card border border-border bg-card/90 px-4 py-3 shadow-raised lg:absolute lg:w-[14rem]",
                        SLOTS[slot].className
                      )}
                    >
                      <dt className="flex items-center gap-2 text-meta text-muted-foreground uppercase">
                        <span aria-hidden className="size-1 rounded-full bg-brand" />
                        {label}
                      </dt>
                      <dd className="mt-1 truncate font-mono text-tech" title={value}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Where it all collapses to. */}
                <div
                  data-order
                  className="w-full max-w-md rounded-card border border-border-strong bg-card/95 p-4 shadow-overlay sm:p-5 lg:absolute lg:bottom-0 lg:left-1/2 lg:w-[min(58rem,94%)] lg:max-w-none lg:-translate-x-1/2"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
                    <div className="min-w-0 lg:flex-1">
                      <p className="flex items-center gap-2 text-meta text-muted-foreground uppercase">
                        {product.categoryName}
                        {product.sku && (
                          <>
                            <span aria-hidden className="h-3 w-px bg-border-strong" />
                            <span className="font-mono tracking-normal">{product.sku}</span>
                          </>
                        )}
                      </p>
                      <h3 className="mt-1 truncate text-h3">{product.name}</h3>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-h2 tabular-nums">
                        <span className="sr-only">{formatCurrency(product.price)}</span>
                        <span data-price aria-hidden>
                          {formatCurrency(product.price)}
                        </span>
                      </p>
                      {product.minimumQuantity > 1 && (
                        <p className="text-meta text-muted-foreground uppercase">
                          Per unit · minimum {product.minimumQuantity}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                      <span className="relative inline-flex flex-1 lg:flex-none">
                        <span
                          data-order-ring
                          aria-hidden
                          className="pointer-events-none invisible absolute inset-0 rounded-control border border-brand opacity-0"
                        />
                        <Button
                          data-order-button
                          size="lg"
                          className="relative w-full lg:w-auto"
                          onClick={() => void add(product._id, product.minimumQuantity, plate.current)}
                          disabled={!purchasable}
                          loading={status === "adding"}
                          loadingText="Adding…"
                          startIcon={justAdded ? <Check /> : <ShoppingCart />}
                        >
                          {!purchasable ? "Out of stock" : justAdded ? "Added" : "Add to cart"}
                        </Button>
                      </span>
                      <ActionLink href={href}>Full specifications</ActionLink>
                    </div>
                  </div>
                  <div aria-live="polite" className="text-small">
                    {status === "added" && (
                      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-success">
                        Added {added} to your cart.
                        <ActionLink href="/cart">View cart</ActionLink>
                      </p>
                    )}
                    {status === "signin" && (
                      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
                        Sign in to add items to your cart.
                        <ActionLink href="/login?redirect=%2F">Sign in</ActionLink>
                      </p>
                    )}
                    {status === "error" && (
                      <p className="mt-3 text-danger">Couldn&apos;t add this to your cart. Please try again.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </PageContainer>
        </div>
      </div>
    </section>
  );
}
