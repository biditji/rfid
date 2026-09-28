import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BACKEND_ORIGIN } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
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

export function getStockStatus(stock: number): {
  label: string;
  color: string;
} {
  if (stock === 0) return { label: "Out of Stock", color: "red" };
  if (stock <= 10) return { label: "Low Stock", color: "amber" };
  return { label: "In Stock", color: "emerald" };
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
