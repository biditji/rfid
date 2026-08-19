import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { TrustSection } from "@/components/home/trust-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhySection } from "@/components/home/why-section";
import { IndustriesSection } from "@/components/home/industries-section";
import { CTASection } from "@/components/home/cta-section";
import { getProductCards } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Virtualsphere — Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
};

const SPOTLIGHT_COUNT = 3;
const QUICK_BROWSE_COUNT = 4;
const HERO_COUNT = SPOTLIGHT_COUNT + QUICK_BROWSE_COUNT;

export default async function HomePage() {
  // One cached server-side fetch feeds both product sections. Previously the
  // hero and the "More to Explore" rail each fired their own client-side
  // request for the full 94 KB catalog after hydration, which meant two
  // round trips to a slow backend before anything appeared — and on the HTTPS
  // deployment those requests were blocked outright as mixed content, which is
  // what produced the intermittent "No products available".
  const products = await getProductCards();

  const explore = products.slice(HERO_COUNT, HERO_COUNT + 6);

  return (
    <>
      <HeroSection
        spotlight={products.slice(0, SPOTLIGHT_COUNT)}
        quickBrowse={products.slice(SPOTLIGHT_COUNT, HERO_COUNT)}
      />
      {/* Fall back to the head of the catalog when there aren't enough products
          to fill a distinct second rail. */}
      <FeaturedProducts
        products={explore.length >= 3 ? explore : products.slice(0, 6)}
      />
      <TrustSection />
      <CategoriesSection />
      <WhySection />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
