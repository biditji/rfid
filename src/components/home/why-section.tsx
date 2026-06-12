"use client";

import { Shield, Zap, Headphones, Globe } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

const features = [
  {
    icon: Zap,
    title: "99.9% Read Accuracy",
    description:
      "Enterprise-grade hardware delivers consistent, reliable reads across challenging environments — from dense warehouses to retail floors.",
  },
  {
    icon: Shield,
    title: "Certified & Compliant",
    description:
      "All products meet EPC Gen2v2, ISO 18000-63, and regional regulatory standards. FCC, CE, and IC certified.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description:
      "Our engineering team provides deployment planning, integration support, and troubleshooting. Not a chatbot — real RFID engineers.",
  },
  {
    icon: Globe,
    title: "Global Supply Chain",
    description:
      "Warehouses in Austin, Rotterdam, and Singapore. Same-day dispatch on in-stock items. Volume pricing for enterprise accounts.",
  },
];

export function WhySection() {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Why companies choose Virtualsphere
            </h2>
            <p className="mt-3 text-zinc-500">
              We&apos;re not a marketplace. We&apos;re a focused RFID supplier with
              deep product knowledge and enterprise support.
            </p>
          </div>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <FadeIn key={feature.title} delay={idx * 0.08}>
              <div className="flex flex-col gap-3 bg-white p-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                  <feature.icon className="h-5 w-5 text-zinc-700" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">
                  {feature.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
