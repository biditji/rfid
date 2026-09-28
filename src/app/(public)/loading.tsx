import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";

/** Generic instant fallback for public routes that don't define their own. */
export default function PublicLoading() {
  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-5 h-11 w-2/3 max-w-md" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <Skeleton className="mt-12 h-96 rounded-card" />
    </PageContainer>
  );
}
