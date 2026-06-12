"use client";

import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Package,
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
import { orders } from "@/data/orders";
import { products } from "@/data/products";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

const revenueData = [
  { name: "Jan", revenue: 28400 },
  { name: "Feb", revenue: 34200 },
  { name: "Mar", revenue: 29800 },
  { name: "Apr", revenue: 42100 },
  { name: "May", revenue: 38700 },
  { name: "Jun", revenue: 52300 },
];

const kpis = [
  {
    label: "Revenue",
    value: "$52,311",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    label: "Orders",
    value: "48",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    value: "156",
    change: "+15.3%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Avg. Order",
    value: "$1,089",
    change: "-2.1%",
    trend: "down" as const,
    icon: TrendingUp,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function DashboardPage() {
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products
    .filter((p) => p.stock <= 15 && p.stock > 0)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Overview of your store performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{kpi.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100">
                <kpi.icon className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-zinc-900">
              {kpi.value}
            </div>
            <div className="mt-1 flex items-center gap-1">
              {kpi.trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  kpi.trend === "up" ? "text-emerald-600" : "text-red-600"
                )}
              >
                {kpi.change}
              </span>
              <span className="text-xs text-zinc-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Tables */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Revenue</h2>
              <p className="text-xs text-zinc-500">
                Monthly revenue for 2025
              </p>
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f4f4f5"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [
                    formatCurrency(value as number),
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-zinc-900">
              Low Stock Alerts
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-lg border border-zinc-100 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-400">{product.sku}</p>
                </div>
                <div className="ml-3 text-right">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      product.stock <= 10
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    )}
                  >
                    {product.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">
            Recent Orders
          </h2>
          <a
            href="/admin/orders"
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
          >
            View all
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 text-left">
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Order
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Customer
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Date
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Total
                </th>
                <th className="px-5 py-3 text-xs font-medium text-zinc-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-50 last:border-0"
                >
                  <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-600">
                    {order.customer.name}
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-zinc-900">
                    {formatCurrency(order.total)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
