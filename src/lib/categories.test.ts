import { describe, expect, it } from "vitest";
import {
  buildCategoryTree,
  categoryOptions,
  categoryParam,
  resolveCategory,
  storefrontCategories,
} from "./categories";
import type { Category } from "@/types";

let nextId = 0;
const category = (name: string, extra: Partial<Category> = {}): Category => ({
  _id: `c${++nextId}`,
  name,
  sortOrder: 0,
  status: true,
  createdAt: "",
  updatedAt: "",
  productCount: 0,
  ...extra,
});

// Mirrors the production tree, typos in admin-entered slugs included.
const readers = category("RFID Readers", { slug: "rfid-reader" });
const hf = category("RFID HF Reader", { slug: "rfid-hf-readers", parent: { _id: readers._id, name: readers.name }, productCount: 5 });
const multi = category("RFID Multi Port Reader", { slug: "RFID-Multi-Port-Reader", parent: { _id: readers._id, name: readers.name }, productCount: 2 });
const antenna = category("RFID Antenna", { slug: "raid-antenna", productCount: 5 });
const cards = category("RFID Cards", { slug: "rfid-cards" });
const tree = buildCategoryTree([readers, hf, multi, antenna, cards]);

describe("category tree", () => {
  it("nests subcategories and rolls product counts up to the parent", () => {
    const [readersNode] = tree;
    expect(readersNode.children.map((c) => c.category.name)).toEqual(["RFID HF Reader", "RFID Multi Port Reader"]);
    expect(readersNode.productCount).toBe(7);
  });

  it("resolves a parent to every category its products may be filed under", () => {
    expect(resolveCategory(tree, "rfid-reader")).toEqual({
      name: "RFID Readers",
      names: ["RFID Readers", "RFID HF Reader", "RFID Multi Port Reader"],
    });
  });

  it("matches by slugified name too, so a mistyped slug doesn't break links", () => {
    // The admin saved "raid-antenna"; a link built from the name still works.
    expect(resolveCategory(tree, "rfid-antenna")?.name).toBe("RFID Antenna");
    expect(resolveCategory(tree, "raid-antenna")?.name).toBe("RFID Antenna");
  });

  it("matches slugs case-insensitively", () => {
    expect(resolveCategory(tree, "rfid-multi-port-reader")?.name).toBe("RFID Multi Port Reader");
  });

  it("returns null for unknown categories, like the old hard-coded 'rfid-labels'", () => {
    expect(resolveCategory(tree, "rfid-labels")).toBeNull();
    expect(resolveCategory(tree, undefined)).toBeNull();
  });

  it("builds filter options in tree order, only for branches with live products", () => {
    const options = categoryOptions(tree, ["RFID HF Reader", "RFID Antenna"]);
    expect(options.map((o) => [o.name, o.depth, o.param])).toEqual([
      ["RFID Readers", 0, "rfid-reader"],
      ["RFID HF Reader", 1, "rfid-hf-readers"],
      ["RFID Antenna", 0, "raid-antenna"],
    ]);
  });

  it("keeps products reachable when their category is missing from the tree", () => {
    const options = categoryOptions(tree, ["Barcode Printers"]);
    expect(options).toEqual([{ name: "Barcode Printers", depth: 0, names: ["Barcode Printers"] }]);
  });

  it("offers only stocked top-level categories on the home page", () => {
    const summaries = storefrontCategories(tree);
    expect(summaries.map((s) => [s.name, s.productCount, s.param])).toEqual([
      ["RFID Readers", 7, "rfid-reader"],
      ["RFID Antenna", 5, "raid-antenna"],
    ]);
    expect(summaries[0].description).toBe("RFID HF Reader, RFID Multi Port Reader");
  });

  it("falls back to a slugified name when a category has no slug", () => {
    expect(categoryParam(category("Barcode Printers"))).toBe("barcode-printers");
  });
});
