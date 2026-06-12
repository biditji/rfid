"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCategories, createProduct, uploadImage, createCategory } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Tag, Settings, LayoutList, Image as ImageIcon, UploadCloud } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
  });
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    // If not logged in, redirect to login page
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name if slug is empty or user is typing name
    if (name === "name" && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("rfid_token");
      // We removed the throw new Error here temporarily so we can test, but the backend requires a token.
      
      let imageUrls: string[] = [];
      
      if (selectedImage) {
        // Upload the image first
        const imagePath = await uploadImage(selectedImage, token || "");
        imageUrls.push(imagePath);
      }
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        images: imageUrls,
      };

      await createProduct(payload, token || "");
      
      setSuccess("Product created successfully!");
      setFormData({
        name: "", description: "", price: "", stock: "", sku: "", category: "", slug: "", metaTitle: "", metaDescription: "",
      });
      setTimeout(() => router.push("/products"), 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Add New Product</h1>
          <p className="mt-1 text-sm text-zinc-500">Create a new product for your catalog with full SEO controls.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && <div className="rounded-md bg-red-50 p-4 text-sm font-medium text-red-800">{error}</div>}
        {success && <div className="rounded-md bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{success}</div>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-zinc-900">General Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" required rows={4} value={formData.description} onChange={handleChange} className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" min="0" step="0.01" required value={formData.price} onChange={handleChange} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input id="stock" name="stock" type="number" min="0" required value={formData.stock} onChange={handleChange} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="sku">SKU (Barcode/Identifier)</Label>
                  <Input id="sku" name="sku" required value={formData.sku} onChange={handleChange} className="mt-1.5" />
                </div>
              </div>
            </div>
            
            {/* Image Upload */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-zinc-900">Product Image</h2>
              </div>
              
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-zinc-900/25 px-6 py-10">
                <div className="text-center">
                  {imagePreview ? (
                    <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-md border border-zinc-200">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <span className="sr-only">Remove</span>
                        &times;
                      </button>
                    </div>
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-zinc-300" aria-hidden="true" />
                  )}
                  
                  <div className="mt-4 flex text-sm leading-6 text-zinc-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedImage(e.target.files[0]);
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-zinc-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <Settings className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-zinc-900">Search Engine Optimization</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="mt-1.5 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-zinc-500 sm:text-sm">
                      rfidhub.com/products/
                    </span>
                    <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} className="rounded-l-none" placeholder="uhf-rfid-tag" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="metaTitle">Meta Title (Optional)</Label>
                  <Input id="metaTitle" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="mt-1.5" placeholder="Buy High Performance UHF RFID Tags Online" />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description (Optional)</Label>
                  <Textarea id="metaDescription" name="metaDescription" rows={3} value={formData.metaDescription} onChange={handleChange} className="mt-1.5" placeholder="Shop the best enterprise-grade RFID tags..." />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <LayoutList className="h-5 w-5 text-zinc-400" />
                <h2 className="text-lg font-semibold text-zinc-900">Organization</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-zinc-900">Category</Label>
                  <div className="mt-1.5">
                    <Select value={formData.category} onValueChange={handleSelectChange} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => !c.parent).map(parent => (
                          <SelectGroup key={parent._id}>
                            <SelectLabel className="font-bold text-zinc-900 border-b border-zinc-100 mb-1">{parent.name}</SelectLabel>
                            <SelectItem value={parent._id} className="font-semibold text-zinc-700">All {parent.name}</SelectItem>
                            {categories.filter(c => c.parent === parent._id).map(child => (
                              <SelectItem key={child._id} value={child._id} className="pl-6 text-zinc-600">
                                ↳ {child.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                        {categories.filter(c => !c.parent && categories.every(child => child.parent !== c._id)).map(single => (
                          <SelectItem key={single._id} value={single._id}>{single.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-slate-900 py-6 text-base text-white hover:bg-slate-800">
              <PlusCircle className="mr-2 h-5 w-5" />
              {isLoading ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
