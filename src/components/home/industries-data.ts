import { INDUSTRY_OUTCOMES } from "@/content/claims";

export type Rect = { x: number; y: number; w: number; h: number };
export type Zone = Rect & { label: string; fixtures?: Rect[] };
export type ReadPoint = { x: number; y: number; label: string; hardware: string; category: string };

export type Industry = {
  id: keyof typeof INDUSTRY_OUTCOMES;
  label: string;
  title: string;
  description: string;
  zones: Zone[];
  points: ReadPoint[];
  outcomes: string[];
};

/** Floor plans are drawn in an 800 × 460 space. */
export const PLAN = { width: 800, height: 460 };

const rows = (x: number, w: number, h: number, ys: number[]): Rect[] => ys.map((y) => ({ x, y, w, h }));
const cols = (y: number, w: number, h: number, xs: number[]): Rect[] => xs.map((x) => ({ x, y, w, h }));

/**
 * Typical RFID read points per sector, as schematic floor plans. Read points
 * name the kind of hardware used there and link to that live category.
 * Descriptions are the storefront's existing copy; outcome figures live in
 * content/claims.ts pending verification.
 */
export const INDUSTRIES: Industry[] = [
  {
    id: "retail",
    label: "Retail",
    title: "Retail & Apparel",
    description:
      "Item-level RFID tagging for inventory visibility, loss prevention, and omnichannel fulfillment. Track every unit from receiving to point-of-sale.",
    zones: [
      { x: 20, y: 20, w: 210, h: 420, label: "Back room", fixtures: rows(44, 162, 14, [72, 122, 172, 222]) },
      {
        x: 250,
        y: 20,
        w: 360,
        h: 300,
        label: "Sales floor",
        fixtures: [...cols(84, 120, 18, [282, 458]), ...cols(144, 120, 18, [282, 458]), { x: 282, y: 214, w: 296, h: 18 }],
      },
      { x: 630, y: 20, w: 150, h: 180, label: "Fitting rooms", fixtures: [...cols(58, 44, 48, [648, 710]), ...cols(120, 44, 48, [648, 710])] },
      { x: 250, y: 340, w: 360, h: 100, label: "Checkout", fixtures: cols(382, 80, 20, [284, 392, 500]) },
      { x: 630, y: 220, w: 150, h: 220, label: "Entrance", fixtures: cols(356, 6, 56, [672, 738]) },
    ],
    points: [
      { x: 20, y: 300, label: "Receiving door", hardware: "Four-port reader + antennas", category: "four-port-reader" },
      { x: 430, y: 180, label: "Cycle counts", hardware: "Handheld reader", category: "handheld-reader" },
      { x: 705, y: 186, label: "Fitting rooms", hardware: "UHF antenna per zone", category: "rfid-uhf-antenna" },
      { x: 446, y: 412, label: "Point of sale", hardware: "UHF desktop reader", category: "uhf-desktop-reader" },
      { x: 705, y: 384, label: "Exit gates", hardware: "Integrated reader", category: "integrated-reader" },
    ],
    outcomes: INDUSTRY_OUTCOMES.retail,
  },
  {
    id: "logistics",
    label: "Logistics",
    title: "Warehouse & Logistics",
    description:
      "Dock door portals, conveyor scanning, and handheld cycle counts. Move from barcode-based workflows to hands-free RFID automation.",
    zones: [
      { x: 20, y: 20, w: 130, h: 420, label: "Inbound", fixtures: rows(20, 10, 56, [64, 164, 264, 364]) },
      { x: 170, y: 20, w: 440, h: 280, label: "Storage", fixtures: rows(198, 384, 14, [70, 118, 166, 214, 262]) },
      {
        x: 170,
        y: 320,
        w: 440,
        h: 120,
        label: "Conveyor & sortation",
        fixtures: [{ x: 190, y: 370, w: 400, h: 22 }, { x: 376, y: 358, w: 48, h: 46 }],
      },
      { x: 630, y: 20, w: 150, h: 420, label: "Outbound", fixtures: rows(770, 10, 56, [64, 164, 264, 364]) },
    ],
    points: [
      { x: 30, y: 192, label: "Dock doors", hardware: "Four-port reader + antennas", category: "four-port-reader" },
      { x: 404, y: 190, label: "Cycle counts", hardware: "Handheld reader", category: "handheld-reader" },
      { x: 400, y: 381, label: "Conveyor tunnel", hardware: "Integrated reader", category: "integrated-reader" },
      { x: 770, y: 240, label: "Outbound check", hardware: "Eight-port reader + antennas", category: "eight-port-reader" },
    ],
    outcomes: INDUSTRY_OUTCOMES.logistics,
  },
  {
    id: "healthcare",
    label: "Healthcare",
    title: "Healthcare & Life Sciences",
    description:
      "Track surgical instruments, pharmaceuticals, and high-value medical equipment. Ensure compliance with serialization and chain-of-custody requirements.",
    zones: [
      { x: 20, y: 20, w: 250, h: 200, label: "Sterile processing", fixtures: [...cols(66, 80, 40, [48, 150]), ...cols(130, 80, 40, [48, 150])] },
      { x: 290, y: 20, w: 260, h: 200, label: "Theatre store", fixtures: cols(58, 54, 124, [316, 392, 468]) },
      { x: 570, y: 20, w: 210, h: 200, label: "Pharmacy", fixtures: rows(598, 154, 14, [64, 104, 144]) },
      { x: 20, y: 240, w: 760, h: 80, label: "Corridor" },
      { x: 20, y: 340, w: 370, h: 100, label: "Wards", fixtures: cols(368, 60, 40, [48, 136, 224, 312]) },
      { x: 410, y: 340, w: 370, h: 100, label: "Equipment bay", fixtures: cols(368, 90, 40, [438, 552, 666]) },
    ],
    points: [
      { x: 140, y: 196, label: "Instrument trays", hardware: "UHF desktop reader", category: "uhf-desktop-reader" },
      { x: 420, y: 196, label: "Theatre store", hardware: "Integrated reader", category: "integrated-reader" },
      { x: 675, y: 196, label: "Pharmacy counts", hardware: "Handheld reader", category: "handheld-reader" },
      { x: 400, y: 280, label: "Corridor doorways", hardware: "UHF antenna", category: "rfid-uhf-antenna" },
    ],
    outcomes: INDUSTRY_OUTCOMES.healthcare,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    title: "Manufacturing & Industrial",
    description:
      "Track work-in-progress, tools, and finished goods across production lines. Rugged tags survive high-temperature, chemical, and washdown environments.",
    zones: [
      {
        x: 20,
        y: 20,
        w: 560,
        h: 200,
        label: "Production line",
        fixtures: [{ x: 40, y: 112, w: 520, h: 16 }, ...cols(90, 96, 60, [52, 180, 308, 436])],
      },
      { x: 600, y: 20, w: 180, h: 200, label: "Tool crib", fixtures: rows(620, 140, 14, [64, 104, 144]) },
      {
        x: 20,
        y: 240,
        w: 370,
        h: 200,
        label: "Returnable containers",
        fixtures: [...cols(288, 60, 40, [48, 128, 208, 288]), ...cols(348, 60, 40, [48, 128, 208, 288])],
      },
      {
        x: 410,
        y: 240,
        w: 370,
        h: 200,
        label: "Finished goods",
        fixtures: [...cols(292, 70, 50, [438, 528, 618]), { x: 770, y: 300, w: 10, h: 80 }],
      },
    ],
    points: [
      { x: 240, y: 170, label: "Line stations", hardware: "Four-port reader + antennas", category: "four-port-reader" },
      { x: 690, y: 196, label: "Tool crib", hardware: "UHF desktop reader", category: "uhf-desktop-reader" },
      { x: 208, y: 414, label: "Container returns", hardware: "Handheld reader", category: "handheld-reader" },
      { x: 770, y: 340, label: "Dispatch dock", hardware: "Integrated reader", category: "integrated-reader" },
    ],
    outcomes: INDUSTRY_OUTCOMES.manufacturing,
  },
];
