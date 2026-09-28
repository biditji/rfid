"use client";

import { useRef } from "react";
import type { ProductSummary } from "@/lib/products";
import { ProductMedia } from "@/components/shared/product-image";
import { StockBadge } from "@/components/shared/status-badge";
import { ActionLink } from "@/components/shared/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { DURATION, EASE, MOTION_OK, gsap, useGSAP } from "@/lib/motion";
import { formatCurrency } from "@/lib/utils";

/**
 * The hero's product, presented like a spec plate: the photo on the
 * measurement grid, its real overall dimensions drawn as a dimension line, and
 * a readout of the spec sheet underneath. Every figure comes from the product
 * record.
 */
export function HeroVisual({ product }: { product: ProductSummary }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const figure = root.current;
        if (!figure) return;
        figure.removeAttribute("data-intro");

        // Enters after the headline has started, whenever the data arrives.
        gsap.fromTo(
          figure,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: DURATION.intro, ease: EASE.emphasized, delay: 0.45 }
        );

        // Scroll: the product eases slightly closer as the hero leaves.
        gsap.to("[data-hero-media]", {
          scale: 1.07,
          ease: "none",
          scrollTrigger: {
            trigger: figure.closest("section"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  const specs = product.keySpecs.slice(0, 4);

  return (
    <figure
      ref={root}
      data-intro
      className="relative overflow-hidden rounded-card border border-border bg-muted"
      aria-labelledby="hero-product-name"
    >
      <div className="relative overflow-hidden">
        <div data-hero-media>
          <ProductMedia
            src={product.image}
            alt={product.name}
            placeholder={product.name}
            sizes="(max-width: 1024px) 100vw, 640px"
            priority
            grid
            className="aspect-[4/3] lg:aspect-[16/11]"
            imageClassName="p-[10%] pb-[13%]"
          />
        </div>

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

      <figcaption className="relative border-t border-border bg-background p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-meta text-muted-foreground uppercase">
              {product.categoryName}
              {product.sku && (
                <>
                  <span aria-hidden className="h-3 w-px bg-border-strong" />
                  <span className="font-mono tracking-normal">{product.sku}</span>
                </>
              )}
            </p>
            <p id="hero-product-name" className="mt-1.5 text-h3">
              {product.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StockBadge stock={product.stock} />
            <p className="text-h3 tabular-nums">{formatCurrency(product.price)}</p>
          </div>
        </div>

        {specs.length > 0 && (
          <dl className="mt-5 border-t border-border">
            {specs.map((spec) => (
              <div key={spec.label} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-border py-2.5">
                <dt className="text-meta text-muted-foreground uppercase">{spec.label}</dt>
                <dd className="text-right font-mono text-tech text-pretty">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <ActionLink href={`/products/${product.slug}`} className="mt-5">
          View {product.name}
        </ActionLink>
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
