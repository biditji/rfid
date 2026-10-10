import type { ReactNode } from "react";
import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { POLICY_LINKS } from "@/lib/constants";

const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

type PolicyPageProps = {
  title: string;
  /** This page's own path, so it is left out of the "other policies" list. */
  path: string;
  /** ISO date the policy last changed. Omit it where the date isn't known. */
  updated?: string;
  children: ReactNode;
};

/**
 * Shell for the legal pages: a narrow reading column, the title, an optional
 * "last updated" line, the body, and links to the sibling policies.
 */
export function PolicyPage({ title, path, updated, children }: PolicyPageProps) {
  return (
    <div className="pt-10 pb-20 lg:pt-14">
      <PageContainer size="narrow">
        <h1 className="text-h1 text-balance">{title}</h1>
        {updated && (
          <p className="mt-4 text-small text-muted-foreground">
            Last updated <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time>
          </p>
        )}
        <div className="mt-10 space-y-6 text-body text-pretty text-muted-foreground">{children}</div>

        <nav aria-label="Other policies" className="mt-16 border-t border-border pt-8">
          <h2 className="text-meta text-foreground uppercase">Other policies</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
            {POLICY_LINKS.filter((link) => link.href !== path).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-small text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </PageContainer>
    </div>
  );
}

/** A titled block of a policy. The heading is the page's only h2 level. */
export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="mt-12 text-h3 text-foreground">{title}</h2>
      {children}
    </section>
  );
}

/** Bulleted list in the style the terms and privacy pages already use. */
export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-border-strong">{children}</ul>;
}

/** A hairline label → value table for the figures a reader scans for (days, hours, fees). */
export function PolicyFacts({ items }: { items: readonly { label: string; value: ReactNode }[] }) {
  return (
    <dl className="border-t border-border text-small">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-1 gap-1 border-b border-border py-3 sm:grid-cols-[14rem_1fr] sm:gap-6"
        >
          <dt className="text-muted-foreground">{item.label}</dt>
          <dd className="font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
