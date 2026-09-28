import type { ProductSummary } from "@/lib/products";
import { SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductStack } from "./product-stack";

export function ShowcaseSection({ products }: { products: ProductSummary[] }) {
  return (
    <section aria-labelledby="showcase-title" className="border-b border-border bg-surface py-20 lg:py-28">
      <PageContainer>
        <SectionHeader
          id="showcase-title"
          eyebrow="Featured hardware"
          title="One catalog, every read point"
          description="Readers and antennas for each place tagged stock needs to be seen — every one with its full specification sheet."
        />
        <div className="mt-12 lg:mt-16">
          <ProductStack products={products} />
        </div>
      </PageContainer>
    </section>
  );
}

export function ShowcaseSkeleton() {
  return (
    <section aria-hidden className="border-b border-border bg-surface py-20 lg:py-28">
      <PageContainer>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-5 h-9 w-96 max-w-full" />
        <Skeleton className="mt-4 h-5 w-[30rem] max-w-full" />
        <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-card border border-border bg-card md:grid-cols-12 lg:mt-16">
          <Skeleton className="aspect-[4/3] rounded-none md:col-span-7 md:aspect-auto md:min-h-[33rem]" />
          <div className="space-y-4 p-8 md:col-span-5">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-16" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5" />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
