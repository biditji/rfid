"use client";

import { useId, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ActionLink } from "@/components/shared/section-header";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

type Status = "idle" | "adding" | "added" | "signin" | "error";

/**
 * Quantity, Add to cart and Request a quote — the purchase controls that sit
 * directly under the price on the product page.
 *
 * The quantity starts at, and can't go below, the product's minimum order
 * (tags sell in hundreds). Results are announced inline in a live region: the
 * old flow gave no confirmation at all, and signed-out visitors got a
 * browser alert().
 */
export function PurchaseForm({
  productId,
  slug,
  name,
  sku,
  stock,
  minimumQuantity,
}: {
  productId: string;
  slug: string;
  name: string;
  sku?: string;
  stock: number;
  minimumQuantity: number;
}) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(minimumQuantity);
  const [status, setStatus] = useState<Status>("idle");
  const [added, setAdded] = useState(0);
  const qtyId = useId();

  const purchasable = stock >= minimumQuantity;

  const add = async () => {
    if (!user) {
      setStatus("signin");
      return;
    }
    setStatus("adding");
    try {
      await addToCart(productId, quantity);
      setAdded(quantity);
      setStatus("added");
    } catch {
      setStatus("error");
    }
  };

  const quoteHref = `/contact?${new URLSearchParams({
    topic: "quote",
    product: sku ? `${name} (${sku})` : name,
    qty: String(quantity),
  })}`;

  return (
    <div>
      <label htmlFor={qtyId} className="text-meta text-muted-foreground uppercase">
        Quantity{minimumQuantity > 1 && ` — minimum ${minimumQuantity}`}
      </label>
      <div className="mt-2 flex flex-wrap gap-3">
        <QuantityStepper
          id={qtyId}
          size="xl"
          value={quantity}
          onChange={(value) => {
            setQuantity(value);
            if (status !== "adding") setStatus("idle");
          }}
          min={minimumQuantity}
          max={Math.max(minimumQuantity, stock)}
          disabled={!purchasable}
        />
        <Button
          size="xl"
          className="min-w-48 flex-1"
          onClick={add}
          disabled={!purchasable}
          loading={status === "adding"}
          loadingText="Adding…"
          startIcon={<ShoppingCart />}
        >
          {purchasable ? "Add to cart" : "Out of stock"}
        </Button>
      </div>

      <ButtonLink href={quoteHref} variant="outline" size="xl" className="mt-3 w-full">
        {purchasable ? "Request a quote" : "Ask about availability"}
      </ButtonLink>

      <div aria-live="polite" className="mt-3 min-h-6 text-small">
        {status === "added" && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-success">
            Added {added} to your cart.
            <ActionLink href="/cart">View cart</ActionLink>
          </p>
        )}
        {status === "signin" && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
            Sign in to add items to your cart.
            <ActionLink href={`/login?redirect=${encodeURIComponent(`/products/${slug}`)}`}>Sign in</ActionLink>
          </p>
        )}
        {status === "error" && (
          <p className="text-danger">Couldn&apos;t add this to your cart. Please try again.</p>
        )}
      </div>
    </div>
  );
}
