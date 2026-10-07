import { describe, expect, it } from "vitest";
import { HOME_TITLE, pageMetadata, stripBrand } from "./seo";

describe("stripBrand", () => {
  it.each([
    ["HRD 13 | Virtualsphere", "HRD 13"],
    ["HRD 13 | Virtualsphere | Virtualsphere", "HRD 13"],
    ["Privacy Policy - Virtualsphere", "Privacy Policy"],
    ["UDR-W101 RFID Desktop Reader & Writer|Virtualsphere", "UDR-W101 RFID Desktop Reader & Writer"],
    ["VST-9662 RFID UHF Inlay | Higgs-3 Tag | virtualsphere", "VST-9662 RFID UHF Inlay | Higgs-3 Tag"],
  ])("removes the trailing brand from %j", (input, expected) => {
    expect(stripBrand(input)).toBe(expected);
  });

  it("leaves titles that don't end in the brand alone", () => {
    expect(stripBrand("UDR-W101 UHF RFID Desktop Reader & Writer")).toBe("UDR-W101 UHF RFID Desktop Reader & Writer");
    expect(stripBrand("Virtualsphere UA9 Antenna")).toBe("Virtualsphere UA9 Antenna");
    expect(stripBrand("Virtualsphere")).toBe("Virtualsphere");
  });

  it("keeps hyphens inside model names", () => {
    expect(stripBrand("VSL-A1 Android UHF RFID Fixed Reader")).toBe("VSL-A1 Android UHF RFID Fixed Reader");
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    title: "UA9 9dBi Circular UHF RFID Antenna",
    description: "A description.",
    path: "/products/ua9",
    images: ["https://backend.indiarfidshop.com/uploads/ua9.png"],
  });

  it("leaves the brand to the layout's template for the <title>", () => {
    expect(meta.title).toBe("UA9 9dBi Circular UHF RFID Antenna");
  });

  it("spells the brand out in the social titles, which the template doesn't reach", () => {
    expect(meta.openGraph?.title).toBe("UA9 9dBi Circular UHF RFID Antenna | Virtualsphere");
    expect(meta.twitter?.title).toBe("UA9 9dBi Circular UHF RFID Antenna | Virtualsphere");
  });

  it("sets the canonical URL and the share URL to the same path", () => {
    expect(meta.alternates?.canonical).toBe("/products/ua9");
    expect(meta.openGraph).toMatchObject({ url: "/products/ua9", type: "website", siteName: "Virtualsphere" });
  });

  it("passes the image and description to both social cards", () => {
    expect(meta.openGraph).toMatchObject({
      description: "A description.",
      images: [{ url: "https://backend.indiarfidshop.com/uploads/ua9.png" }],
    });
    expect(meta.twitter).toMatchObject({
      description: "A description.",
      images: ["https://backend.indiarfidshop.com/uploads/ua9.png"],
    });
  });

  it("uses an absolute title untouched, so the homepage isn't branded twice", () => {
    const home = pageMetadata({ title: HOME_TITLE, absolute: true, path: "/" });
    expect(home.title).toEqual({ absolute: HOME_TITLE });
    expect(home.openGraph?.title).toBe(HOME_TITLE);
  });

  it("omits the description key when there is none, so the layout's description survives the merge", () => {
    const bare = pageMetadata({ title: "Contact Us", path: "/contact" });
    expect(bare).not.toHaveProperty("description");
    expect(bare.openGraph).not.toHaveProperty("description");
  });
});
