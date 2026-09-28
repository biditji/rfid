/**
 * Catalog listing options shared by the server page (which seeds state from
 * the URL) and the client listing (which writes it back).
 */
export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Name: A to Z", value: "name-asc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const isSortValue = (value: unknown): value is SortValue =>
  SORT_OPTIONS.some((option) => option.value === value);
