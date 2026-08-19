"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  /** Absolute URLs, already resolved against the backend origin. */
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="w-full max-w-2xl sm:block lg:max-w-none">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm relative">
            <div className="absolute inset-0 flex h-full items-center justify-center bg-zinc-100 text-zinc-400">
              <Package className="h-24 w-24 opacity-20" />
              <span className="sr-only">No image available</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Main Image — the LCP element on a product page, so it loads eagerly.
          Originals are ~500 KB PNGs; <Image> serves a right-sized WebP instead. */}
      <div className="w-full max-w-2xl sm:block lg:max-w-none">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white border border-zinc-200 shadow-sm relative">
          <Image
            src={images[selectedIndex]}
            alt={`${productName} image ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            priority
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Thumbnails — small renditions, lazily loaded. */}
      {images.length > 1 && (
        <div className="mx-auto w-full max-w-2xl sm:block lg:max-w-none">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {images.map((image, idx) => (
              <button
                key={image + idx}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg bg-white overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                  selectedIndex === idx
                    ? "ring-2 ring-blue-500 ring-offset-2 border-transparent"
                    : "border border-zinc-200 hover:border-zinc-300 opacity-70 hover:opacity-100"
                )}
              >
                <span className="sr-only">
                  {productName} image {idx + 1}
                </span>
                <Image
                  src={image}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
