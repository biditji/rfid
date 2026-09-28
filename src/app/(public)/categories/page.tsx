import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/products";
import { FadeIn } from "@/components/shared/fade-in";
import { categoryColors, categoryIcon } from "@/components/shared/category-visuals";
import { categoryParam } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse RFID product categories — tags, readers, antennas, labels, starter kits, and accessories.",
};

export const revalidate = 600;

export default async function CategoriesPage() {
  const categories = await getCategories();

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
          const Icon = categoryIcon(cat.name);
          const bgClass = categoryColors(idx).tint;

          return (
            <FadeIn key={cat._id} delay={idx * 0.06}>
              <Link
                href={`/products?category=${encodeURIComponent(categoryParam(cat))}`}
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
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
                    {cat.description || "Browse products in this category."}
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
