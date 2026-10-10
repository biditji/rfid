import { Star } from "lucide-react";
import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { Reveal } from "@/components/shared/reveal";
import { TESTIMONIALS, type Testimonial } from "@/content/testimonials";
import { cn } from "@/lib/utils";

/**
 * Testimonials: what customers said, as plain quotes between hairlines — the
 * same type-and-rules language as the proof strip above it. Entries come from
 * content/testimonials.ts, and the section hides itself while that list is empty.
 */
export function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) return null;

  const single = TESTIMONIALS.length === 1;

  return (
    <section aria-labelledby="testimonials-title" className="border-b border-border py-20 lg:py-28">
      <PageContainer className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 id="testimonials-title" className="mt-4 text-h2 text-balance">
            What customers say
          </h2>
        </div>

        <Reveal
          as="ul"
          className={cn(
            "grid grid-cols-1 border-t border-border lg:col-span-8",
            !single && "md:grid-cols-2 md:border-l"
          )}
        >
          {TESTIMONIALS.map((testimonial, i) => (
            <li
              key={`${testimonial.company}-${testimonial.name}`}
              data-reveal
              className={cn(
                "border-b border-border py-8",
                !single && "md:border-r md:px-8",
                // An odd one out fills its row rather than leaving an empty cell.
                !single && i === TESTIMONIALS.length - 1 && i % 2 === 0 && "md:col-span-2"
              )}
            >
              <Quote testimonial={testimonial} large={single} />
            </li>
          ))}
        </Reveal>
      </PageContainer>
    </section>
  );
}

function Quote({ testimonial, large }: { testimonial: Testimonial; large: boolean }) {
  const { quote, name, role, company, rating, sourceLabel, sourceUrl } = testimonial;

  return (
    <figure className="flex h-full flex-col gap-6">
      {rating && (
        <div role="img" aria-label={`Rated ${rating} out of 5`} className="flex gap-0.5">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              aria-hidden
              className={cn("size-4", i < rating ? "fill-foreground text-foreground" : "text-border-strong")}
            />
          ))}
        </div>
      )}

      <blockquote className={cn("text-pretty", large ? "text-h3 sm:text-h2" : "text-lead")}>
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-auto text-small">
        <span className="block font-medium text-foreground">{name}</span>
        <span className="block text-muted-foreground">{[role, company].filter(Boolean).join(", ")}</span>
        {sourceLabel &&
          (sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-meta text-muted-foreground uppercase underline decoration-border-strong underline-offset-4 hover:text-foreground"
            >
              {sourceLabel}
            </a>
          ) : (
            <span className="mt-2 block text-meta text-muted-foreground uppercase">{sourceLabel}</span>
          ))}
      </figcaption>
    </figure>
  );
}
