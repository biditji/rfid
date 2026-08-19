/** Instant skeleton for the categories listing. */
export default function CategoriesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-8 w-56 animate-pulse rounded bg-zinc-100" />
      <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-zinc-100" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
          >
            <div className="aspect-[2/1] animate-pulse bg-zinc-100" />
            <div className="space-y-2 p-5">
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
