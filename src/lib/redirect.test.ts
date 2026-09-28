import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./redirect";

describe("safeRedirectPath", () => {
  it("keeps in-app paths, including their query string", () => {
    expect(safeRedirectPath("/admin/products?page=2")).toBe("/admin/products?page=2");
  });

  it.each([
    ["an absolute URL", "https://evil.example/phish"],
    ["a protocol-relative URL", "//evil.example"],
    ["a backslash trick", "/\\evil.example"],
    ["a javascript: URL", "javascript:alert(1)"],
    ["an empty value", ""],
    ["a missing value", null],
  ])("falls back for %s", (_label, value) => {
    expect(safeRedirectPath(value)).toBe("/");
  });
});
