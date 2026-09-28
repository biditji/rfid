"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, AlertCircle } from "lucide-react";

/**
 * Shown when the product API didn't answer.
 *
 * The distinction that matters: an empty catalog and an unreachable backend are
 * different things, and only one of them is worth offering a retry for. The
 * rest of the page stays interactive either way — this replaces a single
 * section, never the whole route.
 *
 * Retry goes through `router.refresh()`, which re-runs the server render. The
 * failed fetch was never cached, so the refresh genuinely re-attempts it.
 */
export function ProductsUnavailable({
  title = "Unable to load products",
  description = "We couldn't reach the product catalog just now. Everything else on the site still works.",
  className = "",
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-zinc-50/60 px-6 py-16 text-center ${className}`}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={isPending}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
