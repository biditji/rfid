import { SITE_URL } from "./config";

export const SITE_CONFIG = {
  name: "Virtualsphere",
  tagline: "Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
  url: SITE_URL,
  email: "info@Virtualspheretechnologies.in",
  phone: "+91-7050506400",
  address: {
    street: "Wz-10B, Aslatpur, Janakpuri A-2, Near Gurudwara",
    city: "New Delhi",
    state: "Delhi",
    zip: "110058",
    country: "India",
  },
  social: {
    twitter: "https://twitter.com/rfidhub",
    linkedin: "https://linkedin.com/company/rfidhub",
    github: "https://github.com/rfidhub",
  },
} as const;

export const NAV_ITEMS = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const ADMIN_NAV = {
  overview: [
    { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  ],
  commerce: [
    { label: "Products", href: "/admin/products", icon: "Package" },
    { label: "Orders", href: "/admin/orders", icon: "ShoppingCart" },
    { label: "Inventory", href: "/admin/inventory", icon: "Warehouse" },
    { label: "Customers", href: "/admin/customers", icon: "Users" },
  ],
  settings: [
    { label: "SEO", href: "/admin/seo", icon: "Search" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
} as const;

/**
 * The footer's category links, in catalog order. These are fixed text, so
 * keep them in step with the category names in the admin panel.
 */
export const PRODUCT_CATEGORIES = [
  "Integrated Reader",
  "Four Port Reader",
  "Eight Port Reader",
  "RFID UHF Antenna",
  "Handheld Reader",
  "UHF Desktop Reader",
  "HF RFID Desktop Reader",
  "RFID LF and HF Pendrive Reader",
] as const;

/**
 * Home page merchandising, by product slug: the hero and the four showcase
 * sheets. Chosen for range (integrated, handheld, four-port, antenna, desktop)
 * and because their photos are high-resolution shots on white, which the
 * product plate needs — VSL-A1, UDR 105 and PVR 3 are shot on black and UHR 72
 * on grey, so they show as boxes. Any slug that's disabled or out of stock is
 * replaced automatically (see curateHome).
 */
export const HOME_FEATURED = {
  hero: "udm9a",
  showcase: ["uhr-2", "vsl-a2", "ua9", "udr-w101"],
};

/**
 * How prices relate to GST, shown beside every price.
 * ⚠ REVIEW: the cart doesn't calculate GST and no product records a rate, so
 * this wording is a neutral placeholder — confirm whether list prices include
 * GST and say so exactly (e.g. "Excl. 18% GST").
 */
export const GST_NOTE = "GST as applicable";
