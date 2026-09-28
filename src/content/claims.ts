/**
 * ⚠ UNVERIFIED CLAIMS — REVIEW BEFORE LAUNCH
 *
 * Every statement in this file was carried over verbatim from the previous
 * storefront. None of it can be confirmed from the catalogue, the backend or
 * anything else in this codebase, and some of it conflicts with facts that can
 * be (the company is in Noida and prices in INR, but the copy mentions
 * warehouses in Austin/Rotterdam/Singapore and FCC/IC certification).
 *
 * It is kept — not deleted, not rewritten — so the redesign doesn't change what
 * the business claims. Someone who can verify each item should confirm it,
 * correct it, or delete it; the page sections that read from here render
 * whatever is left and hide themselves when a list is empty.
 */

/**
 * Customer logos. Shown in: home → proof strip.
 * Three are hotlinked from Wikimedia Commons and are other companies'
 * trademarks — only show brands you have permission to name as customers.
 */
export const CUSTOMER_LOGOS: { name: string; src: string; width: number; height: number }[] = [
  { name: "Bhoomika", src: "/bhoomika.png", width: 225, height: 225 },
  {
    name: "DHL",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/1280px-DHL_Logo.svg.png",
    width: 1280,
    height: 180,
  },
  { name: "GD Goenka School", src: "/gdgoenka.png", width: 800, height: 311 },
  {
    name: "Coca-Cola",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1280px-Coca-Cola_logo.svg.png",
    width: 1280,
    height: 420,
  },
  {
    name: "Sony",
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1280px-Sony_logo.svg.png",
    width: 1280,
    height: 227,
  },
];

/**
 * Headline figures. Shown in: home → proof strip.
 * "98.5% uptime SLA" is also unclear for a hardware supplier (uptime of what?)
 * and implies ~5.5 days of downtime a year.
 */
export const HEADLINE_STATS: { value: string; label: string }[] = [
  { value: "12K+", label: "Products shipped" },
  { value: "98.5%", label: "Uptime SLA" },
  { value: "24hr", label: "Avg. ship time" },
  { value: "99.9%", label: "Read accuracy" },
];

/** Shown in: footer, under the logo. */
export const FOOTER_TRUST_LINE = "Trusted by 500+ companies worldwide.";

/**
 * "Why Virtualsphere" reasons. Shown in: home → why section.
 * Flagged: the 99.9% figure; EPC Gen2v2 / ISO 18000-63 / FCC / CE / IC
 * certification across *all* products; warehouse cities; same-day dispatch.
 */
export const WHY_REASONS: { title: string; description: string }[] = [
  {
    title: "99.9% read accuracy",
    description:
      "Enterprise-grade hardware delivers consistent, reliable reads across challenging environments — from dense warehouses to retail floors.",
  },
  {
    title: "Certified & compliant",
    description:
      "All products meet EPC Gen2v2, ISO 18000-63, and regional regulatory standards. FCC, CE, and IC certified.",
  },
  {
    title: "Expert support",
    description:
      "Our engineering team provides deployment planning, integration support, and troubleshooting. Not a chatbot — real RFID engineers.",
  },
  {
    title: "Global supply chain",
    description:
      "Warehouses in Austin, Rotterdam, and Singapore. Same-day dispatch on in-stock items. Volume pricing for enterprise accounts.",
  },
];

/**
 * Per-industry outcome figures. Shown in: home → industries.
 * Flagged: every percentage (98%, 55%, 99.9%, 70%) and "IP68/IP69K" (the
 * catalogue's tags list IP67/IP68 — none list IP69K).
 */
export const INDUSTRY_OUTCOMES: Record<"retail" | "logistics" | "healthcare" | "manufacturing", string[]> = {
  retail: [
    "Real-time inventory accuracy above 98%",
    "Automated replenishment triggers",
    "Self-checkout and fitting room insights",
    "Shrinkage reduction by up to 55%",
  ],
  logistics: [
    "99.9% shipping accuracy",
    "70% faster receiving processes",
    "Automated pallet and case tracking",
    "Integration with WMS platforms",
  ],
  healthcare: [
    "Instrument tray tracking and sterilization logs",
    "Drug serialization compliance",
    "Real-time asset location within facilities",
    "Patient safety through positive ID",
  ],
  manufacturing: [
    "WIP tracking through every production stage",
    "Tool and die management",
    "Returnable container and asset tracking",
    "IP68/IP69K rated tags for harsh environments",
  ],
};

/**
 * Support hours. Shown in: contact page.
 * Flagged: given in "CT" (US Central Time) for a Noida office.
 */
export const SUPPORT_HOURS: { days: string; hours: string }[] = [
  { days: "Monday – Friday", hours: "8:00 AM – 6:00 PM CT" },
  { days: "Saturday", hours: "9:00 AM – 1:00 PM CT" },
];
