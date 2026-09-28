import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Closing call to action on the inverse surface: the ask on the left, the
 * ways to reach a person on the right. Static — the page's last word
 * shouldn't be an animation.
 */
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="surface-inverse">
      <PageContainer className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-7">
          <Eyebrow>Start a project</Eyebrow>
          <h2 id="cta-title" className="mt-5 text-h1 text-balance">
            Ready to modernize your inventory operations?
          </h2>
          <p className="mt-6 max-w-xl text-lead text-pretty text-muted-foreground">
            Talk to our team about your requirements. We&apos;ll help you scope the right hardware, plan your
            deployment, and get you up and running.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="lg" endIcon={<ArrowRight />}>
              Request a quote
            </ButtonLink>
            <ButtonLink href="/products" size="lg" variant="outline">
              Browse the catalog
            </ButtonLink>
          </div>
        </div>

        <dl className="self-end border-t border-border lg:col-span-5 lg:col-start-8">
          <ContactRow label="Call">
            <a href={`tel:${SITE_CONFIG.phone}`} className="text-small tabular-nums hover:underline">
              {SITE_CONFIG.phone}
            </a>
          </ContactRow>
          <ContactRow label="Email">
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-small break-all hover:underline">
              {SITE_CONFIG.email}
            </a>
          </ContactRow>
          <ContactRow label="Visit">
            <span className="text-small">
              {SITE_CONFIG.address.street}, {SITE_CONFIG.address.city} {SITE_CONFIG.address.zip}
            </span>
          </ContactRow>
        </dl>
      </PageContainer>
    </section>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] items-baseline gap-4 border-b border-border py-4">
      <dt className="text-meta text-muted-foreground uppercase">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
