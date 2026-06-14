export const SITE_CONFIG = {
  name: "Virtualsphere",
  tagline: "Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
  url: "https://rfidhub.com",
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

export const PRODUCT_CATEGORIES = [
  "RFID Tags",
  "RFID Readers",
  "RFID Antennas",
  "RFID Labels",
  "RFID Kits",
  "Accessories",
] as const;

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
