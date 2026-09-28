"use client";

import { useState, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


type HeroSectionProps = {
  /**
   * The product-fed showcase (spotlight + quick browse), passed in from the
   * page so it can sit behind its own Suspense boundary. Everything this
   * component renders itself is static, so the headline and search box paint
   * without waiting on the backend.
   */
  children?: ReactNode;
  /**
   * The shop-by-category pills, built from the live category tree and passed
   * in behind their own Suspense boundary for the same reason.
   */
  pills?: ReactNode;
};

export function HeroSection({ children, pills }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

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
  }, { scope: heroRef });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
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

            {/* Category pills: streamed in from the live category tree */}
            {pills}
          </div>


        {children}

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
