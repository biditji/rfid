"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertTriangle,
  type LucideIcon,
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
import {
  formatCurrency,
  formatCurrencyCompact,
  formatPercentChange,
  cn,
} from "@/lib/utils";
import { fetchAllOrders, fetchDashboardStats } from "@/lib/api";
import { monthlySeries, summarizeOrders, type AnalyticsOrder } from "@/lib/analytics";
import Link from "next/link";
import { OrderStatusBadge } from "@/components/shared/status-badge";

type DashboardStats = {
  totalRevenue: number;
  totalSales: number;
  totalCustomers: number;
  lowStockItems: number;
  recentOrders: {
    _id: string;
    user?: { name?: string } | null;
    createdAt: string;
    totalPrice: number;
    status: string;
  }[];
};

type Kpi = {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Month-over-month %; null when last month had nothing to compare with. Omit to hide the row. */
  change?: number | null;
};

function KpiCard({ label, value, icon: Icon, change }: Kpi) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
          <Icon className="h-4 w-4 text-zinc-600" />
        </div>
      </div>
      <div className="mt-2 text-2xl font-bold text-zinc-900">{value}</div>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          {change === null ? (
            <span className="text-xs text-zinc-400">No sales last month to compare</span>
          ) : (
            <>
              {change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {formatPercentChange(change)}
              </span>
              <span className="text-xs text-zinc-400">this month vs last</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<AnalyticsOrder[]>([]);
  const [error, setError] = useState(false);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    // Totals come from the dashboard endpoint; trends and the chart are
    // computed from the orders themselves, since the endpoint has no history.
    Promise.all([fetchDashboardStats(), fetchAllOrders()])
      .then(([statsData, orderData]) => {
        setStats(statsData);
        setOrders(orderData);
      })
      .catch((loadError) => {
        console.error("Failed to load dashboard", loadError);
        setError(true);
      });
  }, []);

  const summary = useMemo(() => summarizeOrders(orders), [orders]);
  const series = useMemo(() => monthlySeries(orders, months), [orders, months]);

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-zinc-600">Couldn&apos;t load the dashboard. The backend may be starting up.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  const kpis: Kpi[] = [
    {
      label: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: IndianRupee,
      change: summary.change.revenue,
    },
    {
      label: "Orders",
      value: stats.totalSales.toString(),
      icon: ShoppingCart,
      change: summary.change.orders,
    },
    {
      // No per-month signup data is available, so no trend is shown.
      label: "Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
    },
    {
      label: "Avg. Paid Order",
      value: formatCurrency(summary.averageOrder),
      icon: TrendingUp,
      change: summary.change.averageOrder,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">Overview of your store performance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Revenue Overview</h2>
              <p className="text-xs text-zinc-500">Paid revenue per month</p>
            </div>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="h-7 rounded-md border border-zinc-200 bg-zinc-50 px-2 text-xs text-zinc-600"
            >
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={formatCurrencyCompact} />
                <Tooltip
                  contentStyle={{ border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
                />
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
            <Link
              href="/admin/inventory"
              className="mt-4 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-medium rounded-lg transition-colors"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Orders</h2>
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
              ) : stats.recentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-medium text-zinc-900 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-sm text-zinc-600">{order.user?.name || "Unknown"}</td>
                  <td className="px-5 py-4 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-sm font-medium text-zinc-900">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={order.status} />
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
