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

  it("shows the pinned slides in the order given, even from one category", () => {
    const { heroSlides } = curateHome(catalog(), {
      heroSlides: ["antenna", "handheld-2", "handheld", "desktop", "tags"],
    });
    expect(heroSlides.map((p) => p.slug)).toEqual(["antenna", "handheld-2", "handheld", "desktop", "tags"]);
  });

  it("fills slots left by pinned slides that aren't live or in stock", () => {
    const cards = catalog();
    cards.push(card({ categoryName: "Sold Out Reader", stock: 0, slug: "sold-out" }));
    const { heroSlides } = curateHome(cards, { heroSlides: ["antenna", "sold-out", "missing", "antenna"] });

    expect(heroSlides[0].slug).toBe("antenna");
    expect(heroSlides.map((p) => p.slug)).not.toContain("sold-out");
    expect(new Set(heroSlides.map((p) => p._id)).size).toBe(heroSlides.length);
    expect(heroSlides.length).toBeGreaterThan(1);
  });

  it("never pins more than the slide limit", () => {
    const cards = catalog();
    const { heroSlides } = curateHome(cards, { heroSlides: cards.map((p) => p.slug) });
    expect(heroSlides).toHaveLength(HERO_SLIDE_LIMIT);
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

describe("curateHome spotlight", () => {
  it("presents an in-stock, presentable product used nowhere else on the page", () => {
    const cards = [
      ...["A", "B", "C", "D", "E", "F"].map((n) => card({ categoryName: `${n} Reader`, price: 90000 })),
      card({ categoryName: "Sold Out Reader", stock: 0, price: 95000 }),
      // Same categories as above, so the hero's one-per-category fill leaves them.
      card({ categoryName: "A Reader", price: 80000, slug: "left-1" }),
      card({ categoryName: "B Reader", price: 70000, slug: "left-2" }),
    ];
    const { heroSlides, showcase, spotlight, rail } = curateHome(cards);

    expect(spotlight?.slug).toBe("left-1");
    expect(spotlight!.stock).toBeGreaterThan(0);
    const elsewhere = [...heroSlides, ...showcase, ...rail].map((p) => p._id);
    expect(elsewhere).not.toContain(spotlight!._id);
  });

  it("is null when nothing is left to present", () => {
    expect(curateHome([card({ categoryName: "Handheld Reader" })]).spotlight).toBeNull();
    expect(curateHome([]).spotlight).toBeNull();
  });
});
