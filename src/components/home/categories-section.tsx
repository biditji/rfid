"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CategorySummary } from "@/lib/categories";
import { categoryColors, categoryIcon } from "@/components/shared/category-visuals";

gsap.registerPlugin(ScrollTrigger);


/**
 * Shop-by-category cards for the real top-level categories, with product
 * counts rolled up from their subcategories. This used to be a hard-coded list
 * of categories the store doesn't have, with made-up counts.
 */
export function CategoriesSection({ categories }: { categories: CategorySummary[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header reveal
    if (headerRef.current) {
      gsap.fromTo(headerRef.current.children, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Grid cards batch reveal
    ScrollTrigger.batch(".category-card", {
      interval: 0.1,
      batchMax: 3,
      once: true,
      onEnter: (batch) =>
        gsap.fromTo(
          batch,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: "back.out(1.5)", overwrite: true }
        ),
      start: "top 85%",
    });
  }, { scope: containerRef });

  if (categories.length === 0) return null;

  return (
    <section ref={containerRef} className="bg-white py-20 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-2 text-zinc-500">
              Find the right components for your RFID infrastructure.
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            View all categories &rarr;
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, index) => {
            const Icon = categoryIcon(cat.name);
            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.param)}`}
                className="category-card group flex items-start gap-4 rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-zinc-200 hover:shadow-md hover:-translate-y-1"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${categoryColors(index).accent}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-zinc-900 transition-colors group-hover:text-blue-600">
                      {cat.name}
                    </h3>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                      {cat.productCount}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
