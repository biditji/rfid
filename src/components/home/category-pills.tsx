import Link from "next/link";
import type { CategorySummary } from "@/lib/categories";
import { categoryColors, categoryIcon } from "@/components/shared/category-visuals";

/**
 * The hero's shop-by-category pills, one per real top-level category.
 *
 * These used to be a hard-coded list whose slugs ("rfid-readers",
 * "rfid-labels", …) matched no real category, so every pill landed on the
 * unfiltered catalog. Rendered on the server from the live category tree.
 */
export function CategoryPills({ categories }: { categories: CategorySummary[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {categories.map((category, index) => {
        const Icon = categoryIcon(category.name);
        const colors = categoryColors(index);
        return (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.param)}`}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`animate-pill-enter group flex items-center gap-2 rounded-full border bg-gradient-to-r px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:scale-[1.03] hover:shadow-md ${colors.pill}`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${colors.pillIcon}`}>
              <Icon className="h-3 w-3 text-white" />
            </span>
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}

/** Same footprint as the pills, so nothing shifts when they stream in. */
export function CategoryPillsSkeleton() {
  return (
    <div className="mt-6 flex flex-wrap gap-2" aria-hidden>
      {[112, 128, 104, 120].map((width) => (
        <div key={width} className="h-9 animate-pulse rounded-full bg-zinc-100" style={{ width }} />
      ))}
    </div>
  );
}
