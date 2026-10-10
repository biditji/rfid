export type Testimonial = {
  /** The customer's own words, quoted exactly as they gave them. */
  quote: string;
  name: string;
  /** Job title, e.g. "Warehouse manager". */
  role?: string;
  company: string;
  /** Whole stars out of five, if the customer gave a rating. */
  rating?: 1 | 2 | 3 | 4 | 5;
  /** Where the quote is published, e.g. "Google reviews" — with `sourceUrl`, it links there. */
  sourceLabel?: string;
  sourceUrl?: string;
};

/**
 * Customer testimonials. Shown in: home → testimonials.
 *
 * ⚠ ADD REAL ONES — this list is deliberately empty. Quotes, names and ratings
 * must be real and used with the customer's permission; made-up reviews on a
 * shop page are misleading advertising under Indian consumer law. While the
 * list is empty the whole section stays hidden, so nothing shows until you add
 * your first entry. Copy this shape (it is the same for every entry):
 *
 *   {
 *     quote: "What the customer actually said.",
 *     name: "Their name",
 *     role: "Their job title",
 *     company: "Their company",
 *     rating: 5,
 *     sourceLabel: "Google reviews",
 *     sourceUrl: "https://…",
 *   },
 *
 * One to three entries read best; the layout adapts to the count.
 */
export const TESTIMONIALS: Testimonial[] = [];
