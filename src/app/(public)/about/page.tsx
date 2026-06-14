import type { Metadata } from "next";
import {
  Target,
  Globe,
  Briefcase,
  LifeBuoy,
  Tag,
} from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Virtualsphere Technologies Pvt Ltd.",
};

const values = [
  {
    icon: Briefcase,
    title: "Professional Work",
    description: "We deliver a professional work with agreed timelines. We are also keen in making the product secure and easily accessible at the same time for our clients.",
  },
  {
    icon: LifeBuoy,
    title: "Top-Notch Support",
    description: "We provide a great support for our clients, until our client is completely satisfied with our product. No worries as we even extend our support in case of uncertain errors.",
  },
  {
    icon: Tag,
    title: "Best Price",
    description: "As we are team of young bloods, we focus on creating something amazing with the best competitive price for our clients without compromising the product quality.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
                About Us
              </h1>
              <div className="mt-8 space-y-6 text-lg leading-relaxed text-zinc-600 text-left">
                <p>
                  <strong>Virtualsphere Technologies Pvt Ltd</strong> Provide Wide ranges of Rfid Product. We as a Information Technologies mainly provide services in RFID Implementation, Software Development as well as Digital Media Service.
                </p>
                <p>
                  We are an Elite Enterprise Solution & IT service provider. With our effective digital solutions and immense expertise in cutting-edge technologies, we are helping companies around the world to transform their business. We offer a variety of services in the area of Rfid, software and web development. We have provided 24+ software solution all over India.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-zinc-200 bg-white p-10 h-full shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Our Vision</h2>
                <p className="mt-4 leading-relaxed text-zinc-600">
                  Make Technology an asset for Our Clients & not a Problem! Our vision is to be one of the Most Innovative IT Company in the industry who is known for Translating Technologies into Agile Solutions which add Value to Our Clients.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="rounded-2xl border border-zinc-200 bg-white p-10 h-full shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-6">
                  <Globe className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Our Mission</h2>
                <p className="mt-4 leading-relaxed text-zinc-600">
                  For us, it matters that we drive technology as an equalizing force, as an enabler for everyone around the world. To provide excellent service for the growth of our clients and partners across the globe. We bring solutions to make life easier for our clients.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 text-center">
              Why Choose Us
            </h2>
          </FadeIn>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((value, idx) => (
              <FadeIn key={value.title} delay={idx * 0.1}>
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-md transition-shadow h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm border border-zinc-100 mb-6">
                    <value.icon className="h-8 w-8 text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {value.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-zinc-600">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
