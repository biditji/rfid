"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchCategories, deleteCategory, deleteCategoriesBulk, uploadImage } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Search,
  FolderTree,
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filter state
  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{ name?: string; status?: string }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategories(appliedFilters);
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Build display name showing parent hierarchy
  const getDisplayName = (cat: any) => {
    if (cat.parent && cat.parent.name) {
      return `${cat.parent.name} > ${cat.name}`;
    }
    return cat.name;
  };

  // Pagination logic
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedCategories.map((c) => c._id));
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
    if (!confirm("Are you sure you want to delete this category?")) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("rfid_token") || "";
      await deleteCategory(id, token);
      setSuccess("Category deleted successfully.");
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete category");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} category(ies)?`)) return;
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("rfid_token") || "";
      await deleteCategoriesBulk(selectedIds, token);
      setSuccess(`${selectedIds.length} category(ies) deleted.`);
      setSelectedIds([]);
      loadCategories();
    } catch (err: any) {
      setError(err.message || "Failed to delete categories");
    }
  };

  const handleApplyFilter = () => {
    setAppliedFilters({ name: filterName, status: filterStatus });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilterName("");
    setFilterStatus("");
    setAppliedFilters({});
    setCurrentPage(1);
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Categories</h1>
          <p className="text-sm text-zinc-500">Manage your product categories and subcategories.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadCategories()}
            className="gap-1.5"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/categories/new">
            <Button className="bg-slate-900 text-white hover:bg-slate-800 gap-1.5">
              <Plus className="h-4 w-4" />
              Add Category
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
        {/* Category List Table */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-zinc-100 px-5 py-3 flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-900">Category List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedCategories.length > 0 && paginatedCategories.every((c) => selectedIds.includes(c._id))}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium w-16">Image</th>
                  <th className="px-4 py-3 font-medium">Category Name</th>
                  <th className="px-4 py-3 font-medium text-center w-24">Sort Order</th>
                  <th className="px-4 py-3 font-medium text-center w-24">Status</th>
                  <th className="px-4 py-3 font-medium text-center w-24">Products</th>
                  <th className="px-4 py-3 font-medium text-center w-28">Subcategories</th>
                  <th className="px-4 py-3 font-medium text-right w-32">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                      <FolderTree className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                      No categories found. Click &quot;Add Category&quot; to create one.
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => {
                    const imageUrl = cat.image
                      ? `http://localhost:5000${cat.image}`
                      : null;
                    return (
                      <tr key={cat._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(cat._id)}
                            onChange={(e) => handleSelectOne(cat._id, e.target.checked)}
                            className="h-4 w-4 rounded border-zinc-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={cat.name}
                              className="h-10 w-10 rounded-md object-cover border border-zinc-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-zinc-100 flex items-center justify-center border border-zinc-200">
                              <ImageIcon className="h-5 w-5 text-zinc-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900">
                          {getDisplayName(cat)}
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">{cat.sortOrder}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                              cat.status
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                            )}
                          >
                            {cat.status ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-zinc-600">
                          {cat.productCount ?? 0}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(cat.subcategoryCount ?? 0) > 0 ? (
                            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                              {cat.subcategoryCount}
                            </span>
                          ) : (
                            <span className="text-zinc-400">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/categories/new?parent=${cat._id}`} title="Add Subcategory">
                              <button className="p-1.5 rounded-md text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
                                <Plus className="h-4 w-4" />
                              </button>
                            </Link>
                            <Link href={`/admin/categories/${cat._id}`} title="Edit">
                              <button className="p-1.5 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                                <Edit className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDelete(cat._id)}
                              title="Delete"
                              className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 transition-colors"
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
            <div className="flex items-center justify-between border-t border-zinc-200 px-5 py-3">
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
                {Math.min(currentPage * ITEMS_PER_PAGE, categories.length)} of {categories.length} ({totalPages} Pages)
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
              <label className="block text-sm font-medium text-zinc-700 mb-1">Category Name</label>
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Category Name"
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
