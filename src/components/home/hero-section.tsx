"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div>
            <FadeIn>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Trusted by 500+ enterprises
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                RFID infrastructure
                <br />
                <span className="text-zinc-400">for modern operations</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-500">
                Tags, readers, antennas, and complete tracking systems. 
                From a single warehouse to a global supply chain — we provide 
                the hardware and tools to make it work.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Request a Quote
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="mt-10 flex items-center gap-8 border-t border-zinc-100 pt-8">
                <div>
                  <div className="text-2xl font-bold text-zinc-900">12K+</div>
                  <div className="text-sm text-zinc-500">Products shipped</div>
                </div>
                <div className="h-8 w-px bg-zinc-200" />
                <div>
                  <div className="text-2xl font-bold text-zinc-900">98.5%</div>
                  <div className="text-sm text-zinc-500">Uptime SLA</div>
                </div>
                <div className="h-8 w-px bg-zinc-200" />
                <div>
                  <div className="text-2xl font-bold text-zinc-900">24hr</div>
                  <div className="text-sm text-zinc-500">Avg. ship time</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Visual */}
          <FadeIn delay={0.2} direction="left">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900">
                    <Radio className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-zinc-900">
                      Complete RFID Solutions
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Hardware · Software · Support
                    </p>
                  </div>
                  {/* Mock product grid preview */}
                  <div className="mt-4 grid w-full max-w-sm grid-cols-3 gap-2">
                    {[
                      { label: "Tags", count: "45K+" },
                      { label: "Readers", count: "120+" },
                      { label: "Antennas", count: "80+" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg border border-zinc-200 bg-white p-3 text-center"
                      >
                        <div className="text-lg font-bold text-zinc-900">
                          {item.count}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Floating accent */}
              <div className="absolute -bottom-3 -right-3 h-24 w-24 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="text-xl font-bold text-emerald-600">99.9%</div>
                  <div className="text-[10px] text-zinc-500">Read accuracy</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
