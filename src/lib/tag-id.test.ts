import { describe, expect, it } from "vitest";
import { tagId } from "./tag-id";

describe("tagId", () => {
  it("groups a catalog ObjectId like an EPC readout", () => {
    expect(tagId("64f3a1b2c3d4e5f601234567")).toBe("64F3 A1B2 C3D4 E5F6 0123 4567");
  });

  it("truncates to the requested number of groups", () => {
    expect(tagId("64f3a1b2c3d4e5f601234567", 3)).toBe("64F3 A1B2 C3D4 …");
  });

  it("passes through anything that isn't a 96-bit hex id", () => {
    expect(tagId("prod-1")).toBe("PROD-1");
  });
});
