import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Shared field styling for Input, Textarea and NativeSelect, so every form
 * control has the same border, radius, focus and invalid states.
 *
 * 16px text below `md` stops iOS Safari zooming into a focused field.
 */
const fieldClasses =
  "w-full min-w-0 rounded-control border border-input bg-background text-body text-foreground transition-colors outline-none placeholder:text-muted-foreground hover:border-foreground/60 focus-visible:border-foreground disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-danger md:text-small"

const inputVariants = cva(fieldClasses, {
  variants: {
    size: {
      md: "h-10 px-3",
      lg: "h-12 px-4",
    },
  },
  defaultVariants: { size: "md" },
})

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants> & {
    /** Decorative icon inside the leading edge (e.g. a search glass). */
    startIcon?: React.ReactNode
    /** Classes for the wrapper that holds the icon, when there is one. */
    containerClassName?: string
  }

function Input({ className, type, size, startIcon, containerClassName, ...props }: InputProps) {
  const input = (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), startIcon && (size === "lg" ? "pl-11" : "pl-9"), className)}
      {...props}
    />
  )

  if (!startIcon) return input

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4",
          size === "lg" ? "left-4" : "left-3"
        )}
      >
        {startIcon}
      </span>
      {input}
    </div>
  )
}

export { Input, fieldClasses }
