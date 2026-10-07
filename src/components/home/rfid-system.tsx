"use client";

import { useRef, useState } from "react";
import { ActionLink, SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { DESKTOP, ScrollTrigger, gsap, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RfidDiagram, type SystemStep } from "./rfid-diagram";

type Step = {
  name: string;
  title: string;
  body: string;
  facts: { label: string; value: string }[];
  link?: { href: string; label: string };
};

/** How a passive UHF RFID read works — general RFID facts, no product claims. */
const STEPS: Step[] = [
  {
    name: "Tag",
    title: "A chip and an antenna, no battery",
    body: "A passive tag is a tiny chip bonded to an antenna, printed into a label, moulded into a laundry tag or sealed in a metal-mount housing. Each one carries a unique identifier — its EPC.",
    facts: [
      { label: "Power", value: "None — passive" },
      { label: "Identity", value: "96-bit EPC" },
    ],
    link: { href: "/products?category=rfid-tags", label: "Browse RFID tags" },
  },
  {
    name: "Reader",
    title: "The reader powers the tag and hears it answer",
    body: "The reader's antenna sends out RF energy. A tag in the field harvests just enough of it to reply with its EPC — no line of sight, and hundreds of tags per second.",
    facts: [
      { label: "UHF band, India", value: "865–867 MHz" },
      { label: "Air protocol", value: "EPC Gen2 (ISO 18000-6C)" },
    ],
    link: { href: "/products?search=reader", label: "Browse readers" },
  },
  {
    name: "Data",
    title: "Every read becomes an event",
    body: "The reader filters duplicate reads and passes each event — which tag, which antenna, when and how strong — to your software over the network or a direct connection.",
    facts: [
      { label: "Event", value: "EPC · antenna · time · RSSI" },
      { label: "Links", value: "Ethernet, RS-232, USB, Wi-Fi" },
    ],
  },
  {
    name: "Visibility",
    title: "Stock you can check without counting it",
    body: "Your WMS, ERP or asset system turns those events into stock levels, locations and alerts — updated as goods move through each read point.",
    facts: [
      { label: "Feeds", value: "WMS · ERP · asset registers" },
      { label: "Result", value: "Live counts by location" },
    ],
  },
];

/**
 * Motion level 4 — scroll storytelling, on an inverse (dark) surface.
 *
 * Desktop: the diagram is sticky on the left while the four steps scroll on
 * the right; the step crossing the middle of the viewport becomes active and
 * the diagram highlights its part. It's CSS sticky, not a pinned timeline, so
 * the section scrolls at normal speed.
 *
 * Mobile: no sticky column — each step carries its own diagram, highlighted,
 * as a sequential story. Reduced motion keeps the highlight changes (they're
 * state, not motion) but drops every transition and loop.
 */
export function RfidSystem() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<SystemStep>(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        gsap.utils.toArray<HTMLElement>("[data-step]", root.current).forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) setActive(i as SystemStep);
            },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-labelledby="system-title" className="surface-inverse py-20 lg:py-28">
      <PageContainer>
        <SectionHeader
          id="system-title"
          eyebrow="How RFID works"
          title="From a tag on a carton to a count on your screen"
          description="Four parts make one read. Here is what happens between a tagged item passing a doorway and your stock updating."
        />

        <div className="mt-14 lg:grid lg:grid-cols-12 lg:gap-16">
          <div className="hidden lg:col-span-7 lg:block">
            <figure className="sticky top-24 rounded-card border border-border bg-surface p-8">
              <div className="bg-grid absolute inset-0 rounded-card opacity-60" aria-hidden />
              <RfidDiagram active={active} className="relative" />
              <figcaption className="relative mt-6 flex items-center justify-between border-t border-border pt-4 text-meta text-muted-foreground uppercase">
                <span>Passive UHF read — schematic</span>
                <span className="text-foreground tabular-nums" aria-live="polite">
                  {String(active + 1).padStart(2, "0")} / 04 · {STEPS[active].name}
                </span>
              </figcaption>
            </figure>
          </div>

          <ol className="lg:col-span-5">
            {STEPS.map((step, i) => (
              <li
                key={step.name}
                data-step
                className="border-t border-border py-12 first:border-t-0 first:pt-0 lg:flex lg:min-h-[72vh] lg:flex-col lg:justify-center lg:py-16 lg:first:border-t lg:first:pt-16"
              >
                <figure className="mb-8 rounded-card border border-border bg-surface p-4 lg:hidden">
                  <RfidDiagram active={i as SystemStep} />
                </figure>

                <p className="flex items-center gap-3 text-meta tabular-nums">
                  <span className={cn("transition-colors", active === i ? "text-brand" : "text-muted-foreground", "max-lg:text-brand")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted-foreground uppercase">{step.name}</span>
                </p>
                <h3 className="mt-4 text-h2 text-balance">{step.title}</h3>
                <p className="mt-4 text-body text-pretty text-muted-foreground">{step.body}</p>

                <dl className="mt-8 border-t border-border">
                  {step.facts.map((fact) => (
                    <div key={fact.label} className="flex items-baseline justify-between gap-6 border-b border-border py-3">
                      <dt className="text-meta text-muted-foreground uppercase">{fact.label}</dt>
                      <dd className="text-right font-mono text-tech">{fact.value}</dd>
                    </div>
                  ))}
                </dl>

                {step.link && (
                  <ActionLink href={step.link.href} className="mt-8 self-start">
                    {step.link.label}
                  </ActionLink>
                )}
              </li>
            ))}
          </ol>
        </div>
      </PageContainer>
    </section>
  );
}
