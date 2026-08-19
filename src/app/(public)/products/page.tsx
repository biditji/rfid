import type { Metadata } from "next";
import { ProductsContent } from "@/components/products/products-content";
import { getProductCards } from "@/lib/products";
import { slugify } from "@/lib/utils";

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
  const [params, products] = await Promise.all([searchParams, getProductCards()]);

  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.categoryName).filter(Boolean))
  ) as string[];
  const categories = uniqueCategories.map((name, i) => ({ id: String(i), name }));

  // The hero search box and the category pills link here with a query string;
  // resolve those into the filter state the grid starts from.
  const categoryParam = first(params.category);
  const initialCategory = categoryParam
    ? (categories.find((c) => slugify(c.name) === slugify(categoryParam))?.name ?? null)
    : null;

  return (
    <ProductsContent
      products={products}
      categories={categories}
      initialSearch={first(params.search) ?? ""}
      initialCategory={initialCategory}
    />
  );
}
