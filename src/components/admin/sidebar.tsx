"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Search,
  Settings,
  Globe,
  PanelLeftClose,
  PanelLeft,
  Bell,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BarChart3,
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  Search,
  Settings,
  FolderTree,
};

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Categories", href: "/admin/categories", icon: "FolderTree" },
      { label: "Products", href: "/admin/products", icon: "Package" },
      { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
      { label: "Inventory", href: "/admin/inventory", icon: "Warehouse" },
      { label: "Customers", href: "/admin/customers", icon: "Users" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "SEO", href: "/admin/seo", icon: "Search" },
      { label: "Settings", href: "/admin/settings", icon: "Settings" },
    ],
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden h-screen flex-col border-r border-zinc-200 bg-white transition-all duration-200 lg:flex",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-3">
        <Link
          href="/admin"
          className={cn(
            "flex items-center",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-zinc-100 font-bold text-zinc-900">
              V
            </div>
          ) : (
            <img src="/logo.png" alt="Virtualsphere Technologies" className="h-6 object-contain" />
          )}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600",
            collapsed && "hidden"
          )}
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="mb-3 flex w-full items-center justify-center rounded-md py-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}

        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-zinc-100 font-medium text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom link */}
      <div className="border-t border-zinc-200 p-2">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700",
            collapsed && "justify-center px-0"
          )}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          {!collapsed && "Back to Website"}
        </Link>
      </div>
    </aside>
  );
}
