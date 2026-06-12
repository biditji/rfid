"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { formatCurrency, getStockStatus, cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-500">
            Manage your product catalog
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
          />
        </div>
        <select className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-600">
          <option>All Categories</option>
          <option>RFID Tags</option>
          <option>RFID Readers</option>
          <option>RFID Antennas</option>
          <option>RFID Labels</option>
          <option>RFID Kits</option>
          <option>Accessories</option>
        </select>
      </div>

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 text-left">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Product
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  SKU
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Category
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Price
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Stock
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const stock = getStockStatus(product.stock);
                return (
                  <tr
                    key={product.id}
                    className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold text-zinc-400">
                          {product.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-zinc-900 line-clamp-1">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-500 font-mono text-xs">
                      {product.sku}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-3 text-sm text-zinc-600">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                          stock.color === "emerald"
                            ? "bg-emerald-50 text-emerald-600"
                            : stock.color === "amber"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-red-50 text-red-600"
                        )}
                      >
                        {stock.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                          aria-label="Edit product"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600"
                          aria-label="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
