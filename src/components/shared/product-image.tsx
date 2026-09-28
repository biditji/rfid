import Image from "next/image";
import { Package } from "lucide-react";
import { cn, getServerUrl } from "@/lib/utils";

type ProductMediaProps = {
  /** Raw path from the API, e.g. "/uploads/image-123.png". */
  src?: string | null;
  alt: string;
  /** Rendered width hints — required by `fill` to pick a sensible source size. */
  sizes: string;
  /**
   * The LCP image (hero, product page). Loads eagerly at high fetch priority —
   * Next 16's replacement for the deprecated `priority` prop.
   */
  priority?: boolean;
  /** Shown on the placeholder plate when there's no photo, e.g. the model code. */
  placeholder?: string;
  /** Classes for the plate. Set its aspect ratio or height here. */
  className?: string;
  /** Classes for the <img> itself, e.g. extra padding. */
  imageClassName?: string;
  /** Draw the measurement grid on the plate, under the photo. */
  grid?: boolean;
};

/**
 * The product plate: every product photo in the storefront sits on this.
 *
 * Photos come from suppliers on white, at every aspect ratio. Each one is
 * fitted (never cropped) onto the same neutral plate and multiplied into it,
 * so the white box disappears and a catalogue of mismatched shots reads as one
 * set. This only works for photos on white — a supplier shot on black or grey
 * shows as a box, so those need replacing at the source. Products without a
 * photo get a technical placeholder rather than an empty grey box.
 *
 * Goes through the Next.js Image Optimizer: the backend serves ~500 KB PNGs;
 * this resizes to the rendered size, re-encodes to WebP and lazy-loads.
 * Inside a `group` (a card), the photo lifts slightly on hover.
 */
export function ProductMedia({
  src,
  alt,
  sizes,
  priority = false,
  placeholder,
  className,
  imageClassName,
  grid = false,
}: ProductMediaProps) {
  // The plate colour and grid must live inside this element: multiply blends
  // with its backdrop only up to the nearest stacking context, and a parent
  // transform (scroll scale, the product stack) creates one.
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {grid && <div aria-hidden className="bg-grid absolute inset-0" />}
      {src ? (
        <Image
          src={getServerUrl(src)}
          alt={alt}
          fill
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn(
            "product-photo object-contain p-[8%] transition-transform duration-500 ease-emphasized group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            imageClassName
          )}
        />
      ) : (
        <div
          aria-hidden
          className="bg-grid absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground"
        >
          <Package className="size-7" strokeWidth={1.25} />
          {placeholder && <span className="max-w-[80%] truncate font-mono text-tech">{placeholder}</span>}
        </div>
      )}
    </div>
  );
}
