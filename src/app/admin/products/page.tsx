"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Package, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Products Catalog (Live)</h1>
          <p className="text-sm text-zinc-500">Manage your product listings and inventory.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
            />
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 shrink-0">
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">SKU / Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    <Package className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const imageUrl = product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "/placeholder.png";
                  return (
                    <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-zinc-200 bg-white"
                          />
                          <div>
                            <div className="font-medium text-zinc-900">{product.name}</div>
                            <div className="text-xs text-zinc-500 truncate w-48">{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-zinc-600 mb-1">{product.sku}</div>
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-zinc-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", 
                          product.stock > 10 ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20" : 
                          product.stock > 0 ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20" : 
                          "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                        )}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-zinc-400 hover:text-blue-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 text-zinc-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
