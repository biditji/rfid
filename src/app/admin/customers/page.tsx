"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";
import { customers } from "@/data/customers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Customers</h1>
        <p className="text-sm text-zinc-500">
          {customers.length} registered customers
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
        />
      </div>

      {/* Customers table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 text-left">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Customer</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Company</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Orders</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Total Spent</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Joined</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">Last Order</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-500">
                        {customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-zinc-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-600">
                    {customer.company || "—"}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-600">
                    {customer.totalOrders}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-500">
                    {formatDate(customer.joinedAt)}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-500">
                    {customer.lastOrderAt
                      ? formatDate(customer.lastOrderAt)
                      : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                      aria-label={`Email ${customer.name}`}
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
