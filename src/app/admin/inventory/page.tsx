"use client";

import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const sortedProducts = [...products].sort((a, b) => a.stock - b.stock);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Inventory</h1>
        <p className="text-sm text-zinc-500">
          Monitor stock levels and manage reorders
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <p className="text-sm text-zinc-500">Total Stock Units</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900">
            {totalStock.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-700">Low Stock Items</p>
          <p className="mt-1 text-2xl font-bold text-amber-900">
            {lowStockCount}
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-red-900">
            {outOfStockCount}
          </p>
        </div>
      </div>

      {/* Inventory table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 text-left">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Product</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">SKU</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Category</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Stock</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[200px]">Level</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Reorder Qty</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => {
                const maxStock = 50000;
                const percentage = Math.min(
                  (product.stock / maxStock) * 100,
                  100
                );
                const barColor =
                  product.stock === 0
                    ? "bg-red-400"
                    : product.stock <= 10
                      ? "bg-amber-400"
                      : product.stock <= 50
                        ? "bg-blue-400"
                        : "bg-emerald-400";

                const statusLabel =
                  product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 10
                      ? "Critical"
                      : product.stock <= 50
                        ? "Low"
                        : "Healthy";

                const statusColor =
                  product.stock === 0
                    ? "bg-red-50 text-red-600"
                    : product.stock <= 10
                      ? "bg-amber-50 text-amber-600"
                      : product.stock <= 50
                        ? "bg-blue-50 text-blue-600"
                        : "bg-emerald-50 text-emerald-600";

                return (
                  <tr
                    key={product.id}
                    className="border-b border-zinc-50 last:border-0"
                  >
                    <td className="px-5 py-3 text-sm font-medium text-zinc-900 max-w-[200px] truncate">
                      {product.name}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-zinc-500">
                      {product.sku}
                    </td>
                    <td className="px-5 py-3 text-xs text-zinc-500">
                      {product.category}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-700">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-2 w-full rounded-full bg-zinc-100">
                        <div
                          className={cn("h-2 rounded-full", barColor)}
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                          statusColor
                        )}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        defaultValue={product.stock <= 10 ? 100 : 0}
                        min={0}
                        className="h-7 w-20 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-700 focus:border-zinc-300 focus:outline-none"
                      />
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
