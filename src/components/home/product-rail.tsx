"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ProductSummary } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";

/**
 * A horizontal rail of product cards that runs off the right edge of the page
 * while its first card lines up with the content column.
 *
 * Scrolls natively (touch, trackpad, shift-wheel, keyboard via the cards'
 * links); the prev/next buttons exist for mouse users, whom a hidden
 * scrollbar would otherwise leave with no way to see past the first cards.
 */
export function ProductRail({ title, products }: { title: string; products: ProductSummary[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const headingId = useId();

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const page = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby={headingId}>
      <PageContainer className="flex items-end justify-between gap-4">
        <h3 id={headingId} className="text-h3">
          {title}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Previous products" disabled={edges.start} onClick={() => page(-1)}>
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="icon" aria-label="Next products" disabled={edges.end} onClick={() => page(1)}>
            <ArrowRight />
          </Button>
        </div>
      </PageContainer>

      <ul
        ref={scroller}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-1 sm:scroll-px-6 sm:px-6 lg:scroll-px-[max(2rem,calc((100%_-_80rem)/2_+_2rem))] lg:px-[max(2rem,calc((100%_-_80rem)/2_+_2rem))]"
      >
        {products.map((product) => (
          <li key={product._id} className="flex">
            <ProductCard product={product} variant="rail" />
          </li>
        ))}
      </ul>
    </section>
  );
}
