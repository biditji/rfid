"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { DURATION, EASE, MOTION_OK, gsap, useGSAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { INDUSTRIES, PLAN, type Industry } from "./industries-data";

/**
 * Industries as an editorial switcher: a vertical tab list on the left, and on
 * the right a floor plan of that sector with numbered RFID read points, the
 * hardware used at each, and what the sector gets out of it.
 *
 * Motion level 3, only when the visitor switches: zones fade in, read points
 * drop onto the plan, text follows. Never on first render, never under
 * reduced motion.
 */
export function IndustriesSection() {
  const [active, setActive] = useState(0);
  const switched = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const industry = INDUSTRIES[active];

  useGSAP(
    () => {
      if (!switched.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-zone]", { autoAlpha: 0, duration: 0.35, stagger: 0.03, ease: EASE.standard });
        gsap.from("[data-point]", {
          scale: 0,
          transformOrigin: "50% 50%",
          duration: DURATION.swap,
          ease: "back.out(2)",
          stagger: 0.07,
          delay: 0.15,
        });
        gsap.from("[data-swap]", { y: 10, autoAlpha: 0, duration: DURATION.swap, ease: EASE.emphasized, stagger: 0.05 });
      });
    },
    { scope: panelRef, dependencies: [active], revertOnUpdate: true }
  );

  const select = (index: number, focus = false) => {
    switched.current = true;
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  // Roving focus: arrows move between tabs (and select), Home/End jump.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const last = INDUSTRIES.length - 1;
    const next: Record<string, number> = {
      ArrowDown: active === last ? 0 : active + 1,
      ArrowRight: active === last ? 0 : active + 1,
      ArrowUp: active === 0 ? last : active - 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    if (e.key in next) {
      e.preventDefault();
      select(next[e.key], true);
    }
  };

  return (
    <section aria-labelledby="industries-title" className="border-t border-border bg-surface py-20 lg:py-28">
      <PageContainer>
        <SectionHeader
          id="industries-title"
          eyebrow="Industries"
          title="Built for your industry"
          description="RFID solutions tailored to the challenges of your sector — and where the hardware goes."
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
            className="no-scrollbar -mx-4 flex overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0 lg:sticky lg:top-24 lg:col-span-4 lg:mx-0 lg:flex-col lg:self-start lg:border-b-0 lg:border-l"
          >
            {INDUSTRIES.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    "relative flex shrink-0 items-baseline gap-3 px-4 py-4 text-left transition-colors lg:gap-5 lg:py-5 lg:pl-6",
                    // Active marker: brand rule under the tab on mobile, beside it on desktop.
                    "after:absolute after:bg-brand after:transition-opacity max-lg:after:inset-x-4 max-lg:after:bottom-0 max-lg:after:h-0.5 lg:after:inset-y-3 lg:after:-left-px lg:after:w-0.5",
                    selected ? "text-foreground after:opacity-100" : "text-muted-foreground after:opacity-0 hover:text-foreground"
                  )}
                >
                  <span className="text-meta tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-body font-medium lg:text-h3">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div
            ref={panelRef}
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${industry.id}`}
            className="overflow-hidden rounded-card border border-border bg-background lg:col-span-8"
          >
            <div className="bg-grid border-b border-border bg-surface p-4 sm:p-6">
              <FloorPlan industry={industry} />
            </div>

            <div className="grid grid-cols-1 gap-10 p-6 sm:p-8 md:grid-cols-2">
              <div>
                <h3 data-swap className="text-h2">
                  {industry.title}
                </h3>
                <p data-swap className="mt-4 text-body text-pretty text-muted-foreground">
                  {industry.description}
                </p>
                {industry.outcomes.length > 0 && (
                  <ul data-swap className="mt-6 space-y-2.5">
                    {industry.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3 text-small">
                        <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-foreground" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h4 data-swap className="text-meta text-muted-foreground uppercase">
                  Read points
                </h4>
                <ol className="mt-4 border-t border-border">
                  {industry.points.map((point, i) => (
                    <li key={point.label} data-swap className="border-b border-border">
                      <Link
                        href={`/products?category=${point.category}`}
                        className="group grid grid-cols-[1.75rem_1fr_auto] items-center gap-3 py-3"
                      >
                        <PointMarker n={i + 1} />
                        <span className="min-w-0">
                          <span className="block text-small font-medium">{point.label}</span>
                          <span className="block text-small text-muted-foreground group-hover:text-foreground">
                            {point.hardware}
                          </span>
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none"
                        />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}

function PointMarker({ n }: { n: number }) {
  return (
    <span className="flex size-6 items-center justify-center rounded-full bg-brand text-meta font-semibold tracking-normal text-brand-foreground tabular-nums">
      {n}
    </span>
  );
}

/** Schematic plan: zones, fixtures and numbered read points. */
function FloorPlan({ industry }: { industry: Industry }) {
  return (
    <svg
      viewBox={`0 0 ${PLAN.width} ${PLAN.height}`}
      role="img"
      aria-label={`${industry.title} floor plan with ${industry.points.length} RFID read points: ${industry.points
        .map((p, i) => `${i + 1}, ${p.label}`)
        .join("; ")}.`}
      className="h-auto w-full text-foreground"
    >
      {industry.zones.map((zone) => (
        <g key={zone.label} data-zone>
          <rect
            x={zone.x}
            y={zone.y}
            width={zone.w}
            height={zone.h}
            rx="4"
            className="fill-background stroke-current opacity-90"
            strokeWidth="1.25"
          />
          {zone.fixtures?.map((f, i) => (
            <rect
              key={i}
              x={f.x}
              y={f.y}
              width={f.w}
              height={f.h}
              rx="2"
              className="fill-current stroke-current opacity-10"
              strokeWidth="1"
            />
          ))}
          <text
            x={zone.x + 12}
            y={zone.y + zone.h - 12}
            className="fill-current font-sans text-small font-medium uppercase opacity-60"
          >
            {zone.label}
          </text>
        </g>
      ))}

      {industry.points.map((point, i) => (
        <g key={point.label} data-point>
          <circle cx={point.x} cy={point.y} r="27" className="fill-brand opacity-15" />
          <circle cx={point.x} cy={point.y} r="16" className="fill-brand" />
          <text
            x={point.x}
            y={point.y}
            dy="0.35em"
            textAnchor="middle"
            className="fill-brand-foreground font-sans text-body font-semibold"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
