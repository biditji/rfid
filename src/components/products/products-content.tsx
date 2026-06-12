"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatCurrency, getStockStatus, cn } from "@/lib/utils";
import { FadeIn } from "@/components/shared/fade-in";

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Name: A → Z", value: "name-asc" },
];

export function ProductsContent({ products = [], categories = [] }: { products?: any[], categories?: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (selectedCategory) {
      // Handle both populated category object { name: '...' } and string ID
      result = result.filter((p) => p.category?.name === selectedCategory || p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [search, selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Products
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}{" "}
              {selectedCategory ? `in ${selectedCategory}` : "available"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 sm:block"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </FadeIn>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
        <aside
          className={cn(
            "space-y-6 lg:block",
            showFilters ? "block" : "hidden"
          )}
        >
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Category
            </h3>
            <div className="mt-3 space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "block w-full rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                  !selectedCategory
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                    selectedCategory === cat.name
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  {cat.name}
                  <span className="text-xs text-zinc-400">
                    
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Availability
            </h3>
            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-zinc-300"
                  defaultChecked
                />
                In Stock
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-zinc-300"
                />
                Include Out of Stock
              </label>
            </div>
          </div>

          {selectedCategory && (
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
            >
              <X className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </aside>

        {/* Product grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-20">
              <p className="text-sm font-medium text-zinc-500">
                No products found
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, idx) => {
                const stock = getStockStatus(product.stock);
                return (
                  <FadeIn key={product.id} delay={Math.min(idx * 0.03, 0.3)}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-sm"
                    >
                      <div className="relative aspect-[3/2] bg-zinc-100 overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={`http://localhost:5000${product.images[0]}`}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center p-6">
                            <div className="text-center">
                              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-200/60">
                                <span className="text-lg font-bold text-zinc-400">
                                  {product.name.charAt(0)}
                                </span>
                              </div>
                              <p className="mt-2 text-xs text-zinc-400">
                                {product.category?.name || "Uncategorized"}
                              </p>
                            </div>
                          </div>
                        )}
                        {product.compareAtPrice && (
                          <span className="absolute left-3 top-3 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Sale
                          </span>
                        )}
                        {stock.color === "red" && (
                          <span className="absolute right-3 top-3 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                            Sold Out
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <span className="text-xs font-medium text-zinc-400">
                          {product.sku}
                        </span>
                        <h3 className="mt-1 text-sm font-semibold leading-snug text-zinc-900 group-hover:text-zinc-700 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">
                          {product.description}
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
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
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
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
