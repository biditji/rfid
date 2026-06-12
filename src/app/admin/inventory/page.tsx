"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { Search, AlertTriangle, ArrowUpDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminInventoryPage() {
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

  const lowStockCount = products.filter(p => p.stock <= 15).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Inventory Management (Live)</h1>
          <p className="text-sm text-zinc-500">Track and update stock levels directly in MongoDB.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-800 font-medium">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            {lowStockCount} items low in stock
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-zinc-300"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-600">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">SKU</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Available Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-zinc-50">
                  <td className="px-6 py-3">
                    <div className="font-medium text-zinc-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      product.stock > 15 ? 'bg-emerald-50 text-emerald-700' :
                      product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        product.stock > 15 ? 'bg-emerald-500' :
                        product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      {product.stock > 15 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end">
                      <div className="flex w-32 items-center overflow-hidden rounded-md border border-zinc-200 bg-white">
                        <button className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                          -
                        </button>
                        <input
                          type="number"
                          className="h-8 flex-1 text-center text-sm font-medium text-zinc-900 outline-none hide-arrows"
                          defaultValue={product.stock}
                        />
                        <button className="flex h-8 w-8 items-center justify-center text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
