"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Background scaling reveal
    gsap.fromTo(
      bgRef.current,
      {
        scale: 0.8,
        borderRadius: "4rem",
      },
      {
        scale: 1,
        borderRadius: "0rem",
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      }
    );

    // Text stagger reveal
    const textElements = textRef.current?.children;
    if (textElements) {
      gsap.fromTo(
        textElements,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-24 sm:py-32 overflow-hidden bg-white">
      <div 
        ref={bgRef} 
        className="absolute inset-0 bg-slate-900 z-0 origin-center"
      />
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/20 to-violet-900/20 opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={textRef} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to modernize your inventory operations?
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-300">
            Talk to our team about your requirements. We&apos;ll help you scope
            the right hardware, plan your deployment, and get you up and
            running.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-slate-900 shadow-lg shadow-white/10 transition-all hover:bg-zinc-100 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/20"
            >
              Talk to Sales
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-slate-900/50 backdrop-blur-md px-8 py-4 text-sm font-medium text-white transition-all hover:border-zinc-500 hover:bg-zinc-800"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
