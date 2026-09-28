import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";

/** Instant skeleton in the product page's shape: gallery | purchase panel. */
export default function ProductLoading() {
  return (
    <>
      <PageContainer className="pt-6">
        <Skeleton className="h-4 w-72 max-w-full" />
      </PageContainer>
      <PageContainer className="grid grid-cols-1 gap-10 pt-6 pb-16 lg:grid-cols-12 lg:gap-12">
        <Skeleton className="aspect-square rounded-card sm:aspect-[4/3] lg:col-span-7 lg:aspect-square" />
        <div className="space-y-4 lg:col-span-5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-16" />
          <div className="space-y-3 border-t border-border pt-6">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-14 w-40" />
            <Skeleton className="h-14 flex-1" />
          </div>
          <Skeleton className="h-14" />
        </div>
      </PageContainer>
    </>
  );
}
