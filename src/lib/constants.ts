export const SITE_CONFIG = {
  name: "Virtualsphere",
  tagline: "Enterprise RFID Solutions",
  description:
    "Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems.",
  url: "https://rfidhub.com",
  email: "hello@rfidhub.com",
  phone: "+1 (555) 824-7100",
  address: {
    street: "2100 Innovation Drive, Suite 400",
    city: "Austin",
    state: "TX",
    zip: "78758",
    country: "United States",
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
