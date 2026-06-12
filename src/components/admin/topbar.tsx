"use client";

import { Search, Bell, Menu } from "lucide-react";

export function AdminTopbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 lg:px-6">
      {/* Mobile menu placeholder */}
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 lg:hidden"
        aria-label="Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search */}
      <div className="hidden lg:block lg:flex-1 lg:max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search orders, products, customers…"
            className="h-8 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-200"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
          SC
        </div>
      </div>
    </header>
  );
}
