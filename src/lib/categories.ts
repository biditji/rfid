import type { Category } from "@/types";
import { slugify, stripHtml } from "./utils";

/**
 * The category hierarchy, and the rules for linking and filtering by it.
 *
 * Categories nest (e.g. "RFID Readers" > "RFID HF Reader") and products are
 * filed under the leaves, so a link to a parent category must match every
 * product in its subtree. Admin-entered slugs are also unreliable
 * ("raid-antenna", "RFID-Multi-Port-Reader"), so links resolve by slug *or*
 * by the slugified name, case-insensitively.
 */

export type CategoryNode = {
  category: Category;
  children: CategoryNode[];
  /** Products in this category and all of its descendants. */
  productCount: number;
};

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>(
    categories.map((category) => [category._id, { category, children: [], productCount: 0 }])
  );

  const roots: CategoryNode[] = [];
  for (const node of nodes.values()) {
    const parent = node.category.parent?._id ? nodes.get(node.category.parent._id) : undefined;
    (parent ? parent.children : roots).push(node);
  }

  const rollUp = (node: CategoryNode): number =>
    (node.productCount =
      (node.category.productCount ?? 0) + node.children.reduce((sum, child) => sum + rollUp(child), 0));
  roots.forEach(rollUp);

  return roots;
}

/** The value to put in `/products?category=`. */
export const categoryParam = (category: Category) => category.slug || slugify(category.name);

const subtreeNames = (node: CategoryNode): string[] => [
  node.category.name,
  ...node.children.flatMap(subtreeNames),
];

function findNode(nodes: CategoryNode[], param: string): CategoryNode | null {
  const wanted = param.toLowerCase();
  const wantedSlug = slugify(param);
  for (const node of nodes) {
    const { slug, name } = node.category;
    if (slug?.toLowerCase() === wanted || slugify(name) === wantedSlug) return node;
    const inChildren = findNode(node.children, param);
    if (inChildren) return inChildren;
  }
  return null;
}

/**
 * Resolve `?category=` to the category it names and every category name its
 * products may be filed under. Null when nothing matches.
 */
export function resolveCategory(
  tree: CategoryNode[],
  param: string | null | undefined
): { name: string; names: string[] } | null {
  if (!param) return null;
  const node = findNode(tree, param);
  return node ? { name: node.category.name, names: subtreeNames(node) } : null;
}

export type CategoryOption = {
  name: string;
  /** 0 for a top-level category, 1 for its children, and so on. */
  depth: number;
  /** Category names whose products this option matches. */
  names: string[];
};

/**
 * The product listing's category filter, in tree order. Only branches with a
 * live product appear, and any category a live product uses that isn't in the
 * tree (a disabled parent, say) is appended so its products stay reachable.
 */
export function categoryOptions(
  tree: CategoryNode[],
  liveCategoryNames: Iterable<string>
): CategoryOption[] {
  const live = new Set(liveCategoryNames);
  const options: CategoryOption[] = [];

  const visit = (node: CategoryNode, depth: number) => {
    const names = subtreeNames(node);
    if (!names.some((name) => live.has(name))) return;
    options.push({ name: node.category.name, depth, names });
    node.children.forEach((child) => visit(child, depth + 1));
  };
  tree.forEach((node) => visit(node, 0));

  const covered = new Set(options.flatMap((option) => option.names));
  for (const name of live) {
    if (!covered.has(name)) options.push({ name, depth: 0, names: [name] });
  }

  return options;
}

/** A top-level category as the home page's pills and cards present it. */
export type CategorySummary = {
  id: string;
  name: string;
  /** For `/products?category=`. */
  param: string;
  /** Rolled up across subcategories. */
  productCount: number;
  description: string;
};

function describe(node: CategoryNode): string {
  const own = stripHtml(node.category.description ?? "");
  if (own) return own;

  const stocked = node.children.filter((child) => child.productCount > 0).map((c) => c.category.name);
  if (stocked.length) return `${stocked.slice(0, 3).join(", ")}${stocked.length > 3 ? " and more" : ""}`;

  return `${node.productCount} product${node.productCount === 1 ? "" : "s"}`;
}

/**
 * Top-level categories that actually have products, for the home page. Built
 * from the live tree, so a renamed, added or emptied category shows up
 * correctly without a code change.
 */
export function storefrontCategories(tree: CategoryNode[]): CategorySummary[] {
  return tree
    .filter((node) => node.productCount > 0)
    .map((node) => ({
      id: node.category._id,
      name: node.category.name,
      param: categoryParam(node.category),
      productCount: node.productCount,
      description: describe(node),
    }));
}
