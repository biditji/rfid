import { describe, expect, it } from "vitest";
import { HOME_TITLE, cleanProductName, pageMetadata, stripBrand } from "./seo";

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

describe("cleanProductName", () => {
  it.each([
    // The product names the SEO audit found with pipe text in the <h1>.
    ["UDR-W101 RFID Desktop Reader & Writer | Virtualsphere", "UDR-W101 RFID Desktop Reader & Writer"],
    ["UDT9R RFID Jewellery Tray Reader | Virtualsphere", "UDT9R RFID Jewellery Tray Reader"],
    ["UHR2 UHF RFID Handheld Reader | Virtualsphere", "UHR2 UHF RFID Handheld Reader"],
    ["VSL-F2 UHF RFID 4 Port Reader | Impinj E710", "VSL-F2 UHF RFID 4 Port Reader – Impinj E710"],
  ])("cleans %j", (input, expected) => {
    expect(cleanProductName(input)).toBe(expected);
  });

  it("drops the brand but keeps every other segment, joined with a dash", () => {
    expect(cleanProductName("HRD 13 | USB Reader | Virtualsphere")).toBe("HRD 13 – USB Reader");
    expect(cleanProductName("HRD 13|USB Reader")).toBe("HRD 13 – USB Reader");
  });

  it("ignores stray and doubled pipes", () => {
    expect(cleanProductName("| UHR 72 |")).toBe("UHR 72");
    expect(cleanProductName("UHR 72 || Handheld")).toBe("UHR 72 – Handheld");
  });

  it("leaves a name without pipes alone, hyphens included", () => {
    expect(cleanProductName("VSL-A1 Android UHF RFID Fixed Reader")).toBe("VSL-A1 Android UHF RFID Fixed Reader");
    expect(cleanProductName("UHR 72")).toBe("UHR 72");
  });

  it("falls back to the stored name when nothing is left, rather than an empty heading", () => {
    expect(cleanProductName("| Virtualsphere")).toBe("| Virtualsphere");
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
