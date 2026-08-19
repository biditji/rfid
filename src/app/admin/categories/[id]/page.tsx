"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCategories, fetchCategoryById, updateCategory, uploadImage } from "@/lib/api";
import { revalidateCategories } from "@/lib/revalidate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Undo2, UploadCloud, X } from "lucide-react";
import { cn, getServerUrl } from "@/lib/utils";

const TABS = ["General", "Data", "SEO"] as const;
type Tab = (typeof TABS)[number];

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("General");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    sortOrder: "0",
    status: "true",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [cats, category] = await Promise.all([
          fetchCategories(),
          fetchCategoryById(id),
        ]);
        setCategories(cats);

        if (!category) {
          setError("Category not found");
          return;
        }

        setFormData({
          name: category.name || "",
          description: category.description || "",
          parent: category.parent?._id || category.parent || "",
          sortOrder: String(category.sortOrder ?? 0),
          status: String(category.status ?? true),
          slug: category.slug || "",
          metaTitle: category.metaTitle || "",
          metaDescription: category.metaDescription || "",
          metaKeywords: category.metaKeywords || "",
        });

        if (category.image) {
          setExistingImage(category.image);
          setImagePreview(getServerUrl(category.image));
        }
      } catch (err) {
        console.error("Failed to load category data", err);
        setError("Failed to load category");
      } finally {
        setPageLoading(false);
      }
    };

    if (!loading) loadData();
  }, [user, loading, router, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("rfid_token") || "";

      let imageUrl = existingImage || "";
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, token);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        parent: formData.parent || null,
        sortOrder: Number(formData.sortOrder),
        status: formData.status === "true",
        slug: formData.slug,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        image: imageUrl || undefined,
      };

      await updateCategory(id, payload, token);
      // Flush the storefront cache so the change is visible right away.
      await revalidateCategories();

      setSuccess("Category updated successfully!");
      setTimeout(() => router.push("/admin/categories"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || pageLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Edit Category</h1>
          <p className="text-sm text-zinc-500">Update category details.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            form="category-form"
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            className="gap-1.5"
          >
            <Undo2 className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">{error}</div>
      )}
      {success && (
        <div className="rounded-md bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-zinc-200">
          <nav className="flex">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <form id="category-form" onSubmit={handleSubmit} className="p-6">
          {/* General Tab */}
          {activeTab === "General" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-zinc-900">
                  <span className="text-red-500 mr-0.5">*</span>Category Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Category Name"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-zinc-900">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Category description..."
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="metaTitle" className="text-sm font-medium text-zinc-900">
                  <span className="text-red-500 mr-0.5">*</span>Meta Tag Title
                </Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  placeholder="Meta Tag Title"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription" className="text-sm font-medium text-zinc-900">
                  Meta Tag Description
                </Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  rows={3}
                  value={formData.metaDescription}
                  onChange={handleChange}
                  placeholder="Meta Tag Description"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="metaKeywords" className="text-sm font-medium text-zinc-900">
                  Meta Tag Keywords
                </Label>
                <Textarea
                  id="metaKeywords"
                  name="metaKeywords"
                  rows={3}
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  placeholder="Meta Tag Keywords"
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === "Data" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <Label htmlFor="parent" className="text-sm font-medium text-zinc-900">
                  Parent Category
                </Label>
                <div className="mt-1.5">
                  <Select
                    value={formData.parent || "none"}
                    onValueChange={(val) =>
                      setFormData((prev) => ({ ...prev, parent: val === "none" ? "" : (val ?? "") }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="— None —" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      {categories
                        .filter((c) => !c.parent && c._id !== id)
                        .map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      {categories
                        .filter((c) => c.parent && c._id !== id)
                        .map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            &nbsp;&nbsp;↳ {cat.parent?.name ? `${cat.parent.name} > ` : ""}{cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-sm font-medium text-zinc-900">
                  Sort Order
                </Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min="0"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="mt-1.5 max-w-[200px]"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-zinc-900">Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-300 px-6 py-8">
                  <div className="text-center">
                    {imagePreview ? (
                      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-md border border-zinc-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            setExistingImage(null);
                          }}
                          className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <UploadCloud
                        className="mx-auto h-10 w-10 text-zinc-300"
                        aria-hidden="true"
                      />
                    )}
                    <div className="mt-3 flex text-sm text-zinc-600 justify-center">
                      <label
                        htmlFor="cat-image-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500"
                      >
                        <span>Upload image</span>
                        <input
                          id="cat-image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedImage(e.target.files[0]);
                              setImagePreview(URL.createObjectURL(e.target.files[0]));
                              setExistingImage(null);
                            }
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-zinc-900">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1.5 w-full max-w-[200px] h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "SEO" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <Label htmlFor="slug" className="text-sm font-medium text-zinc-900">
                  SEO URL / Slug
                </Label>
                <div className="mt-1.5 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-zinc-500 sm:text-sm">
                    /category/
                  </span>
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="rounded-l-none"
                    placeholder="rfid-readers"
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  Leave empty to auto-generate from category name.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
