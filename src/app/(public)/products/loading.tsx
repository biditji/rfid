import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";

/**
 * Shown immediately when navigating into /products, so the click gives instant
 * feedback instead of the browser sitting on the previous page while the server
 * waits on a backend that can take tens of seconds on a cold cache.
 */
export default function ProductsLoading() {
  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-56" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />

      <div className="mt-10 flex flex-wrap gap-3 border-b border-border pb-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr]">
        <div className="hidden space-y-2 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-card border border-border">
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4" />
                <Skeleton className="mt-4 h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
