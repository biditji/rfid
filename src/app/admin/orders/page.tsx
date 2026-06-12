"use client";

import { useState } from "react";
import { Search, ArrowUpRight } from "lucide-react";
import { orders } from "@/data/orders";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const statusTabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const matchesTab =
      activeTab === "All" || o.status === activeTab.toLowerCase();
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Orders</h1>
        <p className="text-sm text-zinc-500">Track and manage customer orders</p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 border-b border-zinc-200">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-3 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-zinc-900" />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      {/* Orders table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 text-left">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Order</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Customer</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Items</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Date</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Total</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Payment</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-zinc-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50 cursor-pointer"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm text-zinc-900">{order.customer.name}</p>
                        <p className="text-xs text-zinc-400">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500">
                      {order.paymentMethod}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                          statusColors[order.status]
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
