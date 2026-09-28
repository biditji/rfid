import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Compact status / metadata tag.
 *
 * Tones are semantic and this is the only place they become colours. A badge
 * is a small square-cornered label — the optional dot is the status indicator,
 * so the badge itself never needs to be a pill.
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-control border border-transparent font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        info: "bg-info/10 text-info",
        danger: "bg-danger/10 text-danger",
        brand: "bg-brand/10 text-brand",
        outline: "border-border-strong text-muted-foreground",
      },
      size: {
        sm: "h-5 px-1.5 text-meta tracking-normal",
        md: "h-6 px-2 text-small leading-none",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "sm",
    },
  }
)

const dotTone: Record<NonNullable<VariantProps<typeof badgeVariants>["tone"]>, string> = {
  neutral: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  danger: "bg-danger",
  brand: "bg-brand",
  outline: "bg-muted-foreground",
}

type BadgeProps = ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** Leading status dot in the badge's tone. */
    dot?: boolean
  }

function Badge({ className, tone, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot && <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", dotTone[tone ?? "neutral"])} />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
