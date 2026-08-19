/** Generic instant fallback for public routes that don't define their own. */
export default function PublicLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-10 w-2/3 max-w-md animate-pulse rounded bg-zinc-100" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-zinc-100" />
      <div className="mt-12 h-[400px] animate-pulse rounded-3xl bg-zinc-100" />
    </div>
  );
}
