import type { Metadata } from "next";
import { getCategories } from "@/lib/products";
import { buildCategoryTree, categoryParam, type CategoryNode } from "@/lib/categories";
import { stripHtml } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/shared/page-container";
import { ActionLink, SectionHeader } from "@/components/shared/section-header";
import { CategoryIndex, type CategoryIndexItem } from "@/components/products/category-index";

export const metadata: Metadata = pageMetadata({
  title: "RFID Product Categories",
  description: "Browse RFID product categories — tags, readers, antennas, labels, starter kits, and accessories.",
  path: "/categories",
});

export const revalidate = 600;

/** The category tree, depth-first, as index rows (subcategories indented). */
function flatten(nodes: CategoryNode[], depth = 0): CategoryIndexItem[] {
  return nodes.flatMap((node) => [
    {
      id: node.category._id,
      name: node.category.name,
      href: `/products?category=${encodeURIComponent(categoryParam(node.category))}`,
      count: node.productCount,
      description: stripHtml(node.category.description ?? "") || undefined,
      depth,
    },
    ...flatten(node.children, depth + 1),
  ]);
}

export default async function CategoriesPage() {
  const items = flatten(buildCategoryTree(await getCategories()));

  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <SectionHeader
        as="h1"
        eyebrow="Catalog"
        title="Product categories"
        description="Everything you need to build, deploy, and maintain RFID infrastructure — organized by component type."
        action={<ActionLink href="/products">View all products</ActionLink>}
      />

      {items.length > 0 ? (
        <CategoryIndex items={items} columns={1} wrapDescriptions className="mt-12" />
      ) : (
        <p className="mt-12 text-small text-muted-foreground">Categories are unavailable right now. Please try again shortly.</p>
      )}
    </PageContainer>
  );
}
