import { cn } from "@/lib/utils";

export type SystemStep = 0 | 1 | 2 | 3;

/**
 * Schematic of a passive UHF RFID read, in four parts that match the story's
 * steps: 0 the tag on a carton, 1 the reader and antenna with its RF field,
 * 2 read events travelling to software, 3 the stock view that results.
 *
 * The active part is drawn at full strength with the brand accent; parts
 * already explained stay visible, parts still to come recede. Drawn with
 * `currentColor`/tokens, so it works on light and inverse surfaces.
 */
export function RfidDiagram({ active, className }: { active: SystemStep; className?: string }) {
  const part = (step: SystemStep) =>
    cn(
      "transition-opacity duration-500 motion-reduce:transition-none",
      step === active ? "opacity-100" : step < active ? "opacity-55" : "opacity-20"
    );
  const on = (step: SystemStep) => step === active;

  return (
    <svg
      viewBox="0 0 640 520"
      role="img"
      aria-label={DESCRIPTIONS[active]}
      className={cn("h-auto w-full text-foreground", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ── 02 Reader: antenna panel, cable, reader unit, RF field ─────── */}
      <g className={part(1)}>
        <rect x="60" y="48" width="132" height="132" rx="8" />
        <rect x="80" y="68" width="92" height="92" rx="4" className="opacity-50" />
        <path d="M192 114 H236" strokeDasharray="4 4" />
        <rect x="236" y="88" width="112" height="52" rx="6" />
        <circle cx="256" cy="114" r="3" className={cn("fill-current", on(1) && "fill-brand stroke-brand")} />
        <path d="M272 108 H328 M272 120 H312" className="opacity-50" />
        {[36, 72, 108].map((r, i) => (
          <path
            key={r}
            d={`M${126 - 0.866 * r} ${180 + 0.5 * r} A${r} ${r} 0 0 0 ${126 + 0.866 * r} ${180 + 0.5 * r}`}
            className={cn(on(1) && "stroke-brand motion-safe:animate-rf-wave")}
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        {/* Backscatter: the tag answers with its EPC. */}
        <path d="M136 362 V262" strokeDasharray="2 6" className={cn(on(1) && "stroke-brand")} />
        <path d="M130 270 L136 262 L142 270" className={cn(on(1) && "stroke-brand")} />
        <Label x={236} y={170} active={on(1)}>
          02 READER
        </Label>
      </g>

      {/* ── 01 Tag: carton with a UHF inlay ───────────────────────────── */}
      <g className={part(0)}>
        <rect x="40" y="300" width="194" height="172" rx="4" />
        <path d="M40 332 H234" className="opacity-40" />
        <rect x="72" y="372" width="128" height="58" rx="4" className={cn(on(0) && "stroke-brand")} />
        <path
          d="M82 401 h8 v-14 h8 v28 h8 v-28 h8 v28 h8 v-14 h6 M144 401 h6 v-14 h8 v28 h8 v-28 h8 v28 h8 v-14 h8"
          className={cn(on(0) && "stroke-brand")}
        />
        <rect x="128" y="393" width="16" height="16" rx="2" className={cn("fill-current", on(0) && "fill-brand stroke-brand")} />
        <text x="72" y="452" className="fill-current font-mono text-small tracking-normal" stroke="none">
          EPC 3034 257B F400 …
        </text>
        <Label x={40} y={496} active={on(0)}>
          01 TAG
        </Label>
      </g>

      {/* ── 03 Data: read events to software ──────────────────────────── */}
      <g className={part(2)}>
        <path d="M348 114 H420" />
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x="352"
            y="110"
            width="8"
            height="8"
            rx="1"
            stroke="none"
            className={cn("fill-current", on(2) ? "fill-brand motion-safe:animate-packet" : "opacity-0")}
            style={{ animationDelay: `${i * 0.53}s` }}
          />
        ))}
        {[62, 102, 142].map((y) => (
          <g key={y}>
            <rect x="420" y={y} width="170" height="32" rx="4" />
            <circle cx="436" cy={y + 16} r="2.5" className="fill-current" stroke="none" />
            <path d={`M450 ${y + 16} H540`} className="opacity-40" />
          </g>
        ))}
        <g className="fill-current font-mono text-small tracking-normal" stroke="none">
          <text x="420" y="200">
            <tspan className="opacity-60">epc </tspan>3034…0017
          </text>
          <text x="420" y="218">
            <tspan className="opacity-60">ant </tspan>2<tspan className="opacity-60"> · rssi </tspan>−54 dBm
          </text>
        </g>
        <Label x={420} y={44} active={on(2)}>
          03 DATA
        </Label>
      </g>

      {/* ── 04 Visibility: the stock view ─────────────────────────────── */}
      <g className={part(3)}>
        <path d="M505 226 V300" strokeDasharray="4 4" />
        <rect x="392" y="300" width="226" height="172" rx="8" />
        <path d="M392 330 H618" className="opacity-40" />
        <circle cx="408" cy="315" r="3" className="fill-current opacity-60" stroke="none" />
        <circle cx="420" cy="315" r="3" className="fill-current opacity-60" stroke="none" />
        {[52, 78, 40, 90, 66].map((h, i) => (
          <rect
            key={i}
            x={414 + i * 38}
            y={452 - h}
            width="22"
            height={h}
            rx="2"
            stroke="none"
            className={cn("fill-current", on(3) ? (i === 3 ? "fill-brand" : "opacity-70") : "opacity-40")}
          />
        ))}
        <path d="M406 452 H604" className="opacity-40" />
        <Label x={392} y={496} active={on(3)}>
          04 VISIBILITY
        </Label>
      </g>
    </svg>
  );
}

function Label({ x, y, active, children }: { x: number; y: number; active: boolean; children: string }) {
  return (
    <text
      x={x}
      y={y}
      stroke="none"
      className={cn("font-sans text-body font-medium", active ? "fill-brand" : "fill-current")}
    >
      {children}
    </text>
  );
}

const DESCRIPTIONS: Record<SystemStep, string> = {
  0: "Diagram: a passive RFID tag — a chip and antenna — on a carton.",
  1: "Diagram: the reader's antenna sends out RF energy; the tag answers with its EPC.",
  2: "Diagram: the reader passes read events — tag ID, antenna, signal strength — to software.",
  3: "Diagram: software turns read events into a live stock view.",
};
