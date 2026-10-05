"use client";

import { EASE, MOTION_OK, gsap } from "@/lib/motion";

/**
 * The add-to-cart flight: the product photo lifts off its plate, shrinks to a
 * chip and arcs into the header's cart, which then answers with an RF pulse
 * (see CartLink). One function, so every "Add to cart" in the storefront moves
 * the same way.
 *
 * The cart marks itself with `data-cart-target`; a product plate marks itself
 * with `data-flight-source`. Under reduced motion — or if either end can't be
 * found on screen — nothing flies and the cart only gets its landing signal,
 * so the count still updates in step with the inline confirmation.
 */

/** Fired on `window` when a flight lands (or would have). */
export const CART_LANDED = "cart:landed";

/** The photo currently on show inside `source` — stacked galleries keep hidden slides in the DOM. */
function visiblePhoto(source: Element): HTMLImageElement | null {
  for (const img of source.querySelectorAll("img")) {
    if (img.closest("[inert]")) continue;
    const rect = img.getBoundingClientRect();
    if (rect.width > 0 && getComputedStyle(img).visibility !== "hidden") return img;
  }
  return null;
}

function onScreen(rect: DOMRect) {
  return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

export function flyToCart(source: Element | null): Promise<void> {
  const land = () => window.dispatchEvent(new CustomEvent(CART_LANDED));
  const target = document.querySelector<HTMLElement>("[data-cart-target]");
  const photo = source ? visiblePhoto(source) : null;

  if (!window.matchMedia(MOTION_OK).matches || !target || !source || !photo) {
    land();
    return Promise.resolve();
  }

  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (!onScreen(from) || to.width === 0) {
    land();
    return Promise.resolve();
  }

  // The chip: the same plate + multiplied photo every product sits on.
  const chip = document.createElement("div");
  chip.setAttribute("aria-hidden", "true");
  chip.className =
    "pointer-events-none fixed top-0 left-0 z-[60] overflow-hidden rounded-card border border-border bg-muted shadow-overlay";
  const img = document.createElement("img");
  img.src = photo.currentSrc || photo.src;
  img.alt = "";
  img.className = "product-photo size-full object-contain p-[10%]";
  chip.append(img);
  document.body.append(chip);

  // Start as a square over the plate's centre, at the plate's own size.
  const startSize = Math.min(from.width, from.height, 360);
  const chipSize = Math.min(88, startSize);
  const sx = from.left + from.width / 2 - startSize / 2;
  const sy = from.top + from.height / 2 - startSize / 2;
  const tx = to.left + to.width / 2 - startSize / 2;
  const ty = to.top + to.height / 2 - startSize / 2;
  const shrink = chipSize / startSize;

  gsap.set(chip, { width: startSize, height: startSize, x: sx, y: sy, transformOrigin: "50% 50%" });

  return new Promise((resolve) => {
    const done = () => {
      chip.remove();
      land();
      resolve();
    };
    gsap
      .timeline({ onComplete: done, onInterrupt: done })
      // Lift: the photo detaches from the plate.
      .fromTo(chip, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: shrink, duration: 0.28, ease: EASE.emphasized })
      // Flight: x and y on different curves make an arc toward the cart.
      .to(chip, { x: tx, duration: 0.62, ease: "power2.inOut" }, 0.22)
      .to(chip, { y: ty, duration: 0.62, ease: "back.in(1.4)" }, 0.22)
      .to(chip, { scale: 0.16, duration: 0.62, ease: "power2.in" }, 0.22)
      .to(chip, { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.74);
  });
}
