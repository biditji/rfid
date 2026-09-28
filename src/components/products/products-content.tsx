"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { ProductSummary } from "@/lib/products";
import type { CategoryOption } from "@/lib/categories";
import { cn, slugify } from "@/lib/utils";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { SORT_OPTIONS, type SortValue } from "@/lib/catalog";

export function ProductsContent({
  products = [],
  categories = [],
  initialSearch = "",
  initialCategory = null,
  initialSort = "newest",
  initialInStock = false,
}: {
  products?: ProductSummary[];
  /** The category tree, flattened in display order (see `categoryOptions`). */
  categories?: CategoryOption[];
  /** Seeded from ?search= on the server, so the first paint is already filtered. */
  initialSearch?: string;
  /** Seeded from ?category= on the server: the name of the matching option. */
  initialCategory?: string | null;
  initialSort?: SortValue;
  initialInStock?: boolean;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [sortBy, setSortBy] = useState<SortValue>(initialSort);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [showFilters, setShowFilters] = useState(false);
  const ids = { search: useId(), sort: useId(), filters: useId(), stock: useId() };

  // Mirror the filters into the URL so a filtered view survives reloads, the
  // back button and being shared. replaceState: no history entry per keystroke,
  // and no server round trip (Next syncs useSearchParams with it).
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (selectedCategory) params.set("category", slugify(selectedCategory));
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (inStockOnly) params.set("stock", "1");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [search, selectedCategory, sortBy, inStockOnly]);

  const counts = useMemo(() => {
    const byName = new Map<string, number>();
    for (const p of products) if (p.categoryName) byName.set(p.categoryName, (byName.get(p.categoryName) ?? 0) + 1);
    return new Map(categories.map((c) => [c.name, c.names.reduce((sum, n) => sum + (byName.get(n) ?? 0), 0)]));
  }, [products, categories]);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      // `searchText` is pre-built and pre-lowercased on the server.
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.searchText.includes(q));
    }

    // A parent category matches the products filed under any of its
    // subcategories, not just ones filed directly under it.
    const option = categories.find((c) => c.name === selectedCategory);
    if (option) {
      result = result.filter((p) => p.categoryName !== null && option.names.includes(p.categoryName));
    }

    if (inStockOnly) result = result.filter((p) => p.stock > 0);

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
        result.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
    }

    return result;
  }, [products, categories, search, selectedCategory, sortBy, inStockOnly]);

  const hasFilters = Boolean(search.trim() || selectedCategory || inStockOnly);
  const clearAll = () => {
    setSearch("");
    setSelectedCategory(null);
    setInStockOnly(false);
  };

  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <SectionHeader
        as="h1"
        eyebrow="Catalog"
        title={selectedCategory ?? "Products"}
        description="RFID readers, antennas and tags. Every listing shows its specifications, live stock and price."
      />

      {/* Toolbar */}
      <div className="mt-10 flex flex-wrap items-end gap-3 border-b border-border pb-6">
        <div className="min-w-0 flex-1 basis-64">
          <label htmlFor={ids.search} className="sr-only">
            Search products
          </label>
          <Input
            id={ids.search}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search model, SKU, frequency…"
            startIcon={<Search />}
            containerClassName="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor={ids.sort} className="text-small text-muted-foreground max-sm:sr-only">
            Sort
          </label>
          <NativeSelect id={ids.sort} value={sortBy} onChange={(e) => setSortBy(e.target.value as SortValue)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <Button
          variant="outline"
          className="lg:hidden"
          onClick={() => setShowFilters((open) => !open)}
          aria-expanded={showFilters}
          aria-controls={ids.filters}
          startIcon={<SlidersHorizontal />}
        >
          Filters
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr]">
        {/* Filters */}
        <aside
          id={ids.filters}
          aria-label="Filters"
          className={cn("space-y-8 lg:block", showFilters ? "block" : "hidden")}
        >
          <fieldset>
            <legend className="text-meta text-muted-foreground uppercase">Category</legend>
            <ul className="mt-3 space-y-0.5">
              <li>
                <FilterButton pressed={!selectedCategory} onClick={() => setSelectedCategory(null)} count={products.length}>
                  All products
                </FilterButton>
              </li>
              {categories.map((cat) => (
                <li key={cat.name}>
                  <FilterButton
                    pressed={selectedCategory === cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    count={counts.get(cat.name) ?? 0}
                    indent={cat.depth > 0}
                  >
                    {cat.name}
                  </FilterButton>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="border-t border-border pt-6">
            <legend className="sr-only">Availability</legend>
            <p aria-hidden className="text-meta text-muted-foreground uppercase">
              Availability
            </p>
            <label htmlFor={ids.stock} className="mt-3 flex min-h-10 cursor-pointer items-center gap-3 text-small">
              <input
                id={ids.stock}
                type="checkbox"
                className="size-4 cursor-pointer accent-primary"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In stock only
            </label>
          </fieldset>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex min-h-8 flex-wrap items-center justify-between gap-3">
            <p className="text-small text-muted-foreground" aria-live="polite">
              <span className="font-medium text-foreground tabular-nums">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "product" : "products"}
              {selectedCategory && <> in {selectedCategory}</>}
            </p>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear filters
              </Button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-grid flex flex-col items-start rounded-card border border-border bg-surface px-6 py-14 sm:px-10">
              <p className="text-h3">No products match</p>
              <p className="mt-2 text-small text-muted-foreground">
                Try a different search, or clear the filters to see the whole catalog.
              </p>
              <Button variant="outline" className="mt-6" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((product, i) => (
                <li key={product._id} className="flex">
                  {/* The first row is above the fold; its photos are the LCP candidates. */}
                  <ProductCard product={product} variant="grid" priority={i < 3} className="w-full" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function FilterButton({
  pressed,
  onClick,
  count,
  indent = false,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  count: number;
  indent?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "relative flex min-h-10 w-full items-center justify-between gap-3 rounded-control px-3 text-left text-small transition-colors",
        indent && "pl-6",
        pressed ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {pressed && <span aria-hidden className="absolute inset-y-2 left-0 w-0.5 bg-brand" />}
      <span className="min-w-0 truncate">{children}</span>
      <span className="shrink-0 text-meta tracking-normal text-muted-foreground tabular-nums">{count}</span>
    </button>
  );
}
