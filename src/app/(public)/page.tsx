import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { HeroVisual, HeroVisualSkeleton } from "@/components/home/hero-visual";
import { ShowcaseSection, ShowcaseSkeleton } from "@/components/home/showcase-section";
import { ProductDiscovery, ProductDiscoverySkeleton } from "@/components/home/product-discovery";
import { RfidSystem } from "@/components/home/rfid-system";
import { ProofSection } from "@/components/home/proof-section";
import { WhySection } from "@/components/home/why-section";
import { IndustriesSection } from "@/components/home/industries-section";
import { CtaSection } from "@/components/home/cta-section";
import { ProductsUnavailable } from "@/components/shared/products-unavailable";
import { curateHome, getProductCards, getStorefrontCategories } from "@/lib/products";
import { HOME_FEATURED } from "@/lib/constants";
import { HOME_TITLE, pageMetadata } from "@/lib/seo";

export const revalidate = 300;

// `absolute`: HOME_TITLE already carries the brand, so the layout's template
// must not add it a second time.
export const metadata: Metadata = pageMetadata({
  title: HOME_TITLE,
  absolute: true,
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
  path: "/",
});

/**
 * One catalog read feeds every product slot on the page. `getProductCards()`
 * is memoized per request and shares its cached response with /products, so
 * the sections below cost a single backend round trip between them.
 */
const getHome = cache(async () => {
  const { cards, ok } = await getProductCards();
  return { ok, total: cards.length, ...curateHome(cards, HOME_FEATURED) };
});

async function HeroProduct() {
  const { ok, heroSlides } = await getHome();
  if (!ok) {
    return (
      <ProductsUnavailable description="We couldn't reach the product catalog just now. The rest of the site is unaffected." />
    );
  }
  return heroSlides.length > 0 ? <HeroVisual products={heroSlides} /> : null;
}

async function Showcase() {
  const { ok, showcase } = await getHome();
  // When the catalog is down the hero already says so; don't repeat it.
  if (!ok || showcase.length === 0) return null;
  return <ShowcaseSection products={showcase} />;
}

async function Discovery() {
  const [{ ok, rail, total }, categories] = await Promise.all([getHome(), getStorefrontCategories()]);
  return <ProductDiscovery categories={categories} products={ok ? rail : []} totalProducts={ok ? total : null} />;
}

/**
 * The home page as a narrative: what we sell (hero) → the flagship hardware
 * (stack) → where to start browsing (discovery) → how RFID works (system) →
 * who uses it (proof) → why us → where it's deployed (industries) → the ask.
 *
 * Nothing here awaits at the top level. Static sections stream immediately;
 * only the catalog-fed ones wait, each behind its own Suspense boundary, so a
 * slow backend never holds up the page.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        visual={
          <Suspense fallback={<HeroVisualSkeleton />}>
            <HeroProduct />
          </Suspense>
        }
      />
      <Suspense fallback={<ShowcaseSkeleton />}>
        <Showcase />
      </Suspense>
      <Suspense fallback={<ProductDiscoverySkeleton />}>
        <Discovery />
      </Suspense>
      <RfidSystem />
      <ProofSection />
      <WhySection />
      <IndustriesSection />
      <CtaSection />
    </>
  );
}
