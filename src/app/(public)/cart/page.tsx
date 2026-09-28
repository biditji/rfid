"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder, verifyRazorpayPayment } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { GST_NOTE } from "@/lib/constants";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductMedia } from "@/components/shared/product-image";
import { StockBadge } from "@/components/shared/status-badge";
import { QuantityStepper } from "@/components/shared/quantity-stepper";

/** Razorpay's checkout accent. It only accepts a hex colour; this is --primary. */
const RAZORPAY_THEME = "#18181b";

export default function CartPage() {
  const { user } = useAuth();
  const { items, cartTotal, loading, removeFromCart, updateQuantity, refreshCart } = useCart();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [itemError, setItemError] = useState("");
  const ids = { phone: useId(), address: useId() };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    try {
      setCheckoutError("");
      if (!shippingAddress.trim()) {
        setCheckoutError("Please enter your shipping address.");
        return;
      }
      if (!phoneNumber.trim() || phoneNumber.replace(/\D/g, "").length < 10) {
        setCheckoutError("Please enter a valid phone number.");
        return;
      }

      if (!user) return router.push("/login?redirect=/cart");

      setCheckoutLoading(true);
      const { razorpayOrderId } = await createOrder(shippingAddress, phoneNumber);

      const res = await loadRazorpayScript();
      if (!res) {
        setCheckoutError("The payment window couldn't load. Check your connection and try again.");
        setCheckoutLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: Math.round(cartTotal * 100),
        currency: "INR",
        name: "Virtualsphere",
        description: "RFID Order Payment",
        order_id: razorpayOrderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Razorpay's untyped callback payload
        handler: async function (response: any) {
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await refreshCart();
            router.push("/orders");
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
            setCheckoutError("We couldn't verify your payment. Please contact support before trying again.");
            setCheckoutLoading(false);
          }
        },
        theme: { color: RAZORPAY_THEME },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the Razorpay SDK attaches itself to window untyped
      const paymentObject = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", function (response: any) {
        setCheckoutError(`Payment failed: ${response.error.description}`);
        setCheckoutLoading(false);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Checkout failed:", error);
      setCheckoutError("Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  };

  const changeQuantity = async (productId: string, quantity: number) => {
    setItemError("");
    try {
      await updateQuantity(productId, quantity);
    } catch {
      setItemError("That quantity couldn't be saved. Please try again.");
    }
  };

  const remove = async (productId: string) => {
    setItemError("");
    try {
      await removeFromCart(productId);
    } catch {
      setItemError("That item couldn't be removed. Please try again.");
    }
  };

  const liveItems = items.filter((item) => item.product);

  return (
    <PageContainer className="pt-10 pb-20 lg:pt-14">
      <SectionHeader as="h1" eyebrow="Checkout" title="Cart" />

      {loading ? (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-card" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-card lg:col-span-5" />
        </div>
      ) : liveItems.length === 0 ? (
        <div className="bg-grid mt-10 flex flex-col items-start rounded-card border border-border bg-surface px-6 py-14 sm:px-10">
          <p className="text-h3">Your cart is empty</p>
          <p className="mt-2 text-small text-muted-foreground">
            {user ? "Add products from the catalog to see them here." : "Sign in to see the items in your cart."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/products">Browse products</ButtonLink>
            {!user && (
              <ButtonLink href="/login?redirect=/cart" variant="outline">
                Sign in
              </ButtonLink>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <section aria-label="Items in your cart" className="lg:col-span-7">
            <ul className="divide-y divide-border border-y border-border">
              {liveItems.map((item) => {
                const product = item.product!;
                const min = Math.max(1, product.minimumQuantity ?? 1);
                return (
                  <li key={product._id} className="flex gap-4 py-6 sm:gap-6">
                    <ProductMedia
                      src={product.images?.[0]}
                      alt=""
                      placeholder=""
                      sizes="128px"
                      className="size-24 shrink-0 rounded-card border border-border sm:size-32"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link href={`/products/${product.slug}`} className="text-body font-medium hover:underline">
                            {product.name}
                          </Link>
                          {/[a-z]/i.test(product.sku ?? "") && (
                            <p className="font-mono text-tech text-muted-foreground">{product.sku}</p>
                          )}
                        </div>
                        <p className="shrink-0 text-body font-semibold tabular-nums">
                          {formatCurrency(product.price * item.quantity)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <StockBadge stock={product.stock} />
                        <span className="text-small text-muted-foreground tabular-nums">
                          {formatCurrency(product.price)} each{min > 1 && ` · minimum ${min}`}
                        </span>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-4">
                        <QuantityStepper
                          value={item.quantity}
                          min={min}
                          max={Math.max(item.quantity, product.stock)}
                          label={`Quantity, ${product.name}`}
                          onChange={(quantity) => changeQuantity(product._id, quantity)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(product._id)}
                          startIcon={<Trash2 />}
                          aria-label={`Remove ${product.name}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p aria-live="polite" className="mt-3 min-h-6 text-small text-danger">
              {itemError}
            </p>
          </section>

          <section aria-labelledby="summary-heading" className="lg:col-span-5">
            <div className="rounded-card border border-border bg-card p-6 sm:p-8 lg:sticky lg:top-24">
              <h2 id="summary-heading" className="text-h3">
                Order summary
              </h2>

              <dl className="mt-6 border-t border-border text-small">
                <div className="flex justify-between border-b border-border py-3">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium tabular-nums">{formatCurrency(cartTotal)}</dd>
                </div>
                <div className="flex justify-between border-b border-border py-3">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd>Calculated at checkout</dd>
                </div>
                <div className="flex items-baseline justify-between py-4">
                  <dt className="text-body font-medium">Order total</dt>
                  <dd className="text-h3 tabular-nums">{formatCurrency(cartTotal)}</dd>
                </div>
              </dl>
              <p className="text-meta text-muted-foreground">{GST_NOTE}</p>

              <div className="mt-8 space-y-5 border-t border-border pt-6">
                <h3 className="text-meta text-muted-foreground uppercase">Shipping details</h3>
                <div className="space-y-2">
                  <Label htmlFor={ids.phone}>Phone number</Label>
                  <Input
                    id={ids.phone}
                    type="tel"
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={ids.address}>Delivery address</Label>
                  <Textarea
                    id={ids.address}
                    autoComplete="street-address"
                    placeholder="Street address, city, state and PIN code"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                  />
                </div>

                <p aria-live="polite" className="min-h-5 text-small text-danger">
                  {checkoutError}
                </p>

                <Button
                  size="xl"
                  className="w-full"
                  onClick={handleCheckout}
                  loading={checkoutLoading}
                  loadingText="Processing…"
                  endIcon={<ArrowRight />}
                >
                  Proceed to payment
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </PageContainer>
  );
}
