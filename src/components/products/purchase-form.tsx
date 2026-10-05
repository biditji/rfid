"use client";

import { useId, useRef, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { ActionLink } from "@/components/shared/section-header";
import { QuantityStepper } from "@/components/shared/quantity-stepper";
import { useAddToCart } from "@/lib/use-add-to-cart";

/**
 * Quantity, Add to cart and Request a quote — the purchase controls that sit
 * directly under the price on the product page.
 *
 * The quantity starts at, and can't go below, the product's minimum order
 * (tags sell in hundreds). Results are announced inline in a live region: the
 * old flow gave no confirmation at all, and signed-out visitors got a
 * browser alert().
 *
 * A successful add flies the photo on show in the gallery (the page's
 * `[data-flight-source]`) into the header cart, and the button reads "Added"
 * for a moment before returning to normal.
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
  const [quantity, setQuantity] = useState(minimumQuantity);
  const { status, setStatus, added, justAdded, add } = useAddToCart();
  const qtyId = useId();
  const button = useRef<HTMLButtonElement>(null);

  const purchasable = stock >= minimumQuantity;

  const onAdd = () => {
    const source = document.querySelector("[data-flight-source]") ?? button.current;
    void add(productId, quantity, source);
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
          ref={button}
          size="xl"
          className="min-w-48 flex-1"
          onClick={onAdd}
          disabled={!purchasable}
          loading={status === "adding"}
          loadingText="Adding…"
          startIcon={justAdded ? <Check className="motion-safe:animate-in motion-safe:zoom-in-50" /> : <ShoppingCart />}
        >
          {!purchasable ? "Out of stock" : justAdded ? "Added" : "Add to cart"}
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
