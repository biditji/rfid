"use client";

import { Save, Globe, FileText, Bot } from "lucide-react";

export default function SEOPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">SEO Settings</h1>
        <p className="text-sm text-zinc-500">
          Manage search engine optimization for your store
        </p>
      </div>

      {/* Global SEO */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">
            Global Meta Tags
          </h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label
              htmlFor="seo-title"
              className="block text-sm font-medium text-zinc-700"
            >
              Site Title
            </label>
            <input
              type="text"
              id="seo-title"
              defaultValue="Virtualsphere — Enterprise RFID Solutions"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Recommended: 50–60 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="seo-description"
              className="block text-sm font-medium text-zinc-700"
            >
              Meta Description
            </label>
            <textarea
              id="seo-description"
              rows={3}
              defaultValue="Professional RFID products and inventory management solutions for modern enterprises. Tags, readers, antennas, and complete tracking systems."
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 resize-none"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Recommended: 150–160 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="seo-keywords"
              className="block text-sm font-medium text-zinc-700"
            >
              Keywords
            </label>
            <input
              type="text"
              id="seo-keywords"
              defaultValue="RFID, RFID tags, RFID readers, inventory management, asset tracking, supply chain"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
            <p className="mt-1 text-xs text-zinc-400">
              Comma-separated list of target keywords
            </p>
          </div>

          <div>
            <label
              htmlFor="seo-canonical"
              className="block text-sm font-medium text-zinc-700"
            >
              Canonical URL
            </label>
            <input
              type="url"
              id="seo-canonical"
              defaultValue="https://indiarfidshop.com"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
          </div>
        </div>
      </div>

      {/* Open Graph */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">
            Open Graph / Social
          </h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label
              htmlFor="og-title"
              className="block text-sm font-medium text-zinc-700"
            >
              OG Title
            </label>
            <input
              type="text"
              id="og-title"
              defaultValue="Virtualsphere — Enterprise RFID Solutions"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="og-description"
              className="block text-sm font-medium text-zinc-700"
            >
              OG Description
            </label>
            <textarea
              id="og-description"
              rows={2}
              defaultValue="Professional RFID products and inventory management solutions for modern enterprises."
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              OG Image
            </label>
            <div className="mt-1.5 flex items-center gap-4">
              <div className="flex h-20 w-36 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400">
                1200 × 630
              </div>
              <button
                type="button"
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Robots */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">
            Robots & Crawling
          </h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label
              htmlFor="robots-txt"
              className="block text-sm font-medium text-zinc-700"
            >
              robots.txt
            </label>
            <textarea
              id="robots-txt"
              rows={6}
              defaultValue={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: https://indiarfidshop.com/sitemap.xml`}
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-xs text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 resize-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                defaultChecked
                className="h-3.5 w-3.5 rounded border-zinc-300"
              />
              Allow search engine indexing
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                defaultChecked
                className="h-3.5 w-3.5 rounded border-zinc-300"
              />
              Generate XML sitemap automatically
            </label>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
