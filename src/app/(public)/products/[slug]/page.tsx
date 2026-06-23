import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/api";
import { formatCurrency, getStockStatus, cn, getServerUrl } from "@/lib/utils";
import { ShoppingCart, Package, ShieldCheck, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ImageGallery } from "@/components/products/image-gallery";

// Props definition for dynamic route
type Props = {
  params: Promise<{ slug: string }>;
};

// Generate SEO Metadata dynamically based on the product
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

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
  const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockStatus = getStockStatus(product.stock);
  // Construct the full image URLs assuming the backend runs on port 5000
  const imageUrls = product.images && product.images.length > 0 
    ? product.images.map((img: string) => getServerUrl(img))
    : [];

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
              <div className="space-y-6 text-base text-zinc-700">
                <p>{product.description}</p>
              </div>
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
