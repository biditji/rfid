"use client";

import { Save, Globe, Palette, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Website Settings</h1>
        <p className="text-sm text-zinc-500">
          General configuration for your store
        </p>
      </div>

      {/* General */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">General</h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label
              htmlFor="site-name"
              className="block text-sm font-medium text-zinc-700"
            >
              Site Name
            </label>
            <input
              type="text"
              id="site-name"
              defaultValue="RFIDHub"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="site-tagline"
              className="block text-sm font-medium text-zinc-700"
            >
              Tagline
            </label>
            <input
              type="text"
              id="site-tagline"
              defaultValue="Enterprise RFID Solutions"
              className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Logo
              </label>
              <div className="mt-1.5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400">
                  Logo
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
                >
                  Upload
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Favicon
              </label>
              <div className="mt-1.5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400">
                  ICO
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Mail className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">
            Contact Information
          </h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="settings-email"
                className="block text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <input
                type="email"
                id="settings-email"
                defaultValue="hello@rfidhub.com"
                className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              />
            </div>
            <div>
              <label
                htmlFor="settings-phone"
                className="block text-sm font-medium text-zinc-700"
              >
                Phone
              </label>
              <input
                type="tel"
                id="settings-phone"
                defaultValue="+1 (555) 824-7100"
                className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-address"
              className="block text-sm font-medium text-zinc-700"
            >
              Address
            </label>
            <textarea
              id="settings-address"
              rows={2}
              defaultValue="2100 Innovation Drive, Suite 400&#10;Austin, TX 78758"
              className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-3">
              Social Links
            </label>
            <div className="space-y-3">
              {[
                { label: "Twitter / X", value: "https://twitter.com/rfidhub" },
                {
                  label: "LinkedIn",
                  value: "https://linkedin.com/company/rfidhub",
                },
                { label: "GitHub", value: "https://github.com/rfidhub" },
              ].map((social) => (
                <div key={social.label} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-zinc-500">
                    {social.label}
                  </span>
                  <input
                    type="url"
                    defaultValue={social.value}
                    className="h-8 flex-1 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-300 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Palette className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">Theme</h2>
        </div>

        <div className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-3">
              Accent Color
            </label>
            <div className="flex gap-2">
              {[
                { color: "#0f172a", label: "Slate" },
                { color: "#2563eb", label: "Blue" },
                { color: "#059669", label: "Emerald" },
                { color: "#7c3aed", label: "Violet" },
                { color: "#dc2626", label: "Red" },
              ].map((c) => (
                <button
                  key={c.label}
                  type="button"
                  className="flex flex-col items-center gap-1"
                  title={c.label}
                >
                  <div
                    className="h-8 w-8 rounded-full border-2 border-zinc-200 hover:border-zinc-400 transition-colors"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-[10px] text-zinc-400">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-4 w-4 text-zinc-500" />
          <h2 className="text-sm font-semibold text-zinc-900">Maintenance</h2>
        </div>

        <div className="max-w-2xl">
          <label className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
            <div>
              <p className="text-sm font-medium text-zinc-900">
                Maintenance Mode
              </p>
              <p className="text-xs text-zinc-500">
                Temporarily disable the public website for maintenance.
                Admin panel remains accessible.
              </p>
            </div>
            <div className="relative">
              <input type="checkbox" className="peer sr-only" />
              <div className="h-6 w-11 rounded-full bg-zinc-200 peer-checked:bg-slate-900 transition-colors" />
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
            </div>
          </label>
        </div>
      </div>

      {/* Save */}
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
