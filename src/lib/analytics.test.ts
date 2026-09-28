import { describe, expect, it } from "vitest";
import {
  monthlySeries,
  percentChange,
  repeatCustomerRate,
  revenueByCategory,
  summarizeOrders,
  topProductsByRevenue,
  type AnalyticsOrder,
} from "./analytics";
import type { Category } from "@/types";

const NOW = new Date(2026, 8, 15); // 15 Sep 2026

let n = 0;
const order = (
  createdAt: Date,
  totalPrice: number,
  extra: Partial<AnalyticsOrder> = {}
): AnalyticsOrder => ({
  _id: `o${++n}`,
  user: { _id: "u1" },
  totalPrice,
  status: "Processing",
  paymentStatus: "Paid",
  createdAt: createdAt.toISOString(),
  items: [],
  ...extra,
});

const aug = (day: number) => new Date(2026, 7, day);
const sep = (day: number) => new Date(2026, 8, day);

describe("monthlySeries", () => {
  it("buckets paid revenue by calendar month, oldest first, including empty months", () => {
    const series = monthlySeries([order(aug(3), 1000), order(sep(1), 500), order(sep(9), 250)], 3, NOW);
    expect(series.map((b) => [b.key, b.revenue, b.orders])).toEqual([
      ["2026-07", 0, 0],
      ["2026-08", 1000, 1],
      ["2026-09", 750, 2],
    ]);
  });

  it("counts unpaid orders as orders but not as revenue", () => {
    const [bucket] = monthlySeries([order(sep(2), 900, { paymentStatus: "Pending" })], 1, NOW);
    expect(bucket).toMatchObject({ orders: 1, revenue: 0, paidOrders: 0 });
  });

  it("ignores orders outside the window", () => {
    const series = monthlySeries([order(new Date(2025, 0, 1), 5000)], 6, NOW);
    expect(series.reduce((sum, b) => sum + b.revenue, 0)).toBe(0);
  });
});

describe("percentChange", () => {
  it("computes the change against the previous value", () => {
    expect(percentChange(150, 100)).toBe(50);
    expect(percentChange(50, 100)).toBe(-50);
  });

  it("reports no baseline rather than inventing an infinite increase", () => {
    expect(percentChange(100, 0)).toBeNull();
    expect(percentChange(0, 0)).toBe(0);
  });
});

describe("summarizeOrders", () => {
  it("summarises all-time figures and this month against last", () => {
    const summary = summarizeOrders(
      [order(aug(3), 1000), order(sep(1), 1500), order(sep(4), 500), order(sep(5), 800, { paymentStatus: "Failed" })],
      NOW
    );
    expect(summary.revenue).toBe(3000);
    expect(summary.orders).toBe(4);
    expect(summary.averageOrder).toBe(1000);
    expect(summary.change.revenue).toBe(100); // 2000 vs 1000
    expect(summary.change.orders).toBe(200); // 3 vs 1
    expect(summary.change.averageOrder).toBe(0); // 1000 vs 1000
  });
});

describe("repeatCustomerRate", () => {
  it("is the share of ordering customers with more than one order", () => {
    const orders = [
      order(sep(1), 1, { user: { _id: "a" } }),
      order(sep(2), 1, { user: { _id: "a" } }),
      order(sep(3), 1, { user: { _id: "b" } }),
      order(sep(4), 1, { user: "c" }),
    ];
    expect(repeatCustomerRate(orders)).toBeCloseTo(33.33, 1);
    expect(repeatCustomerRate([])).toBe(0);
  });
});

describe("revenue breakdowns", () => {
  const readers = { _id: "readers", name: "RFID Readers", parent: null } as Category;
  const hf = { _id: "hf", name: "RFID HF Reader", parent: { _id: "readers", name: "RFID Readers" } } as Category;
  const tags = { _id: "tags", name: "RFID Tags", parent: null } as Category;

  const orders = [
    order(sep(1), 0, {
      items: [
        { product: { _id: "p1", name: "HF Reader", category: "hf" }, quantity: 2, priceAtPurchase: 100 },
        { product: { _id: "p2", name: "Tag", category: { _id: "tags" } }, quantity: 10, priceAtPurchase: 5 },
      ],
    }),
    order(sep(2), 0, {
      items: [{ product: null, quantity: 1, priceAtPurchase: 30 }],
    }),
    order(sep(3), 0, {
      paymentStatus: "Failed",
      items: [{ product: { _id: "p2", name: "Tag", category: "tags" }, quantity: 100, priceAtPurchase: 5 }],
    }),
  ];

  it("rolls category revenue up to the top-level category and skips unpaid orders", () => {
    expect(revenueByCategory(orders, [readers, hf, tags])).toEqual([
      { name: "RFID Readers", value: 200 },
      { name: "RFID Tags", value: 50 },
      { name: "Deleted products", value: 30 },
    ]);
  });

  it("ranks products by revenue", () => {
    expect(topProductsByRevenue(orders, 2)).toEqual([
      { name: "HF Reader", value: 200 },
      { name: "Tag", value: 50 },
    ]);
  });
});
