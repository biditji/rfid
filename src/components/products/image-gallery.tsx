"use client";

import { useRef } from "react";
import { Pause, Play } from "lucide-react";
import { ProductMedia } from "@/components/shared/product-image";
import { DURATION, EASE, gsap, useGSAP } from "@/lib/motion";
import { useRotation } from "@/lib/use-rotation";
import { cn } from "@/lib/utils";

/** How long each photo holds the plate before the next fades in. */
const PHOTO_SECONDS = 5;

/**
 * Product photos on the shared plate: one large view and, when there's more
 * than one photo, a row of thumbnails. Photos are fitted, never cropped.
 *
 * With two or more photos the large view cross-fades through them on a timer,
 * with a progress bar running along the active thumbnail. Photos are stacked
 * in one grid cell, so the plate keeps its size however they differ. The timer
 * holds while the visitor is pointing at, focused in, or scrolled away from the
 * gallery, can be paused, and never runs under reduced motion (thumbnails
 * still work).
 */
export function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const root = useRef<HTMLDivElement>(null);
  const count = images.length;
  const { active, setActive, paused, togglePaused, rotating, running, handlers } = useRotation(
    root,
    count,
    PHOTO_SECONDS
  );

  // Which photo was last on show, so the swap knows what to fade out.
  const previous = useRef(0);

  useGSAP(
    () => {
      const node = root.current;
      const from = previous.current;
      previous.current = active;
      if (!node || !rotating) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", node);
      const [leaving, entering] = [slides[from], slides[active]];
      if (from === active || !leaving || !entering) return;

      // Resting visibility comes from classes, which already show the new photo;
      // both ends of each fade are stated so the tween doesn't depend on that.
      gsap
        .timeline()
        .fromTo(leaving, { autoAlpha: 1 }, { autoAlpha: 0, duration: DURATION.swap, ease: EASE.standard }, 0)
        .fromTo(entering, { autoAlpha: 0 }, { autoAlpha: 1, duration: DURATION.reveal, ease: EASE.standard }, 0.15)
        .fromTo(
          entering.querySelector("[data-slide-photo]"),
          { scale: 1.04 },
          { scale: 1, duration: DURATION.intro + 0.2, ease: EASE.emphasized },
          0.1
        );
    },
    { scope: root, dependencies: [active, rotating, count], revertOnUpdate: true }
  );

  // No photos still renders the plate, with its placeholder.
  const photos: (string | undefined)[] = count > 0 ? images : [undefined];

  return (
    <div ref={root} className="space-y-3" {...handlers}>
      <div
        role={count > 1 ? "group" : undefined}
        aria-roledescription={count > 1 ? "carousel" : undefined}
        aria-label={count > 1 ? `Photos of ${productName}` : undefined}
        className="relative overflow-hidden rounded-card border border-border"
      >
        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-4 top-3 z-10 flex items-center justify-between">
            <span aria-hidden className="font-mono text-tech text-muted-foreground tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            {rotating && (
              <button
                type="button"
                aria-label={paused ? "Resume photo rotation" : "Pause photo rotation"}
                onClick={togglePaused}
                className="pointer-events-auto -mr-1.5 flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
              </button>
            )}
          </div>
        )}

        <div className="grid" aria-live={count > 1 && !running ? "polite" : "off"}>
          {photos.map((image, i) => (
            <div
              key={image ?? "placeholder"}
              data-slide
              aria-roledescription={count > 1 ? "slide" : undefined}
              aria-label={count > 1 ? `${i + 1} of ${count}` : undefined}
              // Stacked photos stay laid out but can't be seen or read until shown.
              inert={i !== active}
              className={cn("col-start-1 row-start-1", i === active ? "visible opacity-100" : "invisible opacity-0")}
            >
              <div data-slide-photo>
                <ProductMedia
                  src={image}
                  alt={count > 1 ? `${productName}, photo ${i + 1} of ${count}` : productName}
                  placeholder={productName}
                  sizes="(max-width: 1024px) 100vw, 720px"
                  priority={i === 0}
                  className="aspect-square sm:aspect-[4/3] lg:aspect-square"
                  imageClassName="p-[9%]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6" aria-label="Product photos">
          {images.map((image, i) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === active ? "true" : undefined}
                className={cn(
                  "relative block w-full overflow-hidden rounded-control border transition-colors",
                  i === active ? "border-foreground" : "border-border hover:border-border-strong"
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
                {/* Time left on this photo; only while the timer is in play. */}
                {i === active && rotating && (
                  <span data-progress aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-foreground" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
