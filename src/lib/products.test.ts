import { describe, expect, it } from "vitest";
import { curateHome, HERO_SLIDE_LIMIT, type ProductSummary } from "./products";

let seq = 0;
function card(overrides: Partial<ProductSummary> & { categoryName: string }): ProductSummary {
  seq += 1;
  return {
    _id: `id-${seq}`,
    name: `Product ${seq}`,
    slug: `product-${seq}`,
    price: 1000,
    stock: 5,
    image: `/uploads/p${seq}.png`,
    excerpt: "",
    minimumQuantity: 1,
    keySpecs: [
      { label: "Frequency", value: "860-960 MHz" },
      { label: "Protocol", value: "EPC Gen2" },
    ],
    dimensions: null,
    searchText: "",
    ...overrides,
  };
}

describe("curateHome hero slides", () => {
  const catalog = () => [
    card({ categoryName: "Handheld Reader", price: 51000, slug: "handheld" }),
    card({ categoryName: "Handheld Reader", price: 48000, slug: "handheld-2" }),
    card({ categoryName: "UHF Antenna", price: 7000, slug: "antenna" }),
    card({ categoryName: "Desktop Reader", price: 20000, slug: "desktop" }),
    card({ categoryName: "Four Port Reader", price: 45000, slug: "four-port" }),
    card({ categoryName: "Integrated Reader", price: 30000, slug: "integrated" }),
    card({ categoryName: "Laundry Tags", price: 60, slug: "tags" }),
    card({ categoryName: "Pendrive Reader", price: 1500, slug: "pendrive" }),
  ];

  it("leads with the flagship and takes one product per category", () => {
    const { heroSlides } = curateHome(catalog());
    const categories = heroSlides.map((p) => p.categoryName);

    expect(heroSlides[0].slug).toBe("handheld");
    expect(new Set(categories).size).toBe(categories.length);
    expect(heroSlides.length).toBeLessThanOrEqual(HERO_SLIDE_LIMIT);
    expect(heroSlides.length).toBeGreaterThan(1);
  });

  it("honours the featured hero", () => {
    const { heroSlides } = curateHome(catalog(), { hero: "antenna" });
    expect(heroSlides[0].slug).toBe("antenna");
  });

  it("never repeats a product from the showcase or the rail", () => {
    const { heroSlides, showcase, rail } = curateHome(catalog());
    const ids = [...heroSlides, ...showcase, ...rail].map((p) => p._id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("skips products that are out of stock, photo-less or thinly specified", () => {
    // Four pricier readers fill the showcase, which is picked before the rotation.
    const showcaseFill = ["A", "B", "C", "D"].map((n) =>
      card({ categoryName: `Fill ${n} Reader`, price: 90000 })
    );
    const { heroSlides } = curateHome([
      ...showcaseFill,
      card({ categoryName: "Handheld Reader", price: 99000, slug: "handheld" }),
      card({ categoryName: "Sold Out Reader", stock: 0, price: 40000 }),
      card({ categoryName: "Photo-less Reader", image: null, price: 39000 }),
      card({ categoryName: "Thin Reader", keySpecs: [], price: 38000 }),
      card({ categoryName: "Good Antenna", price: 7000, slug: "good" }),
    ]);

    expect(heroSlides.map((p) => p.slug)).toEqual(["handheld", "good"]);
  });

  it("is a single slide when only one product qualifies", () => {
    const { heroSlides } = curateHome([card({ categoryName: "Handheld Reader" })]);
    expect(heroSlides).toHaveLength(1);
  });

  it("is empty for an empty catalog", () => {
    expect(curateHome([]).heroSlides).toEqual([]);
  });
});
