import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { KeySpec, ProductSummary } from "@/lib/products";
import { ProductMedia } from "@/components/shared/product-image";
import { StockBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";

type ProductCardVariant = "featured" | "rail" | "grid";

type ProductCardProps = {
  product: ProductSummary;
  /**
   * featured  large spec sheet — image left, data right (home showcase)
   * rail      compact, fixed width, for horizontal rails
   * grid      the catalogue card
   */
  variant?: ProductCardVariant;
  /** Sheet number for featured cards shown as a sequence ("01 / 04"). */
  index?: number;
  total?: number;
  /** Heading level of the product name; h3 under a section h2 by default. */
  headingLevel?: "h2" | "h3";
  /** Mark the photo as the page's LCP image. */
  priority?: boolean;
  className?: string;
};

/**
 * The one product card. Every variant shares the same parts — plate, metadata,
 * title, specs, price, stock, CTA — in the same styles; variants only change
 * how those parts are arranged.
 *
 * The product name is the card's link, stretched over the whole card, so the
 * card is a single tab stop announced by the product's name.
 */
export function ProductCard({
  product,
  variant = "grid",
  index,
  total,
  headingLevel = "h3",
  priority = false,
  className,
}: ProductCardProps) {
  const href = `/products/${product.slug}`;

  if (variant === "featured") {
    return (
      <article className={cn(cardBase, "grid grid-cols-1 md:grid-cols-12", className)}>
        <div className="relative md:col-span-7">
          <ProductMedia
            src={product.image}
            alt={product.name}
            placeholder={product.name}
            sizes="(max-width: 768px) 100vw, 55vw"
            priority={priority}
            className="aspect-[4/3] h-full md:aspect-auto"
          />
          {index !== undefined && total !== undefined && (
            <span className="absolute top-5 left-5 text-meta text-muted-foreground tabular-nums">
              {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-5 p-6 sm:p-8 md:col-span-5 md:border-l md:border-border lg:p-10">
          <div className="flex items-start justify-between gap-4">
            <CardMeta product={product} />
            <StockBadge stock={product.stock} />
          </div>
          <CardTitle href={href} level={headingLevel} className="text-h2">
            {product.name}
          </CardTitle>
          {product.excerpt && (
            <p className="line-clamp-3 text-small text-pretty text-muted-foreground">{product.excerpt}</p>
          )}
          <SpecList specs={product.keySpecs} />
          <div className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-border pt-6">
            <div>
              <Price product={product} className="text-h3" />
              <MinimumOrder quantity={product.minimumQuantity} />
            </div>
            <CardCta emphasis="button" />
          </div>
        </div>
      </article>
    );
  }

  const isRail = variant === "rail";

  return (
    <article
      className={cn(cardBase, "flex flex-col", isRail && "w-[16.5rem] shrink-0 snap-start sm:w-[18rem]", className)}
    >
      <div className="relative">
        <ProductMedia
          src={product.image}
          alt={product.name}
          placeholder={product.name}
          sizes={isRail ? "288px" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"}
          priority={priority}
          className={isRail ? "aspect-square" : "aspect-[4/3]"}
        />
        {/* On the plate: a white chip under the tinted badge keeps its contrast. */}
        <span className="absolute top-3 left-3 rounded-control bg-background">
          <StockBadge stock={product.stock} />
        </span>
        {product.minimumQuantity > 1 && (
          <Badge tone="outline" className="absolute top-3 right-3 bg-background">
            MOQ {product.minimumQuantity}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <CardMeta product={product} />
        <CardTitle href={href} level={headingLevel} className="line-clamp-2 text-body leading-snug font-semibold">
          {product.name}
        </CardTitle>
        {!isRail && <SpecList specs={product.keySpecs.slice(0, 2)} compact />}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <Price product={product} className="text-body" />
          <CardCta />
        </div>
      </div>
    </article>
  );
}

/* ─── Shared parts ─────────────────────────────────────────────────────── */

/** Border lift on hover; the whole card shows the focus ring when its link is focused. */
const cardBase =
  "group relative overflow-hidden rounded-card border border-border bg-card text-card-foreground transition-colors duration-200 hover:border-foreground/25 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-ring";

function CardMeta({ product }: { product: ProductSummary }) {
  if (!product.categoryName && !product.sku) return null;
  return (
    <p className="flex min-w-0 items-center gap-2 text-meta text-muted-foreground uppercase">
      {product.categoryName && <span className="truncate">{product.categoryName}</span>}
      {product.categoryName && product.sku && <span aria-hidden className="h-3 w-px shrink-0 bg-border-strong" />}
      {product.sku && (
        <span className="shrink-0 font-mono tracking-normal">
          <span className="sr-only">SKU </span>
          {product.sku}
        </span>
      )}
    </p>
  );
}

function CardTitle({
  href,
  level: Heading,
  className,
  children,
}: {
  href: string;
  level: "h2" | "h3";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Heading className={cn("text-balance", className)}>
      <Link
        href={href}
        className="decoration-foreground/30 underline-offset-4 group-hover:underline after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
      >
        {children}
      </Link>
    </Heading>
  );
}

/** Headline specifications as label / value rows; values are technical, so mono. */
function SpecList({ specs, compact = false }: { specs: KeySpec[]; compact?: boolean }) {
  if (specs.length === 0) return null;
  return (
    <dl className={cn("divide-y divide-border border-y border-border", compact && "border-t-0")}>
      {specs.map((spec) => (
        <div key={spec.label} className={cn("flex items-baseline justify-between gap-4", compact ? "py-1.5" : "py-2.5")}>
          <dt className="shrink-0 text-meta text-muted-foreground uppercase">{spec.label}</dt>
          <dd className="min-w-0 truncate text-right font-mono text-tech" title={spec.value}>
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Price({ product, className }: { product: ProductSummary; className?: string }) {
  const onSale = product.compareAtPrice !== undefined && product.compareAtPrice > product.price;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-semibold tracking-tight tabular-nums", className)}>
        {formatCurrency(product.price)}
      </span>
      {onSale && (
        <s className="text-small text-muted-foreground tabular-nums">
          <span className="sr-only">was </span>
          {formatCurrency(product.compareAtPrice!)}
        </s>
      )}
    </p>
  );
}

function MinimumOrder({ quantity }: { quantity: number }) {
  if (quantity <= 1) return null;
  return <p className="mt-1 text-meta text-muted-foreground uppercase">Minimum order {quantity} units</p>;
}

/**
 * The card's call to action. Decorative — the stretched title link already
 * makes the whole card clickable — so it's hidden from assistive tech rather
 * than announced as a second link to the same page.
 */
function CardCta({ emphasis = "text" }: { emphasis?: "text" | "button" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 font-medium",
        emphasis === "button"
          ? "h-11 rounded-control bg-primary px-5 text-small text-primary-foreground transition-colors group-hover:bg-primary-hover"
          : "text-small text-foreground"
      )}
    >
      View details
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </span>
  );
}
