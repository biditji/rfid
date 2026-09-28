import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Virtualsphere Technologies Pvt Ltd.",
};

// The company's own copy, unchanged.
const values = [
  {
    title: "Professional Work",
    description:
      "We deliver a professional work with agreed timelines. We are also keen in making the product secure and easily accessible at the same time for our clients.",
  },
  {
    title: "Top-Notch Support",
    description:
      "We provide a great support for our clients, until our client is completely satisfied with our product. No worries as we even extend our support in case of uncertain errors.",
  },
  {
    title: "Best Price",
    description:
      "As we are team of young bloods, we focus on creating something amazing with the best competitive price for our clients without compromising the product quality.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border">
        <PageContainer className="grid grid-cols-1 gap-10 pt-10 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-14 lg:pb-24">
          <div className="lg:col-span-5">
            <Eyebrow>About us</Eyebrow>
            <h1 className="mt-5 text-h1 text-balance">Virtualsphere Technologies Pvt Ltd</h1>
          </div>
          <div className="space-y-6 text-lead text-pretty text-muted-foreground lg:col-span-7 lg:pt-10">
            <p>
              <strong className="font-semibold text-foreground">Virtualsphere Technologies Pvt Ltd</strong> Provide Wide
              ranges of Rfid Product. We as a Information Technologies mainly provide services in RFID Implementation,
              Software Development as well as Digital Media Service.
            </p>
            <p>
              We are an Elite Enterprise Solution &amp; IT service provider. With our effective digital solutions and
              immense expertise in cutting-edge technologies, we are helping companies around the world to transform
              their business. We offer a variety of services in the area of Rfid, software and web development. We have
              provided 24+ software solution all over India.
            </p>
          </div>
        </PageContainer>
      </section>

      <section aria-label="Vision and mission" className="border-b border-border bg-surface">
        <PageContainer className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:py-24">
          <div>
            <Eyebrow>Our vision</Eyebrow>
            <p className="mt-5 text-h3 text-pretty">Make Technology an asset for Our Clients &amp; not a Problem!</p>
            <p className="mt-4 text-body text-pretty text-muted-foreground">
              Our vision is to be one of the Most Innovative IT Company in the industry who is known for Translating
              Technologies into Agile Solutions which add Value to Our Clients.
            </p>
          </div>
          <div className="md:border-l md:border-border md:pl-12">
            <Eyebrow>Our mission</Eyebrow>
            <p className="mt-5 text-h3 text-pretty">
              For us, it matters that we drive technology as an equalizing force, as an enabler for everyone around the
              world.
            </p>
            <p className="mt-4 text-body text-pretty text-muted-foreground">
              To provide excellent service for the growth of our clients and partners across the globe. We bring
              solutions to make life easier for our clients.
            </p>
          </div>
        </PageContainer>
      </section>

      <section aria-labelledby="values-title">
        <PageContainer className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-4">
            <Eyebrow>Why choose us</Eyebrow>
            <h2 id="values-title" className="mt-5 text-h2">
              How we work
            </h2>
            <ButtonLink href="/contact" variant="outline" className="mt-8" endIcon={<ArrowRight />}>
              Talk to the team
            </ButtonLink>
          </div>
          <ol className="border-t border-border lg:col-span-8">
            {values.map((value, i) => (
              <li key={value.title} className="grid grid-cols-1 gap-2 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="text-meta text-muted-foreground tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-h3">{value.title}</h3>
                  <p className="mt-2 max-w-xl text-body text-pretty text-muted-foreground">{value.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </PageContainer>
      </section>
    </>
  );
}
