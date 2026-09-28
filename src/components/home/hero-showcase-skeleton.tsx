/**
 * Placeholder for the hero's product showcase while it streams in.
 *
 * Mirrors the real spotlight's dimensions so the surrounding layout doesn't
 * shift when the products arrive.
 */
export function HeroShowcaseSkeleton() {
  return (
    <div>
      <div className="relative rounded-3xl hero-spotlight-gradient border border-zinc-100 overflow-hidden">
        <div className="grid min-h-[420px] grid-cols-1 items-center gap-6 p-6 sm:min-h-[400px] sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
          <div className="flex flex-col gap-4">
            <div className="h-6 w-32 animate-pulse rounded-full bg-zinc-200/70" />
            <div className="h-9 w-3/4 animate-pulse rounded bg-zinc-200/70" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-200/60" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200/60" />
            <div className="mt-2 h-10 w-40 animate-pulse rounded bg-zinc-200/70" />
            <div className="mt-4 flex gap-3">
              <div className="h-12 w-36 animate-pulse rounded-xl bg-zinc-200/70" />
              <div className="h-12 w-36 animate-pulse rounded-xl bg-zinc-100" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-[260px] w-full animate-pulse rounded-2xl bg-zinc-200/50 sm:h-[300px] lg:h-[340px]" />
          </div>
        </div>
      </div>

      <div className="mt-8 mb-6 sm:mt-10 sm:mb-8">
        <div className="mb-5 h-6 w-40 animate-pulse rounded bg-zinc-100" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-zinc-100 bg-white">
              <div className="h-36 animate-pulse bg-zinc-50 sm:h-44" />
              <div className="space-y-2 p-3.5 sm:p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                <div className="h-5 w-20 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
