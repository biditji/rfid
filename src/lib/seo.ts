import type { Metadata } from "next";

export const SITE_NAME = "Virtualsphere";

/** Homepage title. Carries the brand itself, so it is used with `absolute`. */
export const HOME_TITLE = `RFID Readers, Tags & Antennas in India | ${SITE_NAME}`;

/** Social-card fields every page repeats: a page's `openGraph` replaces the layout's, it isn't merged. */
export const OPEN_GRAPH_DEFAULTS = {
  type: "website",
  locale: "en_US",
  siteName: SITE_NAME,
} as const;

/** A trailing "| Virtualsphere" or "- Virtualsphere", however many times it was pasted in. */
const TRAILING_BRAND = new RegExp(`(?:(?:\\s*\\|\\s*|\\s+[-–—]\\s+)${SITE_NAME})+\\s*$`, "i");

/**
 * A title without the brand suffix. The root layout's title template adds
 * "| Virtualsphere" to every page title, so a stored title that already ends
 * with it (admin-entered, or a hard-coded string) would show the brand twice.
 */
export const stripBrand = (title: string) => title.replace(TRAILING_BRAND, "").trim();

/**
 * A product name fit for the page's <h1> and every card and cart line that
 * repeats it. Names pasted in from the SEO title arrive as "Name | Virtualsphere"
 * or "Name | Chip": a heading carries no brand suffix, and a pipe is a title
 * separator rather than part of the name, so any that remain become a dash.
 */
export function cleanProductName(name: string): string {
  const cleaned = stripBrand(name)
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" – ");
  // A name that is nothing but brand and pipes still shows something.
  return cleaned || name.trim();
}

type PageSeo = {
  /** Without the brand, which the layout's template appends — unless `absolute`. */
  title: string;
  /** Use `title` exactly as given, skipping the template. For titles that already carry the brand. */
  absolute?: boolean;
  description?: string;
  /** Path of this page's canonical URL, resolved against `metadataBase`. */
  path: string;
  /** Absolute image URLs for the social card. */
  images?: string[];
};

/**
 * Title, description, canonical URL and social tags for one page, kept in step.
 *
 * The social title is spelled out in full because the layout's `title.template`
 * only applies to the `<title>` tag.
 */
export function pageMetadata({ title, absolute = false, description, path, images = [] }: PageSeo): Metadata {
  const socialTitle = absolute ? title : `${title} | ${SITE_NAME}`;

  return {
    title: absolute ? { absolute: title } : title,
    ...(description ? { description } : {}),
    alternates: { canonical: path },
    openGraph: {
      ...OPEN_GRAPH_DEFAULTS,
      title: socialTitle,
      ...(description ? { description } : {}),
      url: path,
      images: images.map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      ...(description ? { description } : {}),
      images,
    },
  };
}
