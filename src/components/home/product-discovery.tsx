import type { CategorySummary } from "@/lib/categories";
import type { ProductSummary } from "@/lib/products";
import { ActionLink, SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { CategoryIndex } from "@/components/products/category-index";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductRail } from "./product-rail";

/**
 * Product discovery: the live category tree as a typographic index (numbered
 * rows, counts in mono) and a full-bleed rail of more products. An index, not
 * another grid of cards — this is where people choose a direction.
 */
export function ProductDiscovery({
  categories,
  products,
  totalProducts,
}: {
  categories: CategorySummary[];
  products: ProductSummary[];
  /** Null when the catalog is unreachable — then no counts are claimed. */
  totalProducts: number | null;
}) {
  return (
    <section aria-labelledby="discovery-title" className="py-20 lg:py-28">
      <PageContainer>
        <SectionHeader
          id="discovery-title"
          eyebrow="Catalog"
          title="Find the right hardware"
          description={
            totalProducts
              ? `${totalProducts} products across ${categories.length} categories, with specifications, stock and pricing on every listing.`
              : "Readers, antennas and tags, with specifications, stock and pricing on every listing."
          }
          action={<ActionLink href="/products">View all products</ActionLink>}
        />

        {categories.length > 0 && (
          <CategoryIndex
            className="mt-12"
            items={categories.map((category) => ({
              id: category.id,
              name: category.name,
              href: `/products?category=${encodeURIComponent(category.param)}`,
              count: category.productCount,
              description: category.description,
            }))}
          />
        )}
      </PageContainer>

      {products.length > 0 && (
        <div className="mt-20">
          <ProductRail title="More from the catalog" products={products} />
        </div>
      )}
    </section>
  );
}

export function ProductDiscoverySkeleton() {
  return (
    <section aria-hidden className="py-20 lg:py-28">
      <PageContainer>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-5 h-9 w-80 max-w-full" />
        <Skeleton className="mt-4 h-5 w-[28rem] max-w-full" />
        <div className="mt-12 grid grid-cols-1 gap-x-12 border-t border-border md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b border-border py-4">
              <Skeleton className="h-10" />
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
