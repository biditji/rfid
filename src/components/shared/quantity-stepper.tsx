"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** md matches md buttons (40px); xl matches the purchase CTA (56px). */
  size?: "md" | "xl";
  id?: string;
  /** Accessible name for the number field when there's no visible <label>. */
  label?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * − [ n ] + with a typeable field. Values are clamped to [min, max]; typing is
 * committed on blur/Enter so a half-typed "5" on the way to "500" isn't
 * clamped mid-edit.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = Number.POSITIVE_INFINITY,
  size = "md",
  id,
  label,
  disabled = false,
  className,
}: QuantityStepperProps) {
  const [draft, setDraft] = useState(String(value));
  // Keep the field in step when the value changes from outside (React’s
  // "adjust state while rendering" pattern — no effect, no extra paint).
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setDraft(String(value));
  }

  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const commit = () => {
    const n = Number.parseInt(draft, 10);
    const next = Number.isFinite(n) ? clamp(n) : value;
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  const buttonClass = cn(
    "flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
    size === "xl" ? "w-12" : "w-10"
  );

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-control border border-input bg-background has-[input:focus-visible]:border-foreground",
        size === "xl" ? "h-14" : "h-10",
        disabled && "opacity-60",
        className
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-4" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        className="w-14 min-w-0 border-x border-border bg-transparent text-center text-small font-medium tabular-nums outline-none focus-visible:outline-none"
      />
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
