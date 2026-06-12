"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export function AddToCartButton({ productId, stock }: { productId: string, stock: number }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    try {
      setAdding(true);
      await addToCart(productId, 1);
      // Could show a toast notification here
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button 
      size="lg" 
      disabled={stock === 0 || adding}
      onClick={handleAdd}
      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-6 text-lg rounded-xl shadow-md transition-all active:scale-[0.98]"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {adding ? "Adding..." : stock > 0 ? "Add to Cart" : "Out of Stock"}
    </Button>
  );
}
