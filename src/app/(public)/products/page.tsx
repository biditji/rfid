import type { Metadata } from "next";
import { ProductsContent } from "@/components/products/products-content";
import { ProductsUnavailable } from "@/components/shared/products-unavailable";
import { getCategories, getProductCards } from "@/lib/products";
import { buildCategoryTree, categoryOptions, categoryParam, findCategory, resolveCategory } from "@/lib/categories";
import { isSortValue } from "@/lib/catalog";
import { pageMetadata, stripBrand } from "@/lib/seo";
import { stripHtml, truncate } from "@/lib/utils";
import { PageContainer } from "@/components/shared/page-container";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const LISTING_DESCRIPTION =
  "Browse our complete catalog of RFID tags, readers, antennas, labels, and accessories for enterprise inventory management.";

/**
 * Page titles that override the category's admin Meta Title, by lowercase
 * slug. Written without the brand: the layout's template adds it. While a
 * category is listed here, editing its Meta Title in the admin panel changes
 * nothing; delete its entry to hand the title back to the admin.
 */
const CATEGORY_TITLES: Record<string, string> = {
  "barcode-printers": "Buy RFID Label Printers",
  "integrated-reader": "UHF Integrated RFID Readers",
  "four-port-reader": "4-Port UHF RFID Fixed Readers",
  // Both spellings: the admin slug is the misspelled "raid-tags" until renamed.
  "raid-tags": "RFID Tags – UHF, HF & On-Metal",
  "rfid-tags": "RFID Tags – UHF, HF & On-Metal",
  "rfid-uhf-label-tags": "UHF RFID Labels",
  // Both spellings: the admin slug is the misspelled "rfid-laundary-tags" until renamed.
  "rfid-laundary-tags": "RFID Laundry Tags",
  "rfid-laundry-tags": "RFID Laundry Tags",
  "rfid-uhf-inlay": "UHF RFID Inlays - Dry & Wet",
  "uhf-rfid-tags": "UHF RFID ABS Hard Tags",
  "rfid-uhf-antenna": "UHF RFID Antennas",
  "handheld-reader": "UHF RFID Handheld Readers",
  "uhf-desktop-reader": "UHF RFID Desktop Readers & Writers",
  "hf-rfid-desktop-reader": "HF 13.56 MHz RFID Readers",
  "rfid-lf-and-hf-pendrive-reader": "LF & HF RFID USB Pendrive Readers",
};

/**
 * Every `?category=` URL is the same route, so without this they all shared one
 * title and description. A category gets its own, from its SEO fields (falling
 * back to its name and description). The canonical URL is the category's own
 * slug, so a mistyped, differently-cased or name-derived link — all of which
 * resolve to the same page — consolidates onto one URL. `?search=` and `?sort=`
 * views canonicalize to the plain listing.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const category = findCategory(buildCategoryTree(await getCategories()), first((await searchParams).category));

  if (!category) {
    return pageMetadata({
      title: "Buy RFID Readers, Tags & Antennas Online",
      description: LISTING_DESCRIPTION,
      path: "/products",
    });
  }

  return pageMetadata({
    title: stripBrand(
      CATEGORY_TITLES[categoryParam(category).toLowerCase()] || category.metaTitle?.trim() || category.name
    ),
    // Never the listing's own description: a category that has none of its own
    // would otherwise repeat /products' text.
    description:
      category.metaDescription?.trim() ||
      truncate(stripHtml(category.description ?? ""), 160) ||
      `Shop ${category.name} from Virtualsphere. Compare specifications and request a quote.`,
    path: `/products?category=${encodeURIComponent(categoryParam(category))}`,
  });
}

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
      <PageContainer className="py-14">
        <h1 className="text-h1">Products</h1>
        <ProductsUnavailable className="mt-8" />
      </PageContainer>
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

  const sort = first(params.sort);

  return (
    <ProductsContent
      products={cards}
      categories={categories}
      initialSearch={first(params.search) ?? ""}
      initialCategory={resolved?.name ?? null}
      initialSort={isSortValue(sort) ? sort : "newest"}
      initialInStock={first(params.stock) === "1"}
    />
  );
}
