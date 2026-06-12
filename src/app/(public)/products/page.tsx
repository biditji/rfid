import type { Metadata } from "next";
import { ProductsContent } from "@/components/products/products-content";
import { fetchProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our complete catalog of RFID tags, readers, antennas, labels, and accessories for enterprise inventory management.",
};

export default async function ProductsPage() {
  const products = await fetchProducts();
  
  // We can extract categories from the populated products for now
  const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category?.name).filter(Boolean)));
  const categories = uniqueCategories.map((name, i) => ({ id: String(i), name }));

  return <ProductsContent products={products} categories={categories} />;
}
