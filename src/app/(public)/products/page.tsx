import type { Metadata } from "next";
import { ProductsContent } from "@/components/products/products-content";
import { ProductsUnavailable } from "@/components/shared/products-unavailable";
import { getCategories, getProductCards } from "@/lib/products";
import { buildCategoryTree, categoryOptions, resolveCategory } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our complete catalog of RFID tags, readers, antennas, labels, and accessories for enterprise inventory management.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function ProductsPage({ searchParams }: Props) {
  // Reading searchParams renders this route per request. That's deliberate: the
  // filters have to be applied server-side so the grid ships in the HTML (good
  // for SEO and first paint). The expensive part — the backend call — is still
  // served from the 5-minute fetch cache, so the render itself costs a few ms.
  const [params, { cards, ok }, allCategories] = await Promise.all([
    searchParams,
    getProductCards(),
    getCategories(),
  ]);

  if (!ok) {
    // The catalog is the whole point of this route, so the failure takes the
    // page — but as a recoverable error with a retry, never an endless spinner.
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Products</h1>
        <div className="mt-8">
          <ProductsUnavailable />
        </div>
      </div>
    );
  }

  // The sidebar follows the real category tree, so a parent like "RFID Readers"
  // lists (and filters to) everything filed under its subcategories.
  const tree = buildCategoryTree(allCategories);
  const liveNames = cards.flatMap((p) => (p.categoryName ? [p.categoryName] : []));
  const categories = categoryOptions(tree, liveNames);

  // The hero pills, category cards and /categories page link here with
  // ?category=<slug>; resolve it into the filter the grid starts from.
  const resolved = resolveCategory(tree, first(params.category));
  if (resolved && !categories.some((c) => c.name === resolved.name)) {
    // A real category with nothing live in it: show it as an honest empty
    // result rather than silently falling back to the whole catalog.
    categories.push({ name: resolved.name, depth: 0, names: resolved.names });
  }

  return (
    <ProductsContent
      products={cards}
      categories={categories}
      initialSearch={first(params.search) ?? ""}
      initialCategory={resolved?.name ?? null}
    />
  );
}
