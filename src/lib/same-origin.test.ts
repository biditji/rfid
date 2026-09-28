import { describe, expect, it } from "vitest";
import { isSameOrigin } from "./same-origin";

const post = (headers: Record<string, string>) =>
  new Request("https://shop.example/api/auth/login", { method: "POST", headers });

describe("isSameOrigin", () => {
  it("accepts a request from this site", () => {
    expect(isSameOrigin(post({ host: "shop.example", origin: "https://shop.example" }))).toBe(true);
  });

  it("rejects a request another site forged", () => {
    expect(isSameOrigin(post({ host: "shop.example", origin: "https://evil.example" }))).toBe(false);
  });

  it("trusts the browser's Sec-Fetch-Site verdict", () => {
    expect(
      isSameOrigin(post({ host: "shop.example", origin: "https://shop.example", "sec-fetch-site": "cross-site" }))
    ).toBe(false);
  });

  it("honours the forwarded host behind a reverse proxy", () => {
    expect(
      isSameOrigin(
        post({ host: "10.0.0.5:3000", "x-forwarded-host": "shop.example", origin: "https://shop.example" })
      )
    ).toBe(true);
  });

  it("allows non-browser clients, which can't carry a victim's cookies", () => {
    expect(isSameOrigin(post({ host: "shop.example" }))).toBe(true);
  });
});
