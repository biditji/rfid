import type { Metadata } from "next";
import Link from "next/link";
import {
  Tag,
  Cpu,
  Antenna,
  StickyNote,
  Package,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { categories } from "@/data/categories";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse RFID product categories — tags, readers, antennas, labels, starter kits, and accessories.",
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "RFID Tags": Tag,
  "RFID Readers": Cpu,
  "RFID Antennas": Antenna,
  "RFID Labels": StickyNote,
  "RFID Kits": Package,
  "Accessories": Wrench,
};

const categoryImages: Record<string, string> = {
  "RFID Tags": "bg-blue-50",
  "RFID Readers": "bg-amber-50",
  "RFID Antennas": "bg-emerald-50",
  "RFID Labels": "bg-violet-50",
  "RFID Kits": "bg-rose-50",
  "Accessories": "bg-zinc-100",
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Product Categories
          </h1>
          <p className="mt-2 text-zinc-500">
            Everything you need to build, deploy, and maintain RFID
            infrastructure — organized by component type.
          </p>
        </div>
      </FadeIn>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, idx) => {
          const Icon = categoryIcons[cat.name] || Package;
          const bgClass = categoryImages[cat.name] || "bg-zinc-100";

          return (
            <FadeIn key={cat.id} delay={idx * 0.06}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-sm"
              >
                <div
                  className={`flex aspect-[2/1] items-center justify-center ${bgClass}`}
                >
                  <Icon className="h-10 w-10 text-zinc-400" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700">
                      {cat.name}
                    </h2>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                      {cat.productCount} products
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-zinc-600 group-hover:text-zinc-900">
                      Browse {cat.name}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
