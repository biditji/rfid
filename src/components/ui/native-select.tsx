import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { fieldClasses } from "./input"

/**
 * A styled native <select>. Preferred over the popover Select for simple
 * single-choice fields (sort order, form subjects): it gets the platform
 * picker on phones and full keyboard/screen-reader support for free.
 */
function NativeSelect({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"select"> & { containerClassName?: string }) {
  return (
    <div className={cn("relative", containerClassName)}>
      <select
        data-slot="native-select"
        className={cn(fieldClasses, "h-10 cursor-pointer appearance-none pr-9 pl-3", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export { NativeSelect }
