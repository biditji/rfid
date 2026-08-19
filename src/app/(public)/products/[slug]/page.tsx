import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/products";
import { formatCurrency, getStockStatus, cn, getServerUrl } from "@/lib/utils";
import { ShoppingCart, Package, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ImageGallery } from "@/components/products/image-gallery";

// Props definition for dynamic route
type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

/**
 * Prebuild the catalog's product pages so a visitor arriving from a search
 * engine gets HTML immediately instead of waiting on a live backend call.
 * Slugs not listed here are still rendered on demand and then cached.
 */
export async function generateStaticParams() {
  const products = await getProducts();
  if (!Array.isArray(products)) return [];
  return products
    .filter((p: any) => p?.slug)
    .map((p: any) => ({ slug: String(p.slug) }));
}

// Generate SEO Metadata dynamically based on the product
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | Virtualsphere" };
  }

  // Fallback to name/description if custom SEO fields are empty
  const title = product.metaTitle || `${product.name} | Virtualsphere`;
  const description = product.metaDescription || product.description?.substring(0, 160) || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images?.[0] ? [{ url: getServerUrl(product.images[0]) }] : [],
    },
  };
}

// Main Page Component
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockStatus = getStockStatus(product.stock);
  // Resolve image paths against the backend origin, dropping repeats: a
  // filename collision in the old upload handler left some products listing the
  // same file twice, which rendered as duplicate thumbnails in the gallery.
  const imageUrls: string[] = Array.from(
    new Set<string>(
      (product.images ?? [])
        .filter(Boolean)
        .map((img: string) => getServerUrl(img))
    )
  );

  return (
    <div className="bg-zinc-50 min-h-screen pb-24">
      {/* Breadcrumbs / Top Bar */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm font-medium text-zinc-500">
            <a href="/" className="hover:text-zinc-900 transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-zinc-900 transition-colors">Products</a>
            <span className="mx-2">/</span>
            {product.category && (
              <>
                <span className="text-zinc-500">{product.category.name || 'Category'}</span>
                <span className="mx-2">/</span>
              </>
            )}
            <span className="text-zinc-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column - Image Gallery */}
          <div className="lg:sticky lg:top-8">
            <ImageGallery images={imageUrls} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0">
            <div className="mb-4 flex items-center justify-between">
              {product.category && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                  {product.category.name}
                </span>
              )}
              <span className="text-sm text-zinc-500">SKU: <span className="font-mono text-zinc-700">{product.sku}</span></span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-bold tracking-tight text-zinc-900">{formatCurrency(product.price)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div 
                className="prose prose-zinc max-w-none text-zinc-700 prose-table:border-collapse prose-table:w-full prose-th:border prose-th:border-zinc-200 prose-th:bg-zinc-50 prose-th:p-3 prose-th:text-left prose-td:border prose-td:border-zinc-200 prose-td:p-3 prose-img:rounded-lg prose-img:border prose-img:border-zinc-200"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-8">
              <h3 className="text-lg font-medium text-zinc-900 mb-4">Product Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                {product.model && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">Model</dt>
                    <dd className="text-zinc-900 mt-1">{product.model}</dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">SKU</dt>
                    <dd className="text-zinc-900 mt-1">{product.sku}</dd>
                  </div>
                )}
                {product.upc && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">UPC</dt>
                    <dd className="text-zinc-900 mt-1">{product.upc}</dd>
                  </div>
                )}
                {product.ean && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">EAN</dt>
                    <dd className="text-zinc-900 mt-1">{product.ean}</dd>
                  </div>
                )}
                {product.jan && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">JAN</dt>
                    <dd className="text-zinc-900 mt-1">{product.jan}</dd>
                  </div>
                )}
                {product.isbn && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">ISBN</dt>
                    <dd className="text-zinc-900 mt-1">{product.isbn}</dd>
                  </div>
                )}
                {product.mpn && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">MPN</dt>
                    <dd className="text-zinc-900 mt-1">{product.mpn}</dd>
                  </div>
                )}
                {product.weight > 0 && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">Weight</dt>
                    <dd className="text-zinc-900 mt-1">{product.weight} {product.weightClass}</dd>
                  </div>
                )}
                {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">Dimensions (L x W x H)</dt>
                    <dd className="text-zinc-900 mt-1">
                      {product.dimensions.length || 0} x {product.dimensions.width || 0} x {product.dimensions.height || 0} {product.lengthClass}
                    </dd>
                  </div>
                )}
                {product.minimumQuantity > 1 && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <dt className="text-zinc-500 font-medium">Minimum Order Quantity</dt>
                    <dd className="text-zinc-900 mt-1">{product.minimumQuantity}</dd>
                  </div>
                )}
                {product.productTags && (
                  <div className="flex flex-col border-b border-zinc-100 pb-2 sm:col-span-2">
                    <dt className="text-zinc-500 font-medium">Tags</dt>
                    <dd className="text-zinc-900 mt-1">{product.productTags}</dd>
                  </div>
                )}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="sm:col-span-2 mt-6">
                    <h4 className="text-sm font-semibold text-zinc-900 mb-3 uppercase tracking-wider">Technical Data</h4>
                    <div className="overflow-hidden rounded-lg border border-zinc-200">
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {product.specifications.map((spec: any, idx: number) => (
                            <tr key={idx} className="border-b border-zinc-200 last:border-0">
                              <td className="py-3 px-4 font-medium text-zinc-700 bg-zinc-100/80 w-1/3 border-r border-zinc-200 align-top">
                                {spec.name}
                              </td>
                              <td className="py-3 px-4 text-zinc-900 bg-white align-top">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </dl>
            </div>

            <div className="mt-8 border-t border-zinc-200 pt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "flex items-center gap-1.5 text-sm font-medium",
                  stockStatus.color === "emerald" ? "text-emerald-700" : 
                  stockStatus.color === "amber" ? "text-amber-700" : "text-red-700"
                )}>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    stockStatus.color === "emerald" ? "bg-emerald-500" : 
                    stockStatus.color === "amber" ? "bg-amber-500" : "bg-red-500"
                  )} />
                  {stockStatus.label}
                  {product.stock > 0 && <span className="text-zinc-500 font-normal ml-1">({product.stock} available)</span>}
                </div>
              </div>

              <div className="flex gap-4">
                <AddToCartButton productId={product._id} stock={product.stock} />
              </div>
            </div>

            {/* Value Props */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium text-zinc-900">Secure Checkout</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="text-sm font-medium text-zinc-900">Fast Shipping</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
