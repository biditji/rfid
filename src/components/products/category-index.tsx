import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export type CategoryIndexItem = {
  id: string;
  name: string;
  href: string;
  count: number;
  description?: string;
  /** Subcategories sit indented under their parent. */
  depth?: number;
};

/**
 * The catalog's categories as a numbered typographic index — rows and
 * hairlines, counts in mono. The one category treatment in the storefront:
 * no per-category colours or icons.
 */
export function CategoryIndex({
  items,
  columns = 2,
  wrapDescriptions = false,
  className,
}: {
  items: CategoryIndexItem[];
  columns?: 1 | 2;
  /** Show descriptions in full rather than truncated to a line. */
  wrapDescriptions?: boolean;
  className?: string;
}) {
  // Top-level rows are numbered 01, 02 …; subcategories get a dash.
  const numbers = items.map((_, i) => items.slice(0, i + 1).filter((x) => !x.depth).length);

  return (
    <Reveal as="ol" className={cn("grid grid-cols-1 border-t border-border", columns === 2 && "md:grid-cols-2 md:gap-x-12", className)}>
      {items.map((item, i) => {
        const nested = (item.depth ?? 0) > 0;
        return (
          <li key={item.id} data-reveal className="border-b border-border">
            <Link
              href={item.href}
              className={cn("group grid grid-cols-[2.25rem_1fr_auto] items-center gap-4 py-4", nested && "pl-8")}
            >
              <span className="text-meta text-muted-foreground tabular-nums">
                {nested ? "—" : String(numbers[i]).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className={cn("block font-medium group-hover:underline", nested ? "text-small" : "text-body")}>
                  {item.name}
                </span>
                {item.description && (
                  <span
                    className={cn(
                      "block text-small text-muted-foreground",
                      wrapDescriptions ? "line-clamp-2 max-w-3xl text-pretty" : "truncate"
                    )}
                  >
                    {item.description}
                  </span>
                )}
              </span>
              <span className="flex items-center gap-3 text-muted-foreground">
                <span className="text-small tabular-nums">
                  {item.count}
                  <span className="sr-only"> products</span>
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                />
              </span>
            </Link>
          </li>
        );
      })}
    </Reveal>
  );
}
