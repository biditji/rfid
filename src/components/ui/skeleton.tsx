import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

/**
 * Loading placeholder. A slow, shallow pulse on the muted surface — present
 * enough to read as "loading", quiet enough not to pull the eye. Size it with
 * utility classes to match the content it stands in for, so nothing shifts
 * when the real content arrives.
 */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn("animate-skeleton rounded-control bg-muted motion-reduce:animate-none", className)}
      {...props}
    />
  )
}

export { Skeleton }
