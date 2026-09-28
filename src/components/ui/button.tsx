import type { ComponentProps, ReactNode } from "react"
import Link from "next/link"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * One button language for the whole product.
 *
 *   primary      the single most important action in a view (near-black)
 *   secondary    supporting actions on light surfaces
 *   outline      the alternative to a primary sitting beside it
 *   ghost        low-emphasis actions in toolbars and lists
 *   destructive  irreversible actions
 *   link         inline text actions
 *
 * Sizes are real control heights: sm 32 · md 40 · lg 48 · xl 56. Primary is
 * the same everywhere — inside a `.surface-inverse` section the tokens flip it
 * to light-on-dark, so there is never a second primary colour.
 *
 * Focus uses the global :focus-visible outline in globals.css.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-control border border-transparent font-medium whitespace-nowrap select-none transition-[background-color,border-color,color,transform] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-busy:cursor-progress aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklab,var(--secondary),var(--foreground)_7%)]",
        outline:
          "border-border-strong bg-transparent text-foreground hover:border-foreground aria-expanded:border-foreground",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/90",
        link: "h-auto! border-0 px-0! text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-small [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10 px-4 text-small [&_svg:not([class*='size-'])]:size-4",
        lg: "h-12 px-5 text-body [&_svg:not([class*='size-'])]:size-4",
        xl: "h-14 px-7 text-body [&_svg:not([class*='size-'])]:size-5",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        "icon-lg": "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

type IconProps = {
  /** Icon before the label. Replaced by a spinner while `loading`. */
  startIcon?: ReactNode
  /** Icon after the label — typically an arrow on navigational CTAs. */
  endIcon?: ReactNode
}

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> &
  IconProps & {
    /** Shows a spinner, blocks clicks and sets aria-busy; focus stays put. */
    loading?: boolean
    /** Label to show while loading, e.g. "Adding…". Defaults to `children`. */
    loadingText?: ReactNode
  }

function Button({
  className,
  variant,
  size,
  loading = false,
  loadingText,
  startIcon,
  endIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      // Keep keyboard focus on the button while it's busy, rather than
      // dropping it to <body> the moment it becomes disabled.
      focusableWhenDisabled={loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden className="animate-spin" /> : startIcon}
      {loading && loadingText ? loadingText : children}
      {!loading && endIcon}
    </ButtonPrimitive>
  )
}

type ButtonLinkProps = ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> &
  IconProps

/**
 * A navigation link that looks like a Button. Use it (not <Link><Button/>)
 * whenever a CTA goes somewhere, so there's one focusable element with link
 * semantics.
 */
function ButtonLink({ className, variant, size, startIcon, endIcon, children, ...props }: ButtonLinkProps) {
  return (
    <Link data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </Link>
  )
}

export { Button, ButtonLink, buttonVariants }
export type { ButtonProps }
