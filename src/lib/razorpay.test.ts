import { describe, expect, it } from "vitest";
import { ApiError } from "./api";
import { checkoutErrorMessage } from "./razorpay";

describe("checkoutErrorMessage", () => {
  it("shows the backend's own refusal for a client error", () => {
    expect(checkoutErrorMessage(new ApiError("No items in cart", 400))).toBe("No items in cart");
  });

  it("asks a signed-out customer to sign in rather than showing 'token failed'", () => {
    expect(checkoutErrorMessage(new ApiError("Not authorized, token failed", 401))).toMatch(/sign in again/i);
  });

  it("offers phone and WhatsApp when payments aren't set up", () => {
    expect(checkoutErrorMessage(new ApiError("Payments not configured", 503))).toMatch(/call or whatsapp/i);
  });

  it("passes on the proxy's 'backend unreachable' explanation", () => {
    const message = "The store backend is unreachable right now. Please try again.";
    expect(checkoutErrorMessage(new ApiError(message, 502))).toBe(message);
  });

  it("hides a bare 500 behind a useful message", () => {
    const message = checkoutErrorMessage(new ApiError("Server Error", 500));
    expect(message).not.toContain("Server Error");
    expect(message).toMatch(/couldn't start your payment/i);
  });

  it("copes with a network failure that isn't an ApiError at all", () => {
    expect(checkoutErrorMessage(new TypeError("Failed to fetch"))).toMatch(/couldn't start your payment/i);
  });
});
