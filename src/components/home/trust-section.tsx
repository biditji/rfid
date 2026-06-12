import { FadeIn } from "@/components/shared/fade-in";

const logos = [
  { name: "BHOOMIKA", url: "/bhoomika.png", width: "w-32" },
  { name: "DHL", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/1280px-DHL_Logo.svg.png", width: "w-24" },
  { name: "GD GOENKA SCHOOL", url: "/gdgoenka.png", width: "w-32" },
  { name: "COCA COLA", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/1280px-Coca-Cola_logo.svg.png", width: "w-32" },
  { name: "SONY", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1280px-Sony_logo.svg.png", width: "w-24" },
];

export function TrustSection() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
            Trusted by teams at
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className={`${logo.width} flex items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0`}
              >
                <img src={logo.url} alt={logo.name} className="max-h-12 w-full object-contain" />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
