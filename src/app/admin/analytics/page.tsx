"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchAllOrders, fetchCategories } from "@/lib/api";
import {
  monthlySeries,
  repeatCustomerRate,
  revenueByCategory,
  summarizeOrders,
  topProductsByRevenue,
  type AnalyticsOrder,
} from "@/lib/analytics";
import { formatCurrency, formatCurrencyCompact, formatPercentChange } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import type { Category } from "@/types";

const COLORS = ["#2563eb", "#f59e0b", "#059669", "#8b5cf6", "#f43f5e", "#71717a"];

const tooltipStyle = { border: "1px solid #e4e4e7", borderRadius: "8px", fontSize: "12px" };

function EmptyChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-zinc-400">{children}</div>
  );
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<AnalyticsOrder[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState(false);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    Promise.all([fetchAllOrders(), fetchCategories()])
      .then(([orderData, categoryData]) => {
        setOrders(orderData);
        setCategories(categoryData);
      })
      .catch((loadError) => {
        console.error("Failed to load analytics", loadError);
        setError(true);
      });
  }, []);

  const data = useMemo(() => {
    if (!orders) return null;
    return {
      summary: summarizeOrders(orders),
      series: monthlySeries(orders, months),
      byCategory: revenueByCategory(orders, categories),
      topProducts: topProductsByRevenue(orders, 5),
      repeatRate: repeatCustomerRate(orders),
    };
  }, [orders, categories, months]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-zinc-600">
        Couldn&apos;t load analytics. The backend may be starting up — try again shortly.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  const { summary, series, byCategory, topProducts, repeatRate } = data;
  const categoryTotal = byCategory.reduce((sum, share) => sum + share.value, 0);

  const metrics: { label: string; value: string; change?: number | null }[] = [
    { label: "Revenue", value: formatCurrency(summary.revenue), change: summary.change.revenue },
    { label: "Orders Placed", value: summary.orders.toString(), change: summary.change.orders },
    { label: "Avg. Paid Order", value: formatCurrency(summary.averageOrder), change: summary.change.averageOrder },
    { label: "Repeat Customers", value: `${repeatRate.toFixed(0)}%` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Sales Analytics</h1>
          <p className="text-sm text-zinc-500">Computed from every placed order.</p>
        </div>
        <select
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
          className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-600"
        >
          <option value={6}>Last 6 months</option>
          <option value={12}>Last 12 months</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs text-zinc-500">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-zinc-900">{m.value}</p>
            {m.change !== undefined && (
              <p
                className={
                  m.change === null
                    ? "mt-0.5 text-xs text-zinc-400"
                    : m.change >= 0
                      ? "mt-0.5 text-xs font-medium text-emerald-600"
                      : "mt-0.5 text-xs font-medium text-red-600"
                }
              >
                {m.change === null ? "No baseline last month" : `${formatPercentChange(m.change)} this month vs last`}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Revenue over time */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">Revenue by Month</h2>
        <p className="text-xs text-zinc-500">Paid revenue per month.</p>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={formatCurrencyCompact} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Revenue by Category</h2>
          <div className="mt-4 h-[260px]">
            {byCategory.length === 0 ? (
              <EmptyChart>No paid orders yet</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {byCategory.map((share, index) => <Cell key={share.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      `${formatCurrency(Number(value))} (${((Number(value) / categoryTotal) * 100).toFixed(0)}%)`,
                      "Revenue",
                    ]}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">Top Products by Revenue</h2>
          <div className="mt-4 h-[260px]">
            {topProducts.length === 0 ? (
              <EmptyChart>No paid orders yet</EmptyChart>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#a1a1aa" }} axisLine={false} tickLine={false} tickFormatter={formatCurrencyCompact} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
