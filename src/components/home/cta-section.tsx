import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

export function CTASection() {
  return (
    <section className="bg-slate-900 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to modernize your inventory operations?
            </h2>
            <p className="mt-4 text-zinc-400">
              Talk to our team about your requirements. We&apos;ll help you scope
              the right hardware, plan your deployment, and get you up and
              running.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-slate-900 transition-colors hover:bg-zinc-100"
              >
                Talk to Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
