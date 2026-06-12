"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { fetchDashboardStats } from "@/lib/api";
import Link from "next/link";

const revenueData = [
  { name: "Jan", revenue: 28400 },
  { name: "Feb", revenue: 34200 },
  { name: "Mar", revenue: 29800 },
  { name: "Apr", revenue: 42100 },
  { name: "May", revenue: 38700 },
  { name: "Jun", revenue: 52300 },
];

const statusColors: Record<string, string> = {
  Processing: "bg-amber-50 text-amber-700",
  Shipped: "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("rfid_token");
        if (token) {
          const data = await fetchDashboardStats(token);
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
    },
    {
      label: "Orders",
      value: stats.totalSales.toString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
    },
    {
      label: "Customers",
      value: stats.totalCustomers.toString(),
      change: "+15.3%",
      trend: "up" as const,
      icon: Users,
    },
    {
      label: "Avg. Order",
      value: stats.totalSales > 0 ? formatCurrency(stats.totalRevenue / stats.totalSales) : "$0",
      change: "-2.1%",
      trend: "down" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Overview of your store performance (Live MongoDB Data)</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{kpi.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                <kpi.icon className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-zinc-900">{kpi.value}</div>
            <div className="mt-1 flex items-center gap-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span className={cn("text-xs font-medium", kpi.trend === "up" ? "text-emerald-600" : "text-red-600")}>
                {kpi.change}
              </span>
              <span className="text-xs text-zinc-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Revenue Overview</h2>
              <p className="text-xs text-zinc-500">Monthly revenue for 2025</p>
            </div>
            <select className="h-7 rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-600">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
            </select>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "12px" }} formatter={(value: any) => [formatCurrency(value as number), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Low Stock Summary</h2>
          </div>
          <div className="mt-4 flex flex-col items-center justify-center h-full pb-10">
            <span className="text-5xl font-extrabold text-amber-600">{stats.lowStockItems}</span>
            <p className="mt-2 text-sm text-zinc-500">Products are running low on inventory</p>
            <Link href="/admin/inventory">
              <button className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors">
                Manage Inventory
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Orders (Live)</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800">
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50">
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Order ID</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Date</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Total</th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {stats.recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-zinc-500">No orders yet.</td></tr>
              ) : stats.recentOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-zinc-900 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-sm text-zinc-600">{order.user?.name || "Unknown"}</td>
                  <td className="px-5 py-4 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-sm font-medium text-zinc-900">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs font-medium", statusColors[order.status] || "bg-zinc-100 text-zinc-700")}>
                      {order.status}
                    </span>
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
