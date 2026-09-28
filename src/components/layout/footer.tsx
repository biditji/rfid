import Link from "next/link";
import { SITE_CONFIG, NAV_ITEMS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { PageContainer } from "@/components/shared/page-container";
import { FOOTER_TRUST_LINE } from "@/content/claims";

const linkClass = "text-small text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <PageContainer className="py-14 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block" aria-label="Virtualsphere Technologies — home">
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
              <img src="/logo.png" alt="" width={1024} height={216} className="h-8 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-small text-pretty text-muted-foreground">
              RFID readers, antennas and tags for inventory and asset tracking. {FOOTER_TRUST_LINE}
            </p>
          </div>

          <nav aria-label="Product categories" className="lg:col-span-3">
            <FooterHeading>Products</FooterHeading>
            <ul className="mt-5 space-y-3">
              {PRODUCT_CATEGORIES.map((item) => (
                <li key={item}>
                  <Link href={`/products?category=${slugify(item)}`} className={linkClass}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <FooterHeading>Company</FooterHeading>
            <ul className="mt-5 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <FooterHeading>Contact</FooterHeading>
            <address className="mt-5 space-y-3 not-italic">
              <p>
                <a href={SITE_CONFIG.mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.zip}
                </a>
              </p>
              <p>
                <a href={`tel:${SITE_CONFIG.phone}`} className={`${linkClass} tabular-nums`}>
                  {SITE_CONFIG.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE_CONFIG.email}`} className={`${linkClass} break-all`}>
                  {SITE_CONFIG.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-muted-foreground">
            © {new Date().getFullYear()} Virtualsphere Technologies Pvt Ltd
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className={linkClass}>
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkClass}>
                Terms &amp; conditions
              </Link>
            </li>
          </ul>
        </div>
      </PageContainer>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-meta text-foreground uppercase">{children}</h2>;
}
