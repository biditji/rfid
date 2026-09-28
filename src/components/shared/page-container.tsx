import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

const widths = {
  /** The storefront's content boundary. */
  default: "max-w-7xl",
  /** Media and showcase sections that should run wider than text. */
  wide: "max-w-[90rem]",
  /** Long-form reading: policies, prose. */
  narrow: "max-w-3xl",
} as const;

type PageContainerProps<T extends ElementType> = {
  as?: T;
  size?: keyof typeof widths;
} & Omit<ComponentProps<T>, "as">;

/**
 * The global horizontal boundary: max width plus the responsive side gutter.
 * Sections own their vertical rhythm and backgrounds; a section that wants to
 * go full-bleed simply puts its background outside the container.
 */
export function PageContainer<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...props
}: PageContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return <Component className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", widths[size], className)} {...props} />;
}
