"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { flyToCart } from "@/lib/cart-flight";

export type AddStatus = "idle" | "adding" | "added" | "signin" | "error";

/** How long the button holds its "Added" state before returning to normal. */
const ADDED_HOLD_MS = 1600;

/**
 * Add to cart, with the storefront's confirmation sequence: the request runs,
 * then the product photo inside `source` flies to the header cart, and the
 * button reads "Added" briefly (`justAdded`) before returning to normal.
 *
 * Signed-out visitors get `status: "signin"` to explain inline, rather than
 * the cart context's alert().
 */
export function useAddToCart() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [status, setStatus] = useState<AddStatus>("idle");
  const [added, setAdded] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const hold = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(hold.current), []);

  const add = async (productId: string, quantity: number, source?: Element | null) => {
    if (!user) {
      setStatus("signin");
      return;
    }
    setStatus("adding");
    try {
      await addToCart(productId, quantity);
      setAdded(quantity);
      setStatus("added");
      setJustAdded(true);
      clearTimeout(hold.current);
      hold.current = setTimeout(() => setJustAdded(false), ADDED_HOLD_MS);
    } catch {
      setStatus("error");
      return;
    }
    // Purely visual: it never fails the add.
    void flyToCart(source ?? null);
  };

  return { status, setStatus, added, justAdded, add };
}
