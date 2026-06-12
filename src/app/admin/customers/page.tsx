"use client";

import { useEffect, useState } from "react";
import { fetchCustomers } from "@/lib/api";
import { Search, UserCircle2, Mail, Calendar, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const token = localStorage.getItem("rfid_token");
        if (token) {
          const data = await fetchCustomers(token);
          setCustomers(data);
        }
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Customers (Live)</h1>
          <p className="text-sm text-zinc-500">Manage your active users from the MongoDB database.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customers..."
            className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-center">Orders Placed</th>
                <th className="px-6 py-4 font-medium text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    <UserCircle2 className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-zinc-900">{user.name}</div>
                          <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-700">
                        {user.ordersCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-900">
                      {formatCurrency(user.totalSpent)}
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
