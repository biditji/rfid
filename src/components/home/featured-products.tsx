import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import { ProductImage } from "@/components/shared/product-image";
import type { ProductCard } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";

/**
 * Server component — the product list arrives as a prop from the page's single
 * cached fetch. It used to be a client component that fetched the whole catalog
 * again on mount, which doubled the load on a slow backend and rendered nothing
 * at all when that request failed.
 */
export function FeaturedProducts({ products }: { products: ProductCard[] }) {
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
          {products.map((product, idx) => {
            const isInstock = product.stock > 0;

            return (
              <FadeIn key={product._id} delay={idx * 0.1} className="min-w-[85vw] sm:min-w-[320px] md:min-w-[380px] snap-center shrink-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="group relative flex flex-col h-full overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-100 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1"
                >
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm">
                      Top Pick
                    </span>
                    {!isInstock && (
                       <span className="rounded-full bg-red-500/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-sm">
                         Out of Stock
                       </span>
                    )}
                  </div>

                  <div className="relative h-64 w-full bg-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-50/50 to-transparent z-10 pointer-events-none" />
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      sizes="(max-width: 640px) 85vw, 380px"
                      className="p-8 object-contain transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6 lg:p-8">
                    <div className="flex-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                        {product.categoryName || "Equipment"}
                      </span>
                      <h3 className="mt-2 text-xl font-bold leading-tight text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-3 text-sm text-zinc-500 line-clamp-2">
                        {product.excerpt}
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
