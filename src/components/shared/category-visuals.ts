import {
  Antenna,
  Cpu,
  CreditCard,
  Package,
  Printer,
  StickyNote,
  Tag,
  type LucideIcon,
} from "lucide-react";

/**
 * Icon and colours for a category, derived from its name so categories an
 * admin adds later still get a sensible look without a code change.
 */

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/reader|scanner|tray/i, Cpu],
  [/antenna/i, Antenna],
  [/label/i, StickyNote],
  [/card/i, CreditCard],
  [/printer|barcode/i, Printer],
  [/tag|inlay|seal/i, Tag],
];

export function categoryIcon(name: string): LucideIcon {
  return ICON_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? Package;
}

/** Full class strings, listed literally so Tailwind can see them. */
const PALETTE = [
  {
    accent: "bg-blue-50 text-blue-600",
    tint: "bg-blue-50",
    pill: "from-blue-500/10 to-blue-600/5 border-blue-200/60 text-blue-700",
    pillIcon: "bg-blue-500",
  },
  {
    accent: "bg-amber-50 text-amber-600",
    tint: "bg-amber-50",
    pill: "from-amber-500/10 to-amber-600/5 border-amber-200/60 text-amber-700",
    pillIcon: "bg-amber-500",
  },
  {
    accent: "bg-emerald-50 text-emerald-600",
    tint: "bg-emerald-50",
    pill: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/60 text-emerald-700",
    pillIcon: "bg-emerald-500",
  },
  {
    accent: "bg-violet-50 text-violet-600",
    tint: "bg-violet-50",
    pill: "from-violet-500/10 to-violet-600/5 border-violet-200/60 text-violet-700",
    pillIcon: "bg-violet-500",
  },
  {
    accent: "bg-rose-50 text-rose-600",
    tint: "bg-rose-50",
    pill: "from-rose-500/10 to-rose-600/5 border-rose-200/60 text-rose-700",
    pillIcon: "bg-rose-500",
  },
  {
    accent: "bg-zinc-100 text-zinc-600",
    tint: "bg-zinc-100",
    pill: "from-zinc-500/10 to-zinc-600/5 border-zinc-200/60 text-zinc-700",
    pillIcon: "bg-zinc-500",
  },
] as const;

/** Colours by position, so neighbouring categories never share a colour. */
export const categoryColors = (index: number) => PALETTE[index % PALETTE.length];
