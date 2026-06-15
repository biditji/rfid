"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCategories, createProduct, uploadImages } from "@/lib/api";
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
import { cn } from "@/lib/utils";

const TABS = ["General", "Data", "Links", "Image", "SEO"] as const;
type Tab = (typeof TABS)[number];

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("General");

  // Form State
  const [formData, setFormData] = useState({
    // General
    name: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    productTags: "",
    // Data
    model: "",
    sku: "",
    upc: "",
    ean: "",
    jan: "",
    isbn: "",
    mpn: "",
    price: "",
    taxClass: "none",
    stock: "100",
    minimumQuantity: "1",
    subtractStock: "true",
    outOfStockStatus: "Out Of Stock",
    dateAvailable: new Date().toISOString().split("T")[0],
    dimensions: { length: "", width: "", height: "" },
    lengthClass: "Centimeter",
    weight: "",
    weightClass: "Kilogram",
    status: "true",
    sortOrder: "0",
    // Links
    category: "",
    // SEO
    slug: "",
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
    };
    if (!loading) loadData();
  }, [user, loading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("dim_")) {
      const dimName = name.replace("dim_", "");
      setFormData((prev) => ({
        ...prev,
        dimensions: { ...prev.dimensions, [dimName]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("rfid_token") || "";

      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        const uploadedPaths = await uploadImages(selectedImages, token);
        imageUrls = [...uploadedPaths];
      }

      const payload = {
        // General
        name: formData.name,
        description: formData.description,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
        productTags: formData.productTags,
        // Data
        model: formData.model,
        sku: formData.sku,
        upc: formData.upc,
        ean: formData.ean,
        jan: formData.jan,
        isbn: formData.isbn,
        mpn: formData.mpn,
        price: Number(formData.price),
        taxClass: formData.taxClass === "none" ? undefined : formData.taxClass,
        stock: Number(formData.stock),
        minimumQuantity: Number(formData.minimumQuantity),
        subtractStock: formData.subtractStock === "true",
        outOfStockStatus: formData.outOfStockStatus,
        dateAvailable: formData.dateAvailable,
        dimensions: formData.dimensions,
        lengthClass: formData.lengthClass,
        weight: Number(formData.weight) || 0,
        weightClass: formData.weightClass,
        status: formData.status === "true",
        sortOrder: Number(formData.sortOrder),
        // Links
        category: formData.category || undefined,
        // Image
        images: imageUrls,
        // SEO
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      };

      await createProduct(payload, token);

      setSuccess("Product created successfully!");
      setTimeout(() => router.push("/admin/products"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add Product</h1>
          <p className="text-sm text-zinc-500">Create a new product.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="submit"
            form="product-form"
            disabled={isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 gap-1.5"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
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
        <div className="border-b border-zinc-200 overflow-x-auto">
          <nav className="flex min-w-max">
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

        <form id="product-form" onSubmit={handleSubmit} className="p-6">
          {/* General Tab */}
          <div className={activeTab === "General" ? "block space-y-6 max-w-4xl" : "hidden"}>
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-zinc-900">
                <span className="text-red-500 mr-0.5">*</span>Product Name
              </Label>
              <Input
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-zinc-900">
                <span className="text-red-500 mr-0.5">*</span>Description
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={10}
                value={formData.description}
                onChange={handleChange}
                placeholder="Product description..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="metaTitle" className="text-sm font-medium text-zinc-900">
                Meta Tag Title
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
            <div>
              <Label htmlFor="productTags" className="text-sm font-medium text-zinc-900">
                Product Tags
              </Label>
              <Input
                id="productTags"
                name="productTags"
                value={formData.productTags}
                onChange={handleChange}
                placeholder="Comma separated"
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Data Tab */}
          <div className={activeTab === "Data" ? "block max-w-3xl" : "hidden"}>
            
            {/* Section 1: Product Identifiers */}
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-wide text-zinc-900 uppercase border-b border-zinc-200 pb-2 mb-4">Product Identifiers</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="model" className="text-sm font-medium text-zinc-900">
                    <span className="text-red-500 mr-0.5">*</span>Model
                  </Label>
                  <Input id="model" name="model" required value={formData.model} onChange={handleChange} placeholder="Model" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="sku" className="text-sm font-medium text-zinc-900">
                    <span className="text-red-500 mr-0.5">*</span>SKU
                  </Label>
                  <Input id="sku" name="sku" required value={formData.sku} onChange={handleChange} placeholder="Stock Keeping Unit" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="upc" className="text-sm font-medium text-zinc-900">UPC</Label>
                    <Input id="upc" name="upc" value={formData.upc} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="ean" className="text-sm font-medium text-zinc-900">EAN</Label>
                    <Input id="ean" name="ean" value={formData.ean} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="jan" className="text-sm font-medium text-zinc-900">JAN</Label>
                    <Input id="jan" name="jan" value={formData.jan} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="isbn" className="text-sm font-medium text-zinc-900">ISBN</Label>
                    <Input id="isbn" name="isbn" value={formData.isbn} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="mpn" className="text-sm font-medium text-zinc-900">MPN</Label>
                    <Input id="mpn" name="mpn" value={formData.mpn} onChange={handleChange} className="mt-1.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing & Inventory */}
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-wide text-zinc-900 uppercase border-b border-zinc-200 pb-2 mb-4">Pricing & Inventory</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-zinc-900">
                      <span className="text-red-500 mr-0.5">*</span>Price
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Price"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxClass" className="text-sm font-medium text-zinc-900">
                      Tax Class
                    </Label>
                    <select
                      id="taxClass"
                      name="taxClass"
                      value={formData.taxClass}
                      onChange={handleChange}
                      className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="none">--- None ---</option>
                      <option value="Taxable Goods">Taxable Goods</option>
                      <option value="Downloadable Products">Downloadable Products</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock" className="text-sm font-medium text-zinc-900">
                      Quantity
                    </Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumQuantity" className="text-sm font-medium text-zinc-900">
                      Minimum Quantity
                    </Label>
                    <Input
                      id="minimumQuantity"
                      name="minimumQuantity"
                      type="number"
                      min="1"
                      value={formData.minimumQuantity}
                      onChange={handleChange}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subtractStock" className="text-sm font-medium text-zinc-900">
                      Subtract Stock
                    </Label>
                    <select
                      id="subtractStock"
                      name="subtractStock"
                      value={formData.subtractStock}
                      onChange={handleChange}
                      className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="outOfStockStatus" className="text-sm font-medium text-zinc-900">
                      Out Of Stock Status
                    </Label>
                    <select
                      id="outOfStockStatus"
                      name="outOfStockStatus"
                      value={formData.outOfStockStatus}
                      onChange={handleChange}
                      className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="2-3 Days">2-3 Days</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Out Of Stock">Out Of Stock</option>
                      <option value="Pre-Order">Pre-Order</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateAvailable" className="text-sm font-medium text-zinc-900">
                    Date Available
                  </Label>
                  <Input
                    id="dateAvailable"
                    name="dateAvailable"
                    type="date"
                    value={formData.dateAvailable}
                    onChange={handleChange}
                    className="mt-1.5 max-w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Specifications */}
            <div className="mb-8">
              <h3 className="text-sm font-bold tracking-wide text-zinc-900 uppercase border-b border-zinc-200 pb-2 mb-4">Specifications</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-zinc-900">
                    Dimensions (L x W x H)
                  </Label>
                  <div className="grid grid-cols-3 gap-4 mt-1.5">
                    <Input name="dim_length" value={formData.dimensions.length} onChange={handleChange} placeholder="Length" />
                    <Input name="dim_width" value={formData.dimensions.width} onChange={handleChange} placeholder="Width" />
                    <Input name="dim_height" value={formData.dimensions.height} onChange={handleChange} placeholder="Height" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lengthClass" className="text-sm font-medium text-zinc-900">
                      Length Class
                    </Label>
                    <select
                      id="lengthClass"
                      name="lengthClass"
                      value={formData.lengthClass}
                      onChange={handleChange}
                      className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="Centimeter">Centimeter</option>
                      <option value="Millimeter">Millimeter</option>
                      <option value="Inch">Inch</option>
                    </select>
                  </div>
                  <div></div>
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium text-zinc-900">
                      Weight
                    </Label>
                    <Input id="weight" name="weight" type="number" step="0.01" value={formData.weight} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="weightClass" className="text-sm font-medium text-zinc-900">
                      Weight Class
                    </Label>
                    <select
                      id="weightClass"
                      name="weightClass"
                      value={formData.weightClass}
                      onChange={handleChange}
                      className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                    >
                      <option value="Kilogram">Kilogram</option>
                      <option value="Gram">Gram</option>
                      <option value="Pound">Pound</option>
                      <option value="Ounce">Ounce</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Settings */}
            <div>
              <h3 className="text-sm font-bold tracking-wide text-zinc-900 uppercase border-b border-zinc-200 pb-2 mb-4">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-zinc-900">
                    Status
                  </Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1.5 w-full h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="sortOrder" className="text-sm font-medium text-zinc-900">
                    Sort Order
                  </Label>
                  <Input
                    id="sortOrder"
                    name="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={handleChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Links Tab */}
          <div className={activeTab === "Links" ? "block space-y-6 max-w-2xl" : "hidden"}>
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-zinc-900">
                <span className="text-red-500 mr-0.5">*</span>Categories
              </Label>
              <div className="mt-1.5">
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val ?? "" }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="— Select Category —" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => !c.parent).map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    {categories.filter((c) => c.parent).map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        &nbsp;&nbsp;↳ {cat.parent?.name ? `${cat.parent.name} > ` : ""}{cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Assign this product to a category so customers can find it.
              </p>
            </div>
          </div>

          {/* Image Tab */}
          <div className={activeTab === "Image" ? "block space-y-6 max-w-2xl" : "hidden"}>
            <div>
              <Label className="text-sm font-medium text-zinc-900">Image</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-300 px-6 py-8">
                <div className="text-center w-full">
                  {imagePreviews.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center mb-6">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative h-32 w-32 overflow-hidden rounded-md border border-zinc-200">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
                              setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <UploadCloud
                      className="mx-auto h-12 w-12 text-zinc-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mt-4 flex text-sm text-zinc-600 justify-center">
                    <label
                      htmlFor="product-image-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="product-image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const files = Array.from(e.target.files);
                            setSelectedImages((prev) => [...prev, ...files]);
                            setImagePreviews((prev) => [
                              ...prev,
                              ...files.map((f) => URL.createObjectURL(f)),
                            ]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">PNG, JPG, GIF up to 5MB (multiple allowed)</p>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Tab */}
          <div className={activeTab === "SEO" ? "block space-y-6 max-w-2xl" : "hidden"}>
            <div>
              <Label htmlFor="slug" className="text-sm font-medium text-zinc-900">
                SEO URL / Slug
              </Label>
              <div className="mt-1.5 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-zinc-500 sm:text-sm">
                  /product/
                </span>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="rounded-l-none"
                  placeholder="product-name"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Leave empty to auto-generate from product name.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
