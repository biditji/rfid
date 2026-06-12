"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const revenueOverTime = [
  { month: "Jan", revenue: 28400, orders: 32 },
  { month: "Feb", revenue: 34200, orders: 38 },
  { month: "Mar", revenue: 29800, orders: 35 },
  { month: "Apr", revenue: 42100, orders: 44 },
  { month: "May", revenue: 38700, orders: 41 },
  { month: "Jun", revenue: 52300, orders: 48 },
];

const categoryBreakdown = [
  { name: "RFID Tags", value: 38 },
  { name: "RFID Readers", value: 28 },
  { name: "Antennas", value: 14 },
  { name: "Labels", value: 11 },
  { name: "Kits", value: 6 },
  { name: "Accessories", value: 3 },
];

const COLORS = ["#2563eb", "#f59e0b", "#059669", "#8b5cf6", "#f43f5e", "#71717a"];

const channelData = [
  { channel: "Direct", sales: 42000 },
  { channel: "Partner", sales: 28000 },
  { channel: "Marketplace", sales: 15000 },
  { channel: "Referral", sales: 8500 },
];

const metrics = [
  { label: "Conversion Rate", value: "3.2%", change: "+0.4%" },
  { label: "Avg. Session Duration", value: "4m 12s", change: "+18s" },
  { label: "Cart Abandonment", value: "34%", change: "-2.1%" },
  { label: "Repeat Purchase Rate", value: "42%", change: "+5.3%" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Sales Analytics</h1>
          <p className="text-sm text-zinc-500">
            Performance metrics and sales data
          </p>
        </div>
        <select className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-600">
          <option>Last 6 months</option>
          <option>Last 12 months</option>
          <option>Year to date</option>
        </select>
      </div>

      {/* Conversion metrics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-xs text-zinc-500">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-zinc-900">{m.value}</p>
            <p className="mt-0.5 text-xs font-medium text-emerald-600">
              {m.change}
            </p>
          </div>
        ))}
      </div>

      {/* Revenue over time */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-zinc-900">
          Revenue Over Time
        </h2>
        <p className="text-xs text-zinc-500">Monthly revenue and order count</p>
        <div className="mt-4 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueOverTime}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="month"
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
                formatter={(value: any, name: any) => [
                  name === "revenue" ? formatCurrency(value as number) : value,
                  name === "revenue" ? "Revenue" : "Orders",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category breakdown */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">
            Sales by Category
          </h2>
          <p className="text-xs text-zinc-500">
            Revenue distribution across product categories
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryBreakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value}%`, "Share"]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by channel */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-zinc-900">
            Sales by Channel
          </h2>
          <p className="text-xs text-zinc-500">
            Revenue breakdown by sales channel
          </p>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical" barSize={20}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f4f4f5"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <YAxis
                  type="category"
                  dataKey="channel"
                  tick={{ fontSize: 12, fill: "#a1a1aa" }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e4e4e7",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [
                    formatCurrency(value as number),
                    "Sales",
                  ]}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
