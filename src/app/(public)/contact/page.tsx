import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Virtualsphere — request a quote, ask a technical question, or discuss your RFID deployment needs.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <FadeIn>
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Get in touch
          </h1>
          <p className="mt-2 text-zinc-500">
            Have a question about our products, need a custom quote, or want to
            discuss a deployment? We&apos;re here to help.
          </p>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <FadeIn>
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-company"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  id="contact-company"
                  name="company"
                  className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Subject
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  className="mt-1.5 block h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100"
                >
                  <option value="">Select a subject</option>
                  <option value="quote">Request a Quote</option>
                  <option value="technical">Technical Question</option>
                  <option value="order">Order Inquiry</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-zinc-700"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                className="mt-1.5 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-100 resize-none"
                placeholder="Tell us about your project or requirements..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Send Message
            </button>
          </form>
        </FadeIn>

        {/* Contact info sidebar */}
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-900 leading-relaxed">
                India rfid shop - RFID Readers, Tags, Wristbands Manufacturer & Supplier
              </h3>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="text-sm text-zinc-600">
                    {SITE_CONFIG.address.street}
                    <br />
                    {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}{" "}
                    {SITE_CONFIG.address.zip}
                    <br />
                    {SITE_CONFIG.address.country}
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-900">
                Support Hours
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="text-sm text-zinc-600">
                    <p className="font-medium">Monday – Friday</p>
                    <p className="text-zinc-500">8:00 AM – 6:00 PM CT</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  <div className="text-sm text-zinc-600">
                    <p className="font-medium">Saturday</p>
                    <p className="text-zinc-500">9:00 AM – 1:00 PM CT</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
              <h3 className="text-sm font-semibold text-zinc-900">
                Enterprise Accounts
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Need volume pricing, custom configurations, or dedicated
                support? Our enterprise team can help.
              </p>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Contact Enterprise Sales →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <iframe
            src="https://maps.google.com/maps?q=28.6214786,77.0764395&hl=en&z=16&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </FadeIn>
    </div>
  );
}
