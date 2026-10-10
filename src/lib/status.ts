/**
 * The one status model for the storefront and admin.
 *
 * Every status maps to a semantic tone, and tones map to colours in exactly one
 * place (the Badge primitive). Pages never pick colours for a status — they
 * render <StockBadge> / <OrderStatusBadge>, or read `.tone` here.
 */

export type Tone = "success" | "warning" | "info" | "danger" | "neutral";

/* ─── Stock ─────────────────────────────────────────────────────────────── */

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

/** At or below this many units a product shows as Low Stock. */
export const LOW_STOCK_THRESHOLD = 10;

export const STOCK_META: Record<StockState, { label: string; tone: Tone }> = {
  "in-stock": { label: "In Stock", tone: "success" },
  "low-stock": { label: "Low Stock", tone: "warning" },
  "out-of-stock": { label: "Out of Stock", tone: "danger" },
};

export function stockState(stock: number): StockState {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

/* ─── Enquiries ─────────────────────────────────────────────────────────── */

/** The backend's enquiry status values (RFID-BACKEND Enquiry model enum). */
export const ENQUIRY_STATUSES = ["New", "Contacted", "Closed"] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_META: Record<EnquiryStatus, { label: string; tone: Tone }> = {
  New: { label: "New", tone: "info" },
  Contacted: { label: "Contacted", tone: "warning" },
  Closed: { label: "Closed", tone: "success" },
};

/** Unrecognised values render neutral with their own text rather than disappearing. */
export function enquiryStatusMeta(status: string | null | undefined): { label: string; tone: Tone } {
  const match = ENQUIRY_STATUSES.find((s) => s === status);
  return match ? ENQUIRY_STATUS_META[match] : { label: status || "Unknown", tone: "neutral" };
}

/* ─── Orders ────────────────────────────────────────────────────────────── */

/** The backend's order status values (RFID-BACKEND Order model enum). */
export const ORDER_STATUSES = [
  "Pending Payment",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_META: Record<OrderStatus, { label: string; tone: Tone }> = {
  "Pending Payment": { label: "Pending", tone: "neutral" },
  Processing: { label: "Processing", tone: "warning" },
  Shipped: { label: "Shipped", tone: "info" },
  Delivered: { label: "Delivered", tone: "success" },
  Cancelled: { label: "Cancelled", tone: "danger" },
};

/**
 * The backend stores Title Case ("Shipped", "Pending Payment"); older records
 * and query params sometimes arrive lowercase or as plain "Pending". Anything
 * unrecognised renders neutral with its own text rather than disappearing.
 */
export function orderStatusMeta(status: string | null | undefined): { label: string; tone: Tone } {
  const wanted = status?.trim().toLowerCase();
  const match = ORDER_STATUSES.find((s) => s.toLowerCase() === wanted || (wanted === "pending" && s === "Pending Payment"));
  return match ? ORDER_STATUS_META[match] : { label: status || "Unknown", tone: "neutral" };
}
