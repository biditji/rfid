"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Package,
  Truck,
  Shield,
  CheckCircle2,
} from "lucide-react";
import type { Product } from "@/types";
import { formatCurrency, getStockStatus, cn } from "@/lib/utils";
import { FadeIn } from "@/components/shared/fade-in";

interface ProductDetailContentProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailContent({
  product,
  relatedProducts,
}: ProductDetailContentProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "docs">(
    "description"
  );
  const stock = getStockStatus(product.stock);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <FadeIn>
        <nav className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Link
            href="/"
            className="transition-colors hover:text-zinc-600"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            href="/products"
            className="transition-colors hover:text-zinc-600"
          >
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-zinc-600 line-clamp-1">{product.name}</span>
        </nav>
      </FadeIn>

      {/* Product main */}
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image gallery */}
        <FadeIn>
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-200/50">
                    <span className="text-3xl font-bold text-zinc-300">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">
                    {product.category}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square cursor-pointer overflow-hidden rounded-lg border bg-zinc-50",
                    i === 0
                      ? "border-zinc-400"
                      : "border-zinc-200 opacity-60 hover:opacity-100"
                  )}
                >
                  <div className="flex h-full items-center justify-center">
                    <span className="text-xs text-zinc-400">View {i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Product info */}
        <FadeIn delay={0.1}>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                {product.category}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  stock.color === "emerald"
                    ? "bg-emerald-50 text-emerald-600"
                    : stock.color === "amber"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                )}
              >
                {stock.label}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-zinc-400">SKU: {product.sku}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-zinc-900">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-zinc-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
              {product.price < 1 && (
                <span className="text-sm text-zinc-500">per unit</span>
              )}
            </div>

            <p className="mt-4 leading-relaxed text-zinc-600">
              {product.shortDescription}
            </p>

            {/* Quantity + Add to Cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center rounded-lg border border-zinc-200">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-700"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-zinc-200 text-sm font-medium text-zinc-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-700"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Truck,
                  label: "Free shipping",
                  sub: "Orders over $500",
                },
                {
                  icon: Package,
                  label: "Same-day dispatch",
                  sub: "Order by 2pm CT",
                },
                {
                  icon: Shield,
                  label: "Warranty included",
                  sub: "Manufacturer backed",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50 p-3"
                >
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                  <div>
                    <p className="text-xs font-medium text-zinc-700">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-zinc-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Tabs: Description / Specs / Docs */}
      <FadeIn>
        <div className="mt-16 border-t border-zinc-200 pt-10">
          <div className="flex gap-1 border-b border-zinc-200">
            {(
              [
                { id: "description", label: "Description" },
                { id: "specs", label: "Specifications" },
                { id: "docs", label: "Documentation" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-4 py-2.5 text-sm font-medium transition-colors",
                  activeTab === tab.id
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-zinc-900" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="leading-relaxed text-zinc-600">
                  {product.description}
                </p>
                {product.features.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      Key Features
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm text-zinc-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value], i) => (
                        <tr
                          key={key}
                          className={
                            i % 2 === 0 ? "bg-zinc-50" : "bg-white"
                          }
                        >
                          <td className="px-4 py-2.5 text-sm font-medium text-zinc-700">
                            {key}
                          </td>
                          <td className="px-4 py-2.5 text-sm text-zinc-600">
                            {value}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "docs" && (
              <div className="max-w-2xl">
                <p className="text-sm text-zinc-500">
                  Technical documentation, datasheets, and integration guides
                  are available upon request. Contact our sales team for access
                  to the full documentation package.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Request documentation →
                </Link>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <FadeIn>
          <div className="border-t border-zinc-200 pt-12">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Related products
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((rp) => {
                const rpStock = getStockStatus(rp.stock);
                return (
                  <Link
                    key={rp.id}
                    href={`/products/${rp.slug}`}
                    className="group rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-sm"
                  >
                    <div className="aspect-[4/3] rounded-lg bg-zinc-50 mb-3 flex items-center justify-center">
                      <span className="text-xs text-zinc-400">
                        {rp.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700 line-clamp-2">
                      {rp.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-zinc-900">
                        {formatCurrency(rp.price)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          rpStock.color === "emerald"
                            ? "bg-emerald-50 text-emerald-600"
                            : rpStock.color === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                        )}
                      >
                        {rpStock.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
