import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { TrustSection } from "@/components/home/trust-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { WhySection } from "@/components/home/why-section";
import { IndustriesSection } from "@/components/home/industries-section";
import { CTASection } from "@/components/home/cta-section";

export const metadata: Metadata = {
  title: "RFIDHub — Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <CategoriesSection />
      <FeaturedProducts />
      <WhySection />
      <IndustriesSection />
      <CTASection />
    </>
  );
}
