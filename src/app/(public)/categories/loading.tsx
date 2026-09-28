import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";

/** Instant skeleton for the categories index. */
export default function CategoriesLoading() {
  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-80 max-w-full" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <div className="mt-12 border-t border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-border py-4">
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
