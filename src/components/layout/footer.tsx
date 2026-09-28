import Link from "next/link";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONFIG, NAV_ITEMS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Virtualsphere Technologies" className="h-8 object-contain" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Professional RFID products and inventory management solutions for
              modern enterprises. Trusted by 500+ companies worldwide.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Products</h3>
            <ul className="mt-4 space-y-2.5">
              {PRODUCT_CATEGORIES.map((item) => (
                <li key={item}>
                  <Link
                    href={`/products?category=${slugify(item)}`}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span className="text-sm text-zinc-500">
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}{" "}
                  {SITE_CONFIG.address.zip}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} Virtualsphere. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-600"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-600"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
