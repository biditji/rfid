import type { Category } from "@/types";

/**
 * Admin metrics computed from the real order list.
 *
 * The backend's /admin/dashboard endpoint only returns all-time totals, so the
 * dashboard used to fill its charts and "+12.5% vs last month" badges with
 * hard-coded numbers. Everything here is derived from `GET /orders` instead.
 */

export type AnalyticsOrder = {
  _id: string;
  user?: { _id?: string } | string | null;
  items?: {
    product?: { _id?: string; name?: string; category?: string | { _id?: string } | null } | null;
    quantity: number;
    priceAtPurchase: number;
  }[];
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

/**
 * Whether an order counts as revenue. Mirrors the backend's dashboard total
 * (paid, and not stuck awaiting payment) so charts and headline figures agree.
 */
export const isRevenueOrder = (order: AnalyticsOrder) =>
  order.paymentStatus === "Paid" && order.status !== "Pending Payment";

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export type MonthBucket = {
  key: string;
  label: string;
  revenue: number;
  /** Orders placed that month, paid or not (the backend's "total sales"). */
  orders: number;
  /** Orders that month that count as revenue. */
  paidOrders: number;
};

/** The last `months` calendar months, oldest first, ending with the current one. */
export function monthlySeries(
  orders: AnalyticsOrder[],
  months: number,
  now: Date = new Date()
): MonthBucket[] {
  const buckets = new Map<string, MonthBucket>();
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = date.toLocaleString("en-IN", { month: "short", year: "2-digit" });
    buckets.set(monthKey(date), { key: monthKey(date), label, revenue: 0, orders: 0, paidOrders: 0 });
  }

  for (const order of orders) {
    const bucket = buckets.get(monthKey(new Date(order.createdAt)));
    if (!bucket) continue;
    bucket.orders += 1;
    if (isRevenueOrder(order)) {
      bucket.revenue += order.totalPrice;
      bucket.paidOrders += 1;
    }
  }

  return [...buckets.values()];
}

/**
 * Percentage change from `previous` to `current`. Null when there is no
 * baseline to compare against (previous was zero but current isn't).
 */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

const average = (total: number, count: number) => (count > 0 ? total / count : 0);

export type OrderSummary = {
  revenue: number;
  orders: number;
  averageOrder: number;
  /** This calendar month against the previous one. */
  change: { revenue: number | null; orders: number | null; averageOrder: number | null };
};

export function summarizeOrders(orders: AnalyticsOrder[], now: Date = new Date()): OrderSummary {
  const paid = orders.filter(isRevenueOrder);
  const revenue = paid.reduce((sum, order) => sum + order.totalPrice, 0);
  const [previous, current] = monthlySeries(orders, 2, now);

  return {
    revenue,
    orders: orders.length,
    averageOrder: average(revenue, paid.length),
    change: {
      revenue: percentChange(current.revenue, previous.revenue),
      orders: percentChange(current.orders, previous.orders),
      averageOrder: percentChange(
        average(current.revenue, current.paidOrders),
        average(previous.revenue, previous.paidOrders)
      ),
    },
  };
}

const userId = (order: AnalyticsOrder) =>
  typeof order.user === "string" ? order.user : (order.user?._id ?? null);

/** Share of customers with an order who have placed more than one, 0–100. */
export function repeatCustomerRate(orders: AnalyticsOrder[]): number {
  const perCustomer = new Map<string, number>();
  for (const order of orders) {
    const id = userId(order);
    if (id) perCustomer.set(id, (perCustomer.get(id) ?? 0) + 1);
  }
  if (perCustomer.size === 0) return 0;
  const repeat = [...perCustomer.values()].filter((count) => count > 1).length;
  return (repeat / perCustomer.size) * 100;
}

const categoryIdOf = (category: string | { _id?: string } | null | undefined) =>
  typeof category === "string" ? category : (category?._id ?? null);

export type Share = { name: string; value: number };

/**
 * Revenue by top-level category. Order items reference their product's
 * category by id only, so ids are resolved against the category list and
 * rolled up to the root (a sale of an "RFID HF Reader" counts for
 * "RFID Readers").
 */
export function revenueByCategory(orders: AnalyticsOrder[], categories: Category[]): Share[] {
  const byId = new Map(categories.map((category) => [category._id, category]));
  const rootName = (id: string | null): string => {
    let category = id ? byId.get(id) : undefined;
    if (!category) return "Uncategorised";
    const seen = new Set<string>();
    while (category.parent?._id && byId.has(category.parent._id) && !seen.has(category._id)) {
      seen.add(category._id);
      category = byId.get(category.parent._id)!;
    }
    return category.name;
  };

  const totals = new Map<string, number>();
  for (const order of orders.filter(isRevenueOrder)) {
    for (const item of order.items ?? []) {
      const name = item.product ? rootName(categoryIdOf(item.product.category)) : "Deleted products";
      totals.set(name, (totals.get(name) ?? 0) + item.priceAtPurchase * item.quantity);
    }
  }

  return [...totals.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/** The `limit` products that brought in the most revenue. */
export function topProductsByRevenue(orders: AnalyticsOrder[], limit = 5): Share[] {
  const totals = new Map<string, Share>();
  for (const order of orders.filter(isRevenueOrder)) {
    for (const item of order.items ?? []) {
      const key = item.product?._id ?? "deleted";
      const name = item.product?.name ?? "Deleted product";
      const entry = totals.get(key) ?? { name, value: 0 };
      entry.value += item.priceAtPurchase * item.quantity;
      totals.set(key, entry);
    }
  }
  return [...totals.values()].sort((a, b) => b.value - a.value).slice(0, limit);
}
