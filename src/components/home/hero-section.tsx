"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Tag,
  Cpu,
  Antenna,
  StickyNote,
  Package,
  Wrench,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/shared/fade-in";
import { ProductImage } from "@/components/shared/product-image";
import type { ProductCard } from "@/lib/products";
import { formatCurrency } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "Tags", slug: "rfid-tags", icon: Tag, color: "from-blue-500/10 to-blue-600/5", border: "border-blue-200/60", text: "text-blue-700", iconBg: "bg-blue-500" },
  { name: "Readers", slug: "rfid-readers", icon: Cpu, color: "from-amber-500/10 to-amber-600/5", border: "border-amber-200/60", text: "text-amber-700", iconBg: "bg-amber-500" },
  { name: "Antennas", slug: "rfid-antennas", icon: Antenna, color: "from-emerald-500/10 to-emerald-600/5", border: "border-emerald-200/60", text: "text-emerald-700", iconBg: "bg-emerald-500" },
  { name: "Labels", slug: "rfid-labels", icon: StickyNote, color: "from-violet-500/10 to-violet-600/5", border: "border-violet-200/60", text: "text-violet-700", iconBg: "bg-violet-500" },
  { name: "Kits", slug: "rfid-kits", icon: Package, color: "from-rose-500/10 to-rose-600/5", border: "border-rose-200/60", text: "text-rose-700", iconBg: "bg-rose-500" },
  { name: "Accessories", slug: "accessories", icon: Wrench, color: "from-zinc-500/10 to-zinc-600/5", border: "border-zinc-200/60", text: "text-zinc-700", iconBg: "bg-zinc-500" },
];

const AUTO_ROTATE_MS = 5000;

type HeroSectionProps = {
  /** Products rendered in the rotating spotlight — already fetched on the server. */
  spotlight: ProductCard[];
  /** Products rendered in the 4-up grid below the spotlight. */
  quickBrowse: ProductCard[];
};

