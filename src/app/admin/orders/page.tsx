"use client";

import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { Package, Search, ChevronRight } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const token = localStorage.getItem("rfid_token");
        if (token) {
          const data = await fetchAllOrders(token);
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("rfid_token");
      if (!token) return;
      
      await updateOrderStatus(orderId, newStatus, token);
      
      // Update local state to reflect change instantly
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-500">Manage all customer orders across the platform.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search orders..."
            className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    <Package className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-zinc-900">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900">{order.user?.name || "Unknown"}</div>
                      <div className="text-xs text-zinc-500">{order.user?.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium outline-none cursor-pointer border-0",
                          order.status === 'Processing' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' :
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                          'bg-zinc-50 text-zinc-700 ring-1 ring-inset ring-zinc-600/20'
                        )}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                        View <ChevronRight className="h-4 w-4" />
                      </button>
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
