import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"
import { BACKEND_ORIGIN } from "./config"

/**
 * tailwind-merge only knows Tailwind's default scale. Without these, it reads
 * `text-h2` as a colour and silently drops it when a `text-foreground` follows,
 * and never dedupes `rounded-card` against `rounded-full`. Keep in step with
 * the @theme block in globals.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display", "h1", "h2", "h3", "lead", "body", "small", "meta", "tech"],
      radius: ["control", "card"],
      shadow: ["card", "raised", "overlay"],
      ease: ["standard", "emphasized"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Rupees. Whole-rupee prices drop the ".00" — hardware is priced in rupees,
 * and the paise only add noise to a price list.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Short rupee amounts for chart axes, e.g. "₹52.3K". */
export function formatCurrencyCompact(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** "+12.5%" / "-3.0%" for a percentage change. */
export function formatPercentChange(change: number): string {
  return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

/**
 * Strip HTML tags from a string, returning plain text.
 * Useful for showing rich-text descriptions as excerpts.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export function getServerUrl(path: string): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith('http')) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}
