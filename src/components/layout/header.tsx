"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search, ShoppingCart, User as UserIcon, LogOut, ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/shared/page-container";
import { WhatsAppIcon } from "@/components/shared/whatsapp-icon";
import { NAV_ITEMS, SITE_CONFIG, whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CART_LANDED } from "@/lib/cart-flight";
import { MOTION_OK, gsap } from "@/lib/motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

const navLinkClass =
  // The active item carries the brand underline, echoing the logo.
  "relative flex items-center px-3 text-small font-medium transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-brand after:opacity-0 after:transition-opacity";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();

  // Close the mobile menu whenever the route changes — adjusting state during
  // render, which React recommends over an effect for this.
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <PageContainer className="flex h-16 items-center gap-4 lg:gap-8">
        <Link href="/" className="shrink-0" aria-label="Virtualsphere Technologies — home">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset */}
          <img src="/logo.png" alt="" width={1024} height={216} className="h-7 w-auto sm:h-8" />
        </Link>

        <nav aria-label="Main" className="hidden h-full items-stretch lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  navLinkClass,
                  active ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          {/* The support site is a separate property, so it opens in a new tab. */}
          <a
            href={SITE_CONFIG.resourcesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(navLinkClass, "gap-1 text-muted-foreground hover:text-foreground")}
          >
            Support
            <ArrowUpRight aria-hidden className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchForm className="hidden w-48 xl:block" />
          <ButtonLink
            href="/products"
            variant="ghost"
            size="icon"
            aria-label="Search products"
            className="hidden lg:inline-flex xl:hidden"
          >
            <Search />
          </ButtonLink>
          <AccountControl />
          <CartLink />
          <ButtonLink href="/contact" size="md" className="ml-2 hidden lg:inline-flex">
            Request a quote
          </ButtonLink>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </PageContainer>

      {/* Mobile menu — a CSS grid-rows transition; `inert` keeps the closed
          panel out of the tab order and the accessibility tree. */}
      <div
        id={menuId}
        inert={!mobileOpen}
        className={cn(
          "grid border-t transition-[grid-template-rows,border-color] duration-300 ease-standard lg:hidden motion-reduce:transition-none",
          mobileOpen ? "grid-rows-[1fr] border-border" : "grid-rows-[0fr] border-transparent"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <PageContainer className="space-y-6 py-5">
            <SearchForm onSubmitted={() => setMobileOpen(false)} />
            <nav aria-label="Main">
              <ul className="divide-y divide-border border-y border-border">
                {NAV_ITEMS.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="flex h-12 items-center justify-between text-body font-medium"
                      >
                        <span className={cn(active && "text-foreground", !active && "text-muted-foreground")}>
                          {item.label}
                        </span>
                        {active && <span aria-hidden className="h-0.5 w-5 bg-brand" />}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <a
                    href={SITE_CONFIG.resourcesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 items-center justify-between text-body font-medium text-muted-foreground"
                  >
                    <span>
                      Support<span className="sr-only"> (opens in a new tab)</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                </li>
              </ul>
            </nav>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href={`tel:${SITE_CONFIG.phone}`} variant="outline" size="lg" startIcon={<Phone />}>
                Call us
              </ButtonLink>
              <ButtonLink
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                size="lg"
                startIcon={<WhatsAppIcon />}
              >
                WhatsApp
              </ButtonLink>
            </div>
            <ButtonLink href="/contact" size="lg" className="w-full">
              Request a quote
            </ButtonLink>
          </PageContainer>
        </div>
      </div>
    </header>
  );
}

function SearchForm({ className, onSubmitted }: { className?: string; onSubmitted?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputId = useId();

  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
        onSubmitted?.();
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <Input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products"
        startIcon={<Search />}
        autoComplete="off"
      />
    </form>
  );
}

/**
 * The header cart. It's the landing point of the add-to-cart flight
 * (`data-cart-target`, see lib/cart-flight): when a product lands, the icon
 * gives a short spring, an RF ring pulses out from it and an "Added" tag drops
 * in underneath, then everything settles back. Under reduced motion only the
 * tag shows, without movement.
 */
function CartLink() {
  const { cartCount } = useCart();
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    let timeline: gsap.core.Timeline | undefined;

    const onLanded = () => {
      timeline?.progress(1).kill();
      const icon = node.querySelector("svg");
      const ring = node.querySelector("[data-cart-ring]");
      const tag = node.querySelector("[data-cart-tag]");
      const badge = node.querySelector("[data-cart-badge]");

      if (!window.matchMedia(MOTION_OK).matches) {
        timeline = gsap.timeline().set(tag, { autoAlpha: 1 }).set(tag, { autoAlpha: 0 }, 1.4);
        return;
      }
      timeline = gsap
        .timeline()
        .fromTo(icon, { scale: 1 }, { scale: 1.22, duration: 0.12, ease: "power2.out" })
        .to(icon, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" })
        .fromTo(ring, { scale: 0.5, autoAlpha: 0.7 }, { scale: 2.2, autoAlpha: 0, duration: 0.7, ease: "expo.out" }, 0)
        .fromTo(badge, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "back.out(3)" }, 0.05)
        .fromTo(tag, { y: -6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: "expo.out" }, 0.08)
        .to(tag, { y: -4, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 1.3);
    };

    window.addEventListener(CART_LANDED, onLanded);
    return () => {
      window.removeEventListener(CART_LANDED, onLanded);
      timeline?.kill();
    };
  }, []);

  return (
    <span ref={root} data-cart-target className="relative inline-flex">
      <ButtonLink
        href="/cart"
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}` : "Cart"}
      >
        <ShoppingCart />
        {cartCount > 0 && (
          <span
            data-cart-badge
            aria-hidden
            className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-meta leading-none tracking-normal text-brand-foreground tabular-nums"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </ButtonLink>
      <span
        data-cart-ring
        aria-hidden
        className="pointer-events-none invisible absolute inset-1.5 rounded-full border border-brand opacity-0"
      />
      {/* The confirmation itself is announced by the form that added the item. */}
      <span
        data-cart-tag
        aria-hidden
        className="pointer-events-none invisible absolute top-full left-1/2 mt-1.5 flex -translate-x-1/2 items-center gap-1.5 rounded-control border border-border bg-background px-2 py-1 text-meta whitespace-nowrap uppercase opacity-0 shadow-raised"
      >
        <span className="size-1.5 rounded-full bg-brand" />
        Added
      </span>
    </span>
  );
}

function AccountControl() {
  const { user, logout, loading } = useAuth();

  if (loading) return <Skeleton className="size-10" />;

  if (!user) {
    return (
      <>
        <ButtonLink href="/login" variant="ghost" size="icon" aria-label="Sign in" className="xl:hidden">
          <UserIcon />
        </ButtonLink>
        <ButtonLink href="/login" variant="ghost" size="md" className="hidden xl:inline-flex">
          Sign in
        </ButtonLink>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account: ${user.name}`}
        className="inline-flex h-10 items-center gap-2 rounded-control px-2.5 text-small font-medium text-foreground transition-colors hover:bg-muted aria-expanded:bg-muted"
      >
        <UserIcon className="size-5" />
        <span className="hidden max-w-[7rem] truncate xl:inline">{user.name.split(" ")[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2.5 py-2">
          <p className="truncate text-small font-medium">{user.name}</p>
          <p className="truncate text-meta text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>My profile</DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/orders" />}>Orders</DropdownMenuItem>
        {user.role === "admin" && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            Admin dashboard
            <ArrowRight className="ml-auto" />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
