import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { HeroShowcase } from "@/components/home/hero-showcase";
import { HeroShowcaseSkeleton } from "@/components/home/hero-showcase-skeleton";
import { TrustSection } from "@/components/home/trust-section";
import { CategoriesSection } from "@/components/home/categories-section";
import {
  FeaturedProducts,
  FeaturedProductsSkeleton,
} from "@/components/home/featured-products";
import { WhySection } from "@/components/home/why-section";
import { IndustriesSection } from "@/components/home/industries-section";
import { CTASection } from "@/components/home/cta-section";
import { ProductsUnavailable } from "@/components/shared/products-unavailable";
import { CategoryPills, CategoryPillsSkeleton } from "@/components/home/category-pills";
import { getProductCards, getStorefrontCategories } from "@/lib/products";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Virtualsphere — Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
};

const SPOTLIGHT_COUNT = 3;
const QUICK_BROWSE_COUNT = 4;
const HERO_COUNT = SPOTLIGHT_COUNT + QUICK_BROWSE_COUNT;
const EXPLORE_COUNT = 6;
/** Exactly what this page renders — no reason to pull the whole catalog. */
const HOME_PRODUCT_COUNT = HERO_COUNT + EXPLORE_COUNT;

/**
 * Both product sections read the same list. `getProductCards` is memoized per
 * request, so the two await calls below share a single backend round trip.
 */
async function HeroProducts() {
  const { cards, ok } = await getProductCards(HOME_PRODUCT_COUNT);

  if (!ok) {
    return (
      <ProductsUnavailable
        description="We couldn't reach the product catalog just now. Browse the categories above, or try again."
        className="my-4"
      />
    );
  }

  return (
    <HeroShowcase
      spotlight={cards.slice(0, SPOTLIGHT_COUNT)}
      quickBrowse={cards.slice(SPOTLIGHT_COUNT, HERO_COUNT)}
    />
  );
}

async function ExploreProducts() {
  const { cards, ok } = await getProductCards(HOME_PRODUCT_COUNT);

  const explore = cards.slice(HERO_COUNT, HERO_COUNT + EXPLORE_COUNT);

  return (
    <FeaturedProducts
      // Fall back to the head of the catalog when there aren't enough products
      // to fill a distinct second rail.
      products={explore.length >= 3 ? explore : cards.slice(0, EXPLORE_COUNT)}
      ok={ok}
    />
  );
}

/** Hero pills and category cards share one (memoized) categories read. */
async function HeroCategoryPills() {
  return <CategoryPills categories={await getStorefrontCategories()} />;
}

async function HomeCategories() {
  return <CategoriesSection categories={await getStorefrontCategories()} />;
}

export default function HomePage() {
  // Nothing is awaited here. The hero shell and every static section stream
  // immediately; only the sections fed by the backend (products, categories)
  // wait on it, each behind its own Suspense boundary. A slow or failing API
  // can no longer hold up the page.
  return (
    <>
      <HeroSection
        pills={
          <Suspense fallback={<CategoryPillsSkeleton />}>
            <HeroCategoryPills />
          </Suspense>
        }
      >
        <Suspense fallback={<HeroShowcaseSkeleton />}>
          <HeroProducts />
        </Suspense>
      </HeroSection>

      <Suspense fallback={<FeaturedProductsSkeleton />}>
        <ExploreProducts />
      </Suspense>

      <TrustSection />
      <Suspense fallback={null}>
        <HomeCategories />
      </Suspense>
      <WhySection />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
