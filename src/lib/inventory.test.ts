import { describe, expect, it, vi } from "vitest";
import type { Product } from "@/types";
import { matchesSearch, pendingChanges, saveStockChanges, stockSummary } from "./inventory";

const product = (over: Partial<Product>): Product =>
  ({
    _id: "p1",
    name: "UDM9A Desktop Reader",
    sku: "VS-UDM9A",
    model: "UDM9A",
    stock: 20,
    category: { _id: "c1", name: "UHF Desktop Reader" },
    ...over,
  }) as Product;

describe("pendingChanges", () => {
  const products = [product({ _id: "a", stock: 5 }), product({ _id: "b", stock: 9 }), product({ _id: "c", stock: 0 })];

  it("lists only products whose draft differs from saved stock", () => {
    const changes = pendingChanges(products, { a: 5, b: 12, c: 0 });
    expect(changes).toEqual([{ id: "b", name: "UDM9A Desktop Reader", from: 9, to: 12 }]);
  });

  it("treats a draft of 0 as a real change, not as 'no draft'", () => {
    expect(pendingChanges(products, { a: 0 })).toEqual([
      { id: "a", name: "UDM9A Desktop Reader", from: 5, to: 0 },
    ]);
  });

  it("ignores drafts for products no longer in the list", () => {
    expect(pendingChanges(products, { gone: 4 })).toEqual([]);
  });
});

describe("stockSummary", () => {
  it("counts low and sold-out products with the same thresholds as the stock badge", () => {
    const products = [0, 1, 10, 11, 200].map((stock, i) => product({ _id: String(i), stock }));
    expect(stockSummary(products)).toEqual({ low: 2, out: 1 });
  });
});

describe("matchesSearch", () => {
  const p = product({});

  it("matches name, SKU, model and category regardless of case", () => {
    for (const query of ["udm9a desktop", "vs-udm", "UDM9A", "uhf desktop"]) {
      expect(matchesSearch(p, query)).toBe(true);
    }
  });

  it("matches everything for a blank query and nothing for a stranger", () => {
    expect(matchesSearch(p, "   ")).toBe(true);
    expect(matchesSearch(p, "antenna")).toBe(false);
  });

  it("copes with a product whose category was deleted", () => {
    expect(matchesSearch(product({ category: null }), "reader")).toBe(true);
    expect(matchesSearch(product({ category: null, name: "Tag" , model: "T", sku: "S"}), "reader")).toBe(false);
  });
});

describe("saveStockChanges", () => {
  const change = (id: string, to: number) => ({ id, name: id, from: 1, to });

  it("saves every change and reports them", async () => {
    const update = vi.fn().mockResolvedValue({});
    const outcome = await saveStockChanges([change("a", 3), change("b", 4)], update);
    expect(update).toHaveBeenCalledWith("a", 3);
    expect(update).toHaveBeenCalledWith("b", 4);
    expect(outcome.saved).toHaveLength(2);
    expect(outcome.failed).toEqual([]);
  });

  it("keeps going after a failure and reports the backend's message for that row", async () => {
    const update = vi.fn(async (id: string) => {
      if (id === "b") throw new Error("Not authorized as an admin");
    });
    const outcome = await saveStockChanges([change("a", 3), change("b", 4), change("c", 5)], update);
    expect(outcome.saved.map((c) => c.id).sort()).toEqual(["a", "c"]);
    expect(outcome.failed).toEqual([{ change: change("b", 4), message: "Not authorized as an admin" }]);
  });

  it("never runs more than `concurrency` requests at once", async () => {
    let active = 0;
    let peak = 0;
    const update = async () => {
      peak = Math.max(peak, ++active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active--;
    };
    const many = Array.from({ length: 12 }, (_, i) => change(String(i), i));
    await saveStockChanges(many, update, 3);
    expect(peak).toBe(3);
  });

  it("does nothing for an empty list", async () => {
    const update = vi.fn();
    expect(await saveStockChanges([], update)).toEqual({ saved: [], failed: [] });
    expect(update).not.toHaveBeenCalled();
  });
});
