import { describe, expect, it } from "vitest";
import { SITE_CONFIG, sdkRequestUrl, whatsappUrl } from "./constants";

describe("whatsappUrl", () => {
  it("builds a wa.me link from the number's digits alone", () => {
    const digits = SITE_CONFIG.whatsapp.replace(/\D/g, "");
    expect(whatsappUrl()).toBe(`https://wa.me/${digits}`);
    expect(digits).toMatch(/^91\d{10}$/);
  });

  it("encodes a first message", () => {
    expect(whatsappUrl("Hi, I need 2 & a quote")).toContain("?text=Hi%2C%20I%20need%202%20%26%20a%20quote");
  });
});

describe("sdkRequestUrl", () => {
  it("addresses the resources mailbox and encodes the subject", () => {
    const url = sdkRequestUrl("SDK request: UDM9A (VS 1)");
    expect(url.startsWith(`mailto:${SITE_CONFIG.sdkEmail}?subject=`)).toBe(true);
    expect(url).toContain("SDK%20request%3A%20UDM9A%20(VS%201)");
    expect(url).not.toContain("&body=");
  });

  it("adds a body only when given one", () => {
    expect(sdkRequestUrl("x", "Reader model: ")).toContain("&body=Reader%20model%3A%20");
  });
});
