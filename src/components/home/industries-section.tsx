"use client";

import { useState } from "react";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Warehouse,
  HeartPulse,
  Factory,
  CheckCircle2,
} from "lucide-react";

const industries = [
  {
    id: "retail",
    label: "Retail",
    icon: ShoppingBag,
    title: "Retail & Apparel",
    description:
      "Item-level RFID tagging for inventory visibility, loss prevention, and omnichannel fulfillment. Track every unit from receiving to point-of-sale.",
    points: [
      "Real-time inventory accuracy above 98%",
      "Automated replenishment triggers",
      "Self-checkout and fitting room insights",
      "Shrinkage reduction by up to 55%",
    ],
  },
  {
    id: "warehouse",
    label: "Warehouse",
    icon: Warehouse,
    title: "Warehouse & Logistics",
    description:
      "Dock door portals, conveyor scanning, and handheld cycle counts. Move from barcode-based workflows to hands-free RFID automation.",
    points: [
      "99.9% shipping accuracy",
      "70% faster receiving processes",
      "Automated pallet and case tracking",
      "Integration with WMS platforms",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    icon: HeartPulse,
    title: "Healthcare & Life Sciences",
    description:
      "Track surgical instruments, pharmaceuticals, and high-value medical equipment. Ensure compliance with serialization and chain-of-custody requirements.",
    points: [
      "Instrument tray tracking and sterilization logs",
      "Drug serialization compliance",
      "Real-time asset location within facilities",
      "Patient safety through positive ID",
    ],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    title: "Manufacturing & Industrial",
    description:
      "Track work-in-progress, tools, and finished goods across production lines. Rugged tags survive high-temperature, chemical, and washdown environments.",
    points: [
      "WIP tracking through every production stage",
      "Tool and die management",
      "Returnable container and asset tracking",
      "IP68/IP69K rated tags for harsh environments",
    ],
  },
];

export function IndustriesSection() {
  const [active, setActive] = useState("retail");
  const current = industries.find((i) => i.id === active)!;

  return (
    <section className="border-t border-zinc-100 bg-zinc-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Built for your industry
          </h2>
          <p className="mt-2 text-zinc-500">
            RFID solutions tailored to the challenges of your sector.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <button
                key={industry.id}
                type="button"
                onClick={() => setActive(industry.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  active === industry.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                )}
              >
                <industry.icon className="h-4 w-4" />
                {industry.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-200 bg-white p-8">
              <h3 className="text-xl font-semibold text-zinc-900">
                {current.title}
              </h3>
              <p className="mt-3 leading-relaxed text-zinc-500">
                {current.description}
              </p>
              <ul className="mt-6 space-y-3">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-sm text-zinc-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-8">
              <div className="flex h-full flex-col items-center justify-center py-8">
                <current.icon className="h-12 w-12 text-zinc-300" />
                <p className="mt-4 text-sm font-medium text-zinc-400">
                  {current.title} deployment illustration
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Typical read points and hardware placement
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
