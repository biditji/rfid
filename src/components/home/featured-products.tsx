"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { fetchProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        // Grab top 3 items to feature
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
                Our most popular hardware, directly from the catalog.
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
          {loading ? (
             [1, 2, 3].map((i) => (
                <div key={i} className="h-72 rounded-xl bg-zinc-200 animate-pulse" />
             ))
          ) : products.map((product, idx) => {
            const isInstock = product.stock > 0;
            const stockColor = isInstock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600";
            const imageUrl = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : null;

            return (
              <FadeIn key={product._id} delay={idx * 0.05}>
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex flex-col h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-sm"
                >
                  <div className="relative aspect-[3/2] bg-zinc-50 border-b border-zinc-100 flex items-center justify-center">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-300">
                        <Package className="h-10 w-10 mb-2" />
                        <span className="text-xs font-medium uppercase tracking-wider">{product.category?.name || "Product"}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-medium text-zinc-400">
                      {product.sku}
                    </span>
                    <h3 className="mt-1.5 text-base font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-zinc-100">
                      <span className="text-lg font-bold text-zinc-900">
                        {formatCurrency(product.price)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${stockColor}`}
                      >
                        {isInstock ? "In Stock" : "Out of Stock"}
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
