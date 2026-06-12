import type { Metadata } from "next";
import { ProductsContent } from "@/components/products/products-content";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse our complete catalog of RFID tags, readers, antennas, labels, and accessories for enterprise inventory management.",
};

export default function ProductsPage() {
  return <ProductsContent />;
}
