"use client";

import { useId, useState } from "react";
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

function CartLink() {
  const { cartCount } = useCart();
  return (
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
          aria-hidden
          className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-meta leading-none tracking-normal text-brand-foreground tabular-nums"
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </ButtonLink>
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
