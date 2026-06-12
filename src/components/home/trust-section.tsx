import { FadeIn } from "@/components/shared/fade-in";

const logos = [
  { name: "Walmart", width: "w-24" },
  { name: "Amazon", width: "w-20" },
  { name: "DHL", width: "w-16" },
  { name: "FedEx", width: "w-20" },
  { name: "Maersk", width: "w-24" },
  { name: "Target", width: "w-20" },
];

export function TrustSection() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
            Trusted by teams at
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className={`${logo.width} flex items-center justify-center`}
              >
                <span className="text-base font-semibold tracking-tight text-zinc-300">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
