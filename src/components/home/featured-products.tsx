"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { getFeaturedProducts } from "@/data/products";
import { formatCurrency, getStockStatus } from "@/lib/utils";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="border-t border-zinc-100 bg-zinc-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Featured products
              </h2>
              <p className="mt-2 text-zinc-500">
                Our most popular RFID hardware, ready to ship.
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:flex"
            >
              All products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, idx) => {
            const stock = getStockStatus(product.stock);
            return (
              <FadeIn key={product.id} delay={idx * 0.05}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-sm"
                >
                  {/* Image placeholder */}
                  <div className="relative aspect-[3/2] bg-zinc-100 p-6">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-200/50">
                          <span className="text-lg font-bold text-zinc-400">
                            {product.category.charAt(5)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-zinc-400">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    {product.compareAtPrice && (
                      <span className="absolute left-3 top-3 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-xs font-medium text-zinc-400">
                      {product.sku}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-zinc-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-zinc-400 line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          stock.color === "emerald"
                            ? "bg-emerald-50 text-emerald-600"
                            : stock.color === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {stock.label}
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View all products →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
