import Image from "next/image";
import { Package } from "lucide-react";
import { cn, getServerUrl } from "@/lib/utils";

type ProductImageProps = {
  /** Raw path from the API, e.g. "/uploads/image-123.png". */
  src?: string | null;
  alt: string;
  /** Applied to the <Image> itself, so object-fit/padding still work. */
  className?: string;
  /** Rendered width hints — required by `fill` to pick a sensible source size. */
  sizes: string;
  /** Set on the LCP image only (the hero spotlight). */
  priority?: boolean;
  fallbackClassName?: string;
};

/**
 * Product photo rendered through the Next.js Image Optimizer.
 *
 * The backend serves originals as unoptimized PNGs of roughly half a megabyte
 * each; a catalog page with 30 of them was pulling well over 10 MB. Going
 * through <Image> resizes to the actual display size, re-encodes to WebP, and
 * lazy-loads everything below the fold.
 *
 * Uses `fill`, so every caller must position the wrapper (`relative`).
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fallbackClassName,
}: ProductImageProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center text-zinc-300",
          fallbackClassName
        )}
      >
        <Package className="h-1/3 w-1/3" />
      </div>
    );
  }

  return (
    <Image
      src={getServerUrl(src)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
