"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { fetchProducts } from "@/lib/api";
import { formatCurrency, getServerUrl } from "@/lib/utils";

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        // Skip first 7 (shown in hero spotlight + quick browse) and grab next 6
        setProducts(data.slice(7, 13));
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="bg-white py-24 sm:py-32 overflow-hidden relative border-t border-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                More to Explore
              </h2>
              <p className="mt-4 text-lg text-zinc-500">
                Dive deeper into our catalog — more RFID hardware engineered for performance and reliability.
              </p>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-sm font-semibold text-zinc-900 transition-colors"
            >
              Explore Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>

        <div className="mt-16 flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
          {loading ? (
             [1, 2, 3, 4].map((i) => (
                <div key={i} className="min-w-[85vw] sm:min-w-[320px] md:min-w-[400px] h-[480px] rounded-3xl bg-zinc-100 animate-pulse snap-center shrink-0" />
             ))
          ) : products.map((product, idx) => {
            const isInstock = product.stock > 0;
            const imageUrl = product.images?.[0] ? getServerUrl(product.images[0]) : null;

            return (
              <FadeIn key={product._id} delay={idx * 0.1} className="min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] snap-center shrink-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-100 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1"
                >
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
                      Top Pick
                    </span>
                    {!isInstock && (
                       <span className="rounded-full bg-red-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
                         Out of Stock
                       </span>
                    )}
                  </div>
                  
                  <div className="relative h-64 w-full bg-white flex items-center justify-center p-8 mix-blend-multiply overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/50 to-transparent z-0" />
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="h-full w-full object-contain relative z-10 transition-transform duration-700 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-300 relative z-10">
                        <Package className="h-16 w-16 mb-4 transition-transform duration-700 group-hover:scale-110" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6 lg:p-8">
                    <div className="flex-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                        {product.category?.name || "Equipment"}
                      </span>
                      <h3 className="mt-2 text-xl font-bold leading-tight text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm text-zinc-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-end justify-between pt-6 border-t border-zinc-100">
                      <div>
                        <p className="text-sm font-medium text-zinc-500">Starting at</p>
                        <p className="text-2xl font-bold text-zinc-900">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition-transform duration-300 group-hover:scale-110 group-hover:bg-blue-600">
                        <ArrowRight className="h-5 w-5" />
                      </div>
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
              className="text-sm font-semibold text-zinc-600 hover:text-zinc-900"
            >
              View all products →
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
