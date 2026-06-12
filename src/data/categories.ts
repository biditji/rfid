import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    name: "RFID Tags",
    slug: "rfid-tags",
    description:
      "Passive and active RFID tags for asset tracking, inventory management, and item-level identification. From standard inlays to rugged on-metal tags.",
    productCount: 3,
  },
  {
    id: "2",
    name: "RFID Readers",
    slug: "rfid-readers",
    description:
      "Fixed and handheld RFID readers for enterprise deployments. Multi-port, high-throughput readers for warehouses, docks, and retail.",
    productCount: 4,
  },
  {
    id: "3",
    name: "RFID Antennas",
    slug: "rfid-antennas",
    description:
      "Panel, slim-line, and specialty antennas for UHF RFID systems. Indoor and outdoor options with various gain and beamwidth profiles.",
    productCount: 2,
  },
  {
    id: "4",
    name: "RFID Labels",
    slug: "rfid-labels",
    description:
      "Pre-printed and blank RFID smart labels for thermal transfer and direct thermal printing. Compatible with major RFID printer brands.",
    productCount: 1,
  },
  {
    id: "5",
    name: "RFID Kits",
    slug: "rfid-kits",
    description:
      "Complete starter and evaluation kits bundling readers, antennas, tags, cables, and software for quick deployment.",
    productCount: 1,
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    description:
      "Cables, mounting hardware, enclosures, and peripherals to complete your RFID infrastructure.",
    productCount: 1,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
