import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small uppercase label above a heading, led by a short brand-red rule — the
 * underline from the logo. This rule is the brand accent's main job.
 */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-meta text-muted-foreground uppercase", className)}>
      <span aria-hidden className="h-0.5 w-6 shrink-0 bg-brand" />
      {children}
    </p>
  );
}

/**
 * The one "go further" link: View all, Explore the catalog, Browse category.
 * Always this weight, this colour, this arrow — whatever the words.
 */
export function ActionLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/action inline-flex items-center gap-2 text-small font-medium text-foreground underline decoration-border-strong underline-offset-[6px] transition-[text-decoration-color] hover:decoration-foreground",
        className
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover/action:translate-x-0.5 motion-reduce:transition-none"
      />
    </Link>
  );
}

type SectionHeaderProps = {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Usually an <ActionLink>. Sits bottom-right on wide screens. */
  action?: ReactNode;
  /** Page titles use h1; everything else is a section h2. */
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/**
 * Standard section opening: eyebrow → title → description, with an optional
 * action aligned to the baseline on the right. Description width is capped so
 * lines stay readable no matter how wide the section is.
 */
export function SectionHeader({
  title,
  eyebrow,
  description,
  action,
  as: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <Heading id={id} className={cn("text-balance", Heading === "h1" ? "text-h1" : "text-h2")}>
          {title}
        </Heading>
        {description && (
          <p className="mt-4 max-w-xl text-lead text-pretty text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0 md:pb-1.5">{action}</div>}
    </div>
  );
}
