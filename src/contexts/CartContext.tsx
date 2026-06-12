"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { fetchCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, updateCartQuantity as apiUpdateCartQuantity } from "@/lib/api";

type CartItem = {
  _id?: string;
  product: any; // Assuming populated product object
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

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("rfid_token");
      if (token) {
        const cartData = await fetchCart(token);
        setItems(cartData.items || []);
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      refreshCart();
    }
  }, [user, authLoading, refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    const token = localStorage.getItem("rfid_token");
    if (!token) {
      // Typically we might redirect to login here, or save to localStorage for guests.
      // Since this requires backend, we alert for now.
      alert("Please log in to add items to your cart.");
      return;
    }
    
    // Optimistic UI update
    const existingItem = items.find(i => i.product._id === productId);
    if (existingItem) {
      setItems(items.map(i => i.product._id === productId ? { ...i, quantity: i.quantity + quantity } : i));
    }

    const updatedCart = await apiAddToCart(productId, quantity, token);
    setItems(updatedCart.items || []);
  };

  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem("rfid_token");
    if (!token) return;

    // Optimistic
    setItems(items.filter(i => i.product._id !== productId));
    
    const updatedCart = await apiRemoveFromCart(productId, token);
    setItems(updatedCart.items || []);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("rfid_token");
    if (!token) return;

    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    // Optimistic
    setItems(items.map(i => i.product._id === productId ? { ...i, quantity } : i));

    const updatedCart = await apiUpdateCartQuantity(productId, quantity, token);
    setItems(updatedCart.items || []);
  };

  return (
    <CartContext.Provider value={{ items, cartCount, cartTotal, loading, addToCart, removeFromCart, updateQuantity, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
