"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, PackageX, RotateCcw, Save, Search } from "lucide-react";
import { fetchProductsResult, updateProduct } from "@/lib/api";
import {
  matchesSearch,
  pendingChanges,
  saveStockChanges,
  stockSummary,
  type StockDrafts,
} from "@/lib/inventory";
import { revalidateProducts } from "@/lib/revalidate";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { StockBadge } from "@/components/shared/status-badge";

/** The largest quantity the table accepts; keeps a stray extra digit from saving nonsense. */
const MAX_STOCK = 999_999;

type Notice = { tone: "success" | "error"; text: string };

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<StockDrafts>({});
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const load = useCallback(async () => {
    // `fetchProducts` would hand back [] on failure, which reads as an empty
    // warehouse; the result form says whether the backend actually answered.
    const { products: loaded, ok } = await fetchProductsResult();
    setProducts(loaded);
    setLoadFailed(!ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Loads once on mount. The state updates happen after the fetch resolves,
    // not during the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const changes = useMemo(() => pendingChanges(products, drafts), [products, drafts]);
  const { low, out } = useMemo(() => stockSummary(products), [products]);
  const visible = useMemo(() => products.filter((p) => matchesSearch(p, query)), [products, query]);

  // Closing the tab with edits typed but unsaved would lose them silently.
  useEffect(() => {
    if (changes.length === 0) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changes.length]);

  const setDraft = (id: string, stock: number) => {
    setNotice(null);
    setDrafts((current) => ({ ...current, [id]: stock }));
  };

  const discard = () => {
    setDrafts({});
    setRowErrors({});
    setNotice(null);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    setRowErrors({});

    const { saved, failed } = await saveStockChanges(changes, (id, stock) => updateProduct(id, { stock }));

    if (saved.length > 0) {
      const savedStock = new Map(saved.map((change) => [change.id, change.to]));
      setProducts((current) =>
        current.map((p) => (savedStock.has(p._id) ? { ...p, stock: savedStock.get(p._id)! } : p))
      );
      // Saved rows are no longer edits; failed ones keep what was typed.
      setDrafts((current) => Object.fromEntries(Object.entries(current).filter(([id]) => !savedStock.has(id))));
    }
    setRowErrors(Object.fromEntries(failed.map(({ change, message }) => [change.id, message])));

    // The storefront caches products for minutes; flush it so the new counts
    // show on the site now. A failure here doesn't undo the save itself.
    let storefrontStale = false;
    if (saved.length > 0) {
      try {
        await revalidateProducts();
      } catch (error) {
        console.error("Storefront cache flush failed", error);
        storefrontStale = true;
      }
    }

    const unit = (n: number) => `${n} product${n === 1 ? "" : "s"}`;
    if (failed.length === 0) {
      setNotice({
        tone: "success",
        text: storefrontStale
          ? `Saved ${unit(saved.length)}. The storefront may take a few minutes to show the new counts.`
          : `Saved ${unit(saved.length)}. The storefront now shows the new counts.`,
      });
    } else {
      setNotice({
        tone: "error",
        text:
          saved.length > 0
            ? `Saved ${unit(saved.length)}, but ${failed.length} couldn't be saved. They're marked below; your edits are kept.`
            : `Nothing was saved: ${failed[0].message}`,
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Inventory</h1>
          <p className="text-sm text-zinc-500">
            Set the units on hand for each product. Changes reach the storefront when you save.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
            <AlertTriangle aria-hidden className="h-4 w-4 text-amber-600" />
            {low} low in stock
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-800">
            <PackageX aria-hidden className="h-4 w-4 text-red-600" />
            {out} out of stock
          </div>
        </div>
      </div>

      {loadFailed && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>The store backend didn&apos;t answer, so the product list couldn&apos;t be loaded.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              load();
            }}
          >
            Try again
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-72">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU or model"
              aria-label="Search products"
              startIcon={<Search />}
              autoComplete="off"
            />
          </div>
          <div className="flex items-center gap-3">
            <span aria-live="polite" className="text-sm text-zinc-500 tabular-nums">
              {changes.length > 0 ? `${changes.length} unsaved ${changes.length === 1 ? "change" : "changes"}` : ""}
            </span>
            <Button variant="ghost" onClick={discard} disabled={saving || changes.length === 0} startIcon={<RotateCcw />}>
              Discard
            </Button>
            <Button
              onClick={save}
              disabled={changes.length === 0}
              loading={saving}
              loadingText="Saving…"
              startIcon={<Save />}
            >
              Save changes
            </Button>
          </div>
        </div>

        {notice && (
          <p
            role={notice.tone === "error" ? "alert" : "status"}
            className={
              notice.tone === "error"
                ? "border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                : "border-b border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            }
          >
            {notice.text}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Units on hand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {visible.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-zinc-500">
                    {products.length === 0 ? "No products yet." : "No products match your search."}
                  </td>
                </tr>
              )}
              {visible.map((product) => {
                const draft = drafts[product._id];
                const value = draft ?? product.stock;
                const edited = draft !== undefined && draft !== product.stock;
                const error = rowErrors[product._id];

                return (
                  <tr key={product._id} className={edited ? "bg-amber-50/40" : "hover:bg-zinc-50"}>
                    <td className="px-6 py-3">
                      <div className="font-medium text-zinc-900">
                        {product.name}
                        {product.status === false && (
                          <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 align-middle text-xs font-medium text-zinc-600">
                            Disabled
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500">{product.category?.name ?? "Uncategorized"}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-3">
                      <StockBadge stock={value} />
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col items-end gap-1">
                        <QuantityStepper
                          value={value}
                          min={0}
                          max={MAX_STOCK}
                          label={`Units on hand, ${product.name}`}
                          disabled={saving}
                          onChange={(stock) => setDraft(product._id, stock)}
                        />
                        {edited && (
                          <span className="text-xs text-zinc-500 tabular-nums">Was {product.stock}</span>
                        )}
                        {error && (
                          <span role="alert" className="max-w-56 text-right text-xs text-red-700">
                            {error}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
