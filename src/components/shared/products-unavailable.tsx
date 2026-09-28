"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "bg-grid flex flex-col items-start justify-center rounded-card border border-border bg-surface px-6 py-12 sm:px-10",
        className
      )}
      role="alert"
    >
      <p className="flex items-center gap-2 text-meta text-warning uppercase">
        <span aria-hidden className="size-1.5 rounded-full bg-warning" />
        Catalog offline
      </p>
      <h3 className="mt-3 text-h3">{title}</h3>
      <p className="mt-2 max-w-md text-small text-muted-foreground">{description}</p>
      <Button
        className="mt-6"
        onClick={() => startTransition(() => router.refresh())}
        loading={isPending}
        loadingText="Retrying…"
        startIcon={<RefreshCw />}
      >
        Retry
      </Button>
    </div>
  );
}
