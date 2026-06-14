"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchProducts, deleteProduct, deleteProductsBulk } from "@/lib/api";
import { formatCurrency, cn, getServerUrl } from "@/lib/utils";
import {
  Package,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  X,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter state
  const [filterName, setFilterName] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{ name?: string; model?: string; status?: string }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Temporary workaround until fetchProducts supports query params, or fetch all and filter in frontend for now
      // Let's filter in frontend if fetchProducts doesn't accept params yet
      const data = await fetchProducts();
      
      let filtered = data;
      if (appliedFilters.name) {
        filtered = filtered.filter((p: any) => p.name.toLowerCase().includes(appliedFilters.name!.toLowerCase()));
      }
      if (appliedFilters.model) {
        filtered = filtered.filter((p: any) => p.model?.toLowerCase().includes(appliedFilters.model!.toLowerCase()));
      }
      if (appliedFilters.status !== undefined && appliedFilters.status !== "") {
        const statusBool = appliedFilters.status === "true";
        filtered = filtered.filter((p: any) => p.status === statusBool);
      }
      
      setProducts(filtered);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProducts.map((p) => p._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("rfid_token") || "";
      await deleteProduct(id, token);
      setSuccess("Product deleted successfully.");
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} product(s)?`)) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("rfid_token") || "";
      await deleteProductsBulk(selectedIds, token);
      setSuccess(`${selectedIds.length} product(s) deleted.`);
      setSelectedIds([]);
      loadProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete products");
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilters({ name: filterName, model: filterModel, status: filterStatus });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilterName("");
    setFilterModel("");
    setFilterStatus("");
    setAppliedFilters({});
    setCurrentPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-500">Manage your product listings and inventory.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadProducts()}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/products/new">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 gap-1.5">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800 flex items-center justify-between">
          {error}
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800 flex items-center justify-between">
          {success}
          <button onClick={() => setSuccess("")} className="text-emerald-500 hover:text-emerald-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        {/* Product List Table */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-zinc-100 px-5 py-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Product List</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.includes(p._id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium w-16">Image</th>
                  <th className="px-4 py-3 font-medium">Product Name</th>
                  <th className="px-4 py-3 font-medium">Model</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium text-center">Quantity</th>
                  <th className="px-4 py-3 font-medium text-center">Status</th>
                  <th className="px-4 py-3 font-medium text-right w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                      <Package className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                      No products found. Click "Add Product" to create one.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => {
                    const imageUrl = product.images?.[0] ? getServerUrl(product.images[0]) : null;
                    return (
                      <tr key={product._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product._id)}
                            onChange={(e) => handleSelectOne(product._id, e.target.checked)}
                            className="h-4 w-4 rounded border-zinc-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover border border-zinc-200 bg-white"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-zinc-100 flex items-center justify-center border border-zinc-200">
                              <ImageIcon className="h-5 w-5 text-zinc-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-zinc-900">{product.name}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{product.category?.name || "Uncategorized"}</div>
                        </td>
                        <td className="px-4 py-3 text-zinc-700">{product.model || product.sku}</td>
                        <td className="px-4 py-3 font-medium text-zinc-900">{formatCurrency(product.price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              product.stock > 10
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                : product.stock > 0
                                ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                            )}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              product.status !== false
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                            )}
                          >
                            {product.status !== false ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/products/${product._id}`}>
                              <button className="p-1.5 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors" title="Edit">
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3 mt-auto">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, products.length)} of {products.length} ({totalPages} Pages)
              </p>
            </div>
          )}
        </div>

        {/* Filter Sidebar */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Filter</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name</label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Product Name"
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Model</label>
              <input
                type="text"
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                placeholder="Model"
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
              >
                <option value="">All</option>
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleApplyFilter}
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Button
                onClick={handleClearFilter}
                size="sm"
                variant="ghost"
                className="px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
