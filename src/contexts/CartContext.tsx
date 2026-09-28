"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
} from "@/lib/api";
import type { Product } from "@/types";

type CartItem = {
  _id?: string;
  /** Populated by the backend; null if the product has since been deleted. */
  product: Product | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const cartData = await fetchCart();
      setItems(cartData.items || []);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Re-syncs the cart with the backend whenever the signed-in user changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!authLoading) refreshCart();
  }, [authLoading, refreshCart]);

  /**
   * Apply `optimistic` immediately, then replace it with the server's cart.
   * If the request fails the optimistic change is rolled back, so the UI never
   * keeps showing a quantity the backend didn't accept. The error is rethrown
   * for the caller to report.
   */
  const mutateCart = useCallback(
    async (
      optimistic: (current: CartItem[]) => CartItem[],
      send: () => Promise<{ items?: CartItem[] }>
    ) => {
      if (!user) return;

      const previous = items;
      setItems(optimistic(previous));

      try {
        const updated = await send();
        setItems(updated.items || []);
      } catch (error) {
        setItems(previous);
        throw error;
      }
    },
    [items, user]
  );

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!user) {
        // Guest carts need backend support; until then, ask them to sign in.
        alert("Please log in to add items to your cart.");
        return;
      }

      // Only an item already in the cart can be bumped optimistically — a new
      // one has no product data to render until the server answers.
      await mutateCart(
        (current) =>
          current.map((i) =>
            i.product?._id === productId ? { ...i, quantity: i.quantity + quantity } : i
          ),
        () => apiAddToCart(productId, quantity)
      );
    },
    [mutateCart, user]
  );

  const removeFromCart = useCallback(
    (productId: string) =>
      mutateCart(
        (current) => current.filter((i) => i.product?._id !== productId),
        () => apiRemoveFromCart(productId)
      ),
    [mutateCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) return removeFromCart(productId);

      return mutateCart(
        (current) =>
          current.map((i) => (i.product?._id === productId ? { ...i, quantity } : i)),
        () => apiUpdateCartQuantity(productId, quantity)
      );
    },
    [mutateCart, removeFromCart]
  );

  const value = useMemo(() => {
    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce(
      (total, item) => total + (item.product?.price ?? 0) * item.quantity,
      0
    );
    return {
      items,
      cartCount,
      cartTotal,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      refreshCart,
    };
  }, [items, loading, addToCart, removeFromCart, updateQuantity, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
