import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Reveal } from "@/components/shared/reveal";
import { WHY_REASONS } from "@/content/claims";

/**
 * Why Virtualsphere: an editorial statement on the left, the reasons as a
 * numbered list on the right — type and hairlines, no cards or icons.
 * Reasons come from content/claims.ts (flagged for verification).
 */
export function WhySection() {
  return (
    <section aria-labelledby="why-title" className="py-20 lg:py-28">
      <PageContainer className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>Why Virtualsphere</Eyebrow>
          <h2 id="why-title" className="mt-4 text-h2 text-balance">
            We&apos;re not a marketplace.
          </h2>
          <p className="mt-6 max-w-md text-lead text-pretty text-muted-foreground">
            We&apos;re a focused RFID supplier with deep product knowledge and enterprise support.
          </p>
        </div>

        {WHY_REASONS.length > 0 && (
          <Reveal as="ol" className="border-t border-border lg:col-span-7">
            {WHY_REASONS.map((reason, i) => (
              <li
                key={reason.title}
                data-reveal
                className="grid grid-cols-1 gap-2 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:gap-6"
              >
                <span className="text-meta text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h3">{reason.title}</h3>
                  <p className="mt-2 max-w-xl text-body text-pretty text-muted-foreground">{reason.description}</p>
                </div>
              </li>
            ))}
          </Reveal>
        )}
      </PageContainer>
    </section>
  );
}
