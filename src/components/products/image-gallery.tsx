"use client";

import { useState } from "react";
import { ProductMedia } from "@/components/shared/product-image";
import { cn } from "@/lib/utils";

/**
 * Product photos on the shared plate: one large view and, when there's more
 * than one photo, a row of thumbnails. Photos are fitted, never cropped.
 */
export function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <ProductMedia
        src={images[selected]}
        alt={images.length > 1 ? `${productName}, photo ${selected + 1} of ${images.length}` : productName}
        placeholder={productName}
        sizes="(max-width: 1024px) 100vw, 720px"
        priority
        className="aspect-square rounded-card border border-border sm:aspect-[4/3] lg:aspect-square"
        imageClassName="p-[9%]"
      />

      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label="Product photos">
          {images.map((image, i) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-current={i === selected ? "true" : undefined}
                className={cn(
                  "block w-full overflow-hidden rounded-control border transition-colors",
                  i === selected ? "border-foreground" : "border-border hover:border-border-strong"
                )}
              >
                {/* The first thumbnail shares its URL with the eager main photo; loading it eagerly too keeps
                    Next from flagging the LCP image as lazy. */}
                <ProductMedia
                  src={image}
                  alt=""
                  sizes="120px"
                  priority={i === 0}
                  className="aspect-square"
                  imageClassName="p-[12%]"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