export function HeroSection({ spotlight, quickBrowse }: HeroSectionProps) {
  const router = useRouter();
  const [activeSpotlight, setActiveSpotlight] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Respect the OS-level motion preference and skip the whole intro timeline
    // for users who asked for less animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = gsap.timeline();

    // Text stagger reveal
    if (textRef.current) {
      tl.fromTo(textRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }

    // Search bar reveal
    if (searchRef.current) {
      tl.fromTo(searchRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        }, "-=0.4"
      );
    }

    // Category pills stagger
    if (pillsRef.current) {
      tl.fromTo(pillsRef.current.children,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
        }, "-=0.2"
      );
    }

    // Spotlight fade in
    if (spotlightRef.current) {
      tl.fromTo(spotlightRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.4"
      );
    }

    // Parallax orbs on scroll
    if (orbsRef.current) {
      gsap.to(orbsRef.current.children, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, { scope: heroRef });

  const goNext = useCallback(() => {
    if (spotlight.length === 0) return;
    setDirection(1);
    setActiveSpotlight((prev) => (prev + 1) % spotlight.length);
  }, [spotlight.length]);

  const goPrev = useCallback(() => {
    if (spotlight.length === 0) return;
    setDirection(-1);
    setActiveSpotlight((prev) => (prev - 1 + spotlight.length) % spotlight.length);
  }, [spotlight.length]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || spotlight.length <= 1) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveSpotlight((prev) => (prev + 1) % spotlight.length);
    }, AUTO_ROTATE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, spotlight.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const currentProduct = spotlight[activeSpotlight];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-white">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── ZONE 1: Headline + Search + Category Pills ─── */}
        <div className="pt-10 pb-8 sm:pt-14 sm:pb-10">
          {/* Headline row */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div ref={textRef}>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] overflow-hidden">
                <span className="block">Enterprise RFID Hardware</span>
              </h1>
              <p className="mt-1.5 text-base text-zinc-500 sm:text-lg">
                Professional-grade tags, readers, antennas & complete tracking systems
              </p>
            </div>

            {/* Search bar */}
            <form
              ref={searchRef}
                onSubmit={handleSearch}
                className="hero-search-glow glass-strong flex w-full items-center gap-2 rounded-xl px-4 py-2.5 shadow-sm transition-all duration-300 sm:w-auto sm:min-w-[320px]"
              >
                <Search className="h-4.5 w-4.5 shrink-0 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-0 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Category pills */}
            <div ref={pillsRef} className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className={`group flex items-center gap-2 rounded-full bg-gradient-to-r ${cat.color} ${cat.border} border px-3.5 py-2 text-sm font-medium ${cat.text} transition-all duration-200 hover:shadow-md hover:scale-[1.03]`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${cat.iconBg}`}>
                    <cat.icon className="h-3 w-3 text-white" />
                  </span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        {/* ─── ZONE 2: Product Spotlight ─── */}
        <div
          ref={spotlightRef}
          className="relative rounded-3xl hero-spotlight-gradient border border-zinc-100 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Decorative glow orbs */}
          <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl animate-glow-pulse" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-200/20 blur-3xl animate-glow-pulse" style={{ animationDelay: "2s" }} />
          </div>

          {currentProduct ? (
            <div className="relative grid min-h-[420px] grid-cols-1 items-center gap-6 p-6 sm:min-h-[400px] sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-12">
              {/* Left: Product Info */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProduct._id + "-info"}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 0.68, 0.36, 1] }}
                  className="relative z-10 flex flex-col pb-16 sm:pb-20 lg:pb-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {currentProduct.categoryName || "Equipment"}
                    </span>
                    {currentProduct.stock > 0 ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        In Stock
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <h2 className="mt-4 text-2xl font-bold leading-tight text-zinc-900 sm:text-3xl lg:text-4xl">
                    {currentProduct.name}
                  </h2>

                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500 sm:text-base">
                    {currentProduct.excerpt}
                  </p>

                  <div className="mt-5 flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-zinc-900 sm:text-4xl">
                      {formatCurrency(currentProduct.price)}
                    </span>
                    {currentProduct.compareAtPrice && currentProduct.compareAtPrice > currentProduct.price && (
                      <span className="text-lg text-zinc-400 line-through">
                        {formatCurrency(currentProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/products/${currentProduct.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-xl hover:shadow-zinc-900/15"
                    >
                      View Product
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Browse Catalog
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Right: Product Image */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProduct._id + "-image"}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 0.68, 0.36, 1], delay: 0.05 }}
                  className="relative flex items-center justify-center"
                >
                  <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[300px] lg:h-[340px]">
                    {/* Soft glow behind product */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-48 w-48 rounded-full bg-blue-100/40 blur-3xl sm:h-56 sm:w-56" />
                    </div>
                    <ProductImage
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      // The spotlight image is the LCP element — load it eagerly
                      // for the first slide only.
                      priority={activeSpotlight === 0}
                      className="relative z-10 object-contain drop-shadow-2xl animate-hero-float"
                      fallbackClassName="relative z-10 animate-hero-float"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Spotlight nav controls */}
              <div className="absolute bottom-5 left-6 right-6 z-20 flex items-center justify-between sm:bottom-8 sm:left-10 sm:right-10 lg:left-12 lg:right-12">
                <div className="flex items-center gap-2">
                  {spotlight.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > activeSpotlight ? 1 : -1);
                        setActiveSpotlight(idx);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeSpotlight
                          ? "w-8 bg-zinc-900"
                          : "w-2 bg-zinc-300 hover:bg-zinc-400"
                      }`}
                      aria-label={`View product ${idx + 1}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={goPrev}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-600 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                    aria-label="Previous product"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={goNext}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-600 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md"
                    aria-label="Next product"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center">
              <p className="text-zinc-400">No products available</p>
            </div>
          )}
        </div>

        {/* ─── ZONE 3: Quick Browse Grid ─── */}
        {quickBrowse.length > 0 && (
          <FadeIn delay={0.15}>
            <div className="mt-8 mb-6 sm:mt-10 sm:mb-8">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-zinc-900 sm:text-xl">
                  Quick Browse
                </h3>
                <Link
                  href="/products"
                  className="group flex items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  View all
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {quickBrowse.map((product, idx) => (
                  <FadeIn key={product._id} delay={0.05 * idx}>
                    <Link
                      href={`/products/${product.slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white transition-all duration-300 hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-200/40 hover:-translate-y-1"
                    >
                      {/* Product image */}
                      <div className="relative flex h-36 items-center justify-center bg-zinc-50/60 p-4 sm:h-44 sm:p-6">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
                          className="p-4 object-contain transition-transform duration-500 group-hover:scale-110 sm:p-6"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/0 transition-colors duration-300 group-hover:bg-zinc-900/5">
                          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-900 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                            View Details →
                          </span>
                        </div>
                      </div>

                      {/* Product info */}
                      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 sm:text-xs">
                          {product.categoryName || "Equipment"}
                        </span>
                        <h4 className="mt-1 text-sm font-semibold leading-tight text-zinc-900 line-clamp-1 group-hover:text-blue-600 transition-colors sm:text-base">
                          {product.name}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-base font-bold text-zinc-900 sm:text-lg">
                            {formatCurrency(product.price)}
                          </span>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-all group-hover:bg-zinc-900 group-hover:text-white sm:h-8 sm:w-8">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ─── Stats strip ─── */}
        <FadeIn delay={0.2}>
          <div className="border-t border-zinc-100 py-6 sm:py-8">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
              {[
                { value: "12K+", label: "Products shipped" },
                { value: "98.5%", label: "Uptime SLA" },
                { value: "24hr", label: "Avg. ship time" },
                { value: "99.9%", label: "Read accuracy" },
              ].map((stat, idx) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {idx > 0 && (
                    <div className="hidden h-8 w-px bg-zinc-200 sm:block" />
                  )}
                  <div className={idx > 0 ? "sm:ml-3" : ""}>
                    <div className="text-xl font-bold text-zinc-900 sm:text-2xl">{stat.value}</div>
                    <div className="text-xs text-zinc-500 sm:text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
