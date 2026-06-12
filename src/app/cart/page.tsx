"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/lib/api";
import { Trash2, ShoppingCart, ArrowRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CartPage() {
  const { items, cartTotal, loading, removeFromCart, updateQuantity, refreshCart } = useCart();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      const token = localStorage.getItem("rfid_token");
      if (!token) return router.push("/login");

      await createOrder(token);
      await refreshCart(); // This will clear the cart in context
      router.push("/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
      setCheckoutLoading(false); // only stop loading on error so success page transition is smooth
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-zinc-300" />
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-zinc-900">Your cart is empty</h2>
        <p className="mt-4 text-zinc-500">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg px-8 py-6 text-lg font-medium">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Shopping Cart</h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section className="lg:col-span-8">
            <ul role="list" className="divide-y divide-zinc-200 border-b border-t border-zinc-200">
              {items.map((item) => {
                const product = item.product;
                const imageUrl = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "/placeholder.png";

                return (
                  <li key={product._id} className="flex py-6 sm:py-10 bg-white px-6 rounded-xl my-4 shadow-sm border border-zinc-100">
                    <div className="shrink-0">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32 border border-zinc-200"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium">
                              <Link href={`/products/${product.slug}`} className="text-zinc-900 hover:text-blue-600">
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-mono text-zinc-500">SKU: {product.sku}</p>
                          <p className="mt-1 text-lg font-bold text-zinc-900">{formatCurrency(product.price)}</p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${product._id}`} className="sr-only">
                            Quantity, {product.name}
                          </label>
                          <div className="flex items-center border border-zinc-200 rounded-lg w-max bg-white">
                            <button
                              onClick={() => updateQuantity(product._id, item.quantity - 1)}
                              className="px-3 py-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 rounded-l-lg transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-medium text-zinc-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product._id, item.quantity + 1)}
                              className="px-3 py-2 text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="absolute right-0 top-0">
                            <button
                              type="button"
                              onClick={() => removeFromCart(product._id)}
                              className="-m-2 inline-flex p-2 text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <span className="sr-only">Remove</span>
                              <Trash2 className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 flex space-x-2 text-sm text-zinc-700">
                        {product.stock > 0 ? (
                          <span className="text-emerald-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />In stock</span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" />Out of stock</span>
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Order summary */}
          <section className="mt-16 rounded-xl bg-white border border-zinc-200 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8 shadow-sm">
            <h2 id="summary-heading" className="text-lg font-medium text-zinc-900">
              Order summary
            </h2>

            <dl className="mt-6 space-y-4 text-sm text-zinc-600">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="text-zinc-900 font-medium">{formatCurrency(cartTotal)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <dt className="flex items-center text-sm">
                  <span>Shipping estimate</span>
                </dt>
                <dd className="text-zinc-900 font-medium">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <dt className="flex items-center text-sm">
                  <span>Tax estimate</span>
                </dt>
                <dd className="text-zinc-900 font-medium">Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                <dt className="text-base font-medium text-zinc-900">Order total</dt>
                <dd className="text-xl font-bold text-zinc-900">{formatCurrency(cartTotal)}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <Button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-lg rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                {checkoutLoading ? "Processing..." : "1-Click Checkout"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
