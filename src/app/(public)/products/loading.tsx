/**
 * Shown immediately when navigating into /products, so the click gives instant
 * feedback instead of the browser sitting on the previous page while the server
 * waits on a backend that can take tens of seconds on a cold cache.
 */
export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-36 animate-pulse rounded bg-zinc-100" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-9 w-64 animate-pulse rounded-lg bg-zinc-100" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden space-y-3 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded-md bg-zinc-100" />
          ))}
        </aside>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="aspect-[3/2] animate-pulse bg-zinc-100" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                <div className="mt-4 h-5 w-24 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
