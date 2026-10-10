import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

const redirects = async () => (await nextConfig.redirects?.()) ?? [];

describe("category slug redirects", () => {
  const categoryRedirects = async () => (await redirects()).filter((redirect) => redirect.source === "/products");

  it.each([
    ["raid-tags", "rfid-tags"],
    ["rfid-laundary-tags", "rfid-laundry-tags"],
  ])("sends ?category=%s to ?category=%s with a 301", async (from, to) => {
    expect(await redirects()).toContainEqual({
      source: "/products",
      has: [{ type: "query", key: "category", value: from }],
      destination: `/products?category=${to}`,
      statusCode: 301,
    });
  });

  it("only touches the listing's category filter", async () => {
    for (const redirect of await categoryRedirects()) {
      expect(redirect.has).toHaveLength(1);
      expect(redirect.has?.[0]).toMatchObject({ type: "query", key: "category" });
    }
  });

  it("never redirects a corrected slug, so the redirects can't loop", async () => {
    const all = await categoryRedirects();
    const oldSlugs = all.flatMap((redirect) => redirect.has?.map((has) => has.value) ?? []);
    const newSlugs = all.map((redirect) => new URL(redirect.destination, "https://example.com").searchParams.get("category"));

    expect(newSlugs).toHaveLength(oldSlugs.length);
    for (const slug of newSlugs) expect(oldSlugs).not.toContain(slug);
  });
});

describe("product slug redirects", () => {
  const productRedirects = async () =>
    (await redirects()).filter((redirect) => redirect.source.startsWith("/products/"));

  it("sends the misspelled laundry tag URL to the corrected one with a 301", async () => {
    expect(await redirects()).toContainEqual({
      source: "/products/RFID-silicon-tags-UHF-laundary-tags",
      destination: "/products/RFID-silicon-tags-UHF-laundry-tags",
      statusCode: 301,
    });
  });

  it("matches one exact product path each, with no wildcard that could swallow other products", async () => {
    for (const redirect of await productRedirects()) {
      expect(redirect.source).not.toMatch(/[:*()?+]/);
      expect(redirect.has).toBeUndefined();
    }
  });

  it("never redirects a corrected slug, so the redirects can't loop", async () => {
    const all = await productRedirects();
    const oldPaths = all.map((redirect) => redirect.source);

    for (const redirect of all) expect(oldPaths).not.toContain(redirect.destination);
  });
});
