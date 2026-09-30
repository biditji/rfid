import type { Product } from "@/types";
import { stockState } from "./status";

/** Unsaved quantities typed into the inventory table, keyed by product id. */
export type StockDrafts = Record<string, number>;

export type StockChange = { id: string; name: string; from: number; to: number };

/** Every product whose typed quantity differs from what is saved. */
export function pendingChanges(products: Product[], drafts: StockDrafts): StockChange[] {
  return products.flatMap((product) => {
    const draft = drafts[product._id];
    return draft !== undefined && draft !== product.stock
      ? [{ id: product._id, name: product.name, from: product.stock, to: draft }]
      : [];
  });
}

/** How many products are running low and how many are sold out, on saved stock. */
export function stockSummary(products: Product[]): { low: number; out: number } {
  let low = 0;
  let out = 0;
  for (const { stock } of products) {
    const state = stockState(stock);
    if (state === "low-stock") low++;
    if (state === "out-of-stock") out++;
  }
  return { low, out };
}

/** Case-insensitive match on the fields an admin looks products up by. */
export function matchesSearch(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [product.name, product.sku, product.model, product.category?.name].some((field) =>
    field?.toLowerCase().includes(needle)
  );
}

export type SaveOutcome = {
  saved: StockChange[];
  failed: { change: StockChange; message: string }[];
};

/**
 * Persist each change with `update`, a few at a time. One failure never stops
 * the rest, so a bad row can't lose the others' edits; the caller gets back
 * exactly which rows landed and which didn't.
 *
 * The limit keeps a save of the whole catalog from opening dozens of
 * simultaneous requests against a small shared-hosting backend.
 */
export async function saveStockChanges(
  changes: StockChange[],
  update: (id: string, stock: number) => Promise<unknown>,
  concurrency = 4
): Promise<SaveOutcome> {
  const outcome: SaveOutcome = { saved: [], failed: [] };
  let next = 0;

  const worker = async () => {
    while (next < changes.length) {
      const change = changes[next++];
      try {
        await update(change.id, change.to);
        outcome.saved.push(change);
      } catch (error) {
        outcome.failed.push({
          change,
          message: error instanceof Error && error.message ? error.message : "Couldn't save this change",
        });
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, changes.length) }, worker));
  return outcome;
}
