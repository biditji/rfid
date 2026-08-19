/** Instant skeleton for a product page while its data is fetched. */
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="h-4 w-64 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-200/70" />
          <div className="mt-10 space-y-4 lg:mt-0">
            <div className="h-5 w-28 animate-pulse rounded-full bg-zinc-200/70" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-zinc-200/70" />
            <div className="h-8 w-32 animate-pulse rounded bg-zinc-200/70" />
            <div className="space-y-2 pt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-zinc-200/70" />
              ))}
            </div>
            <div className="h-12 w-48 animate-pulse rounded-lg bg-zinc-200/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
