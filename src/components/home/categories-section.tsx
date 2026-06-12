"use client";

import Link from "next/link";
import { Tag, Cpu, Antenna, StickyNote, Package, Wrench } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

const categoryCards = [
  {
    name: "RFID Tags",
    slug: "rfid-tags",
    description: "Passive UHF tags for asset tracking and item-level ID",
    icon: Tag,
    count: 3,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    name: "RFID Readers",
    slug: "rfid-readers",
    description: "Fixed and handheld readers for enterprise environments",
    icon: Cpu,
    count: 4,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    name: "RFID Antennas",
    slug: "rfid-antennas",
    description: "Panel and slim-line antennas for optimal coverage",
    icon: Antenna,
    count: 2,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "RFID Labels",
    slug: "rfid-labels",
    description: "Smart labels for thermal printers and inline encoding",
    icon: StickyNote,
    count: 1,
    accent: "bg-violet-50 text-violet-600",
  },
  {
    name: "Starter Kits",
    slug: "rfid-kits",
    description: "Everything you need to get started in one box",
    icon: Package,
    count: 1,
    accent: "bg-rose-50 text-rose-600",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Cables, mounts, enclosures, and peripherals",
    icon: Wrench,
    count: 1,
    accent: "bg-zinc-100 text-zinc-600",
  },
];

export function CategoriesSection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Shop by category
              </h2>
              <p className="mt-2 text-zinc-500">
                Find the right components for your RFID infrastructure.
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block"
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryCards.map((cat, idx) => (
            <FadeIn key={cat.slug} delay={idx * 0.05}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-zinc-200 p-5 transition-all hover:border-zinc-300 hover:shadow-sm"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${cat.accent}`}
                >
                  <cat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700">
                      {cat.name}
                    </h3>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                      {cat.count}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
