import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/section-header";
import { PageContainer } from "@/components/shared/page-container";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us – RFID Manufacturer in India",
  description: "Learn about Virtualsphere Technologies Pvt Ltd.",
  path: "/about",
});

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
              <strong className="font-semibold text-foreground">Virtualsphere Technologies</strong> is an RFID
              technology and manufacturing company delivering end-to-end identification, tracking, security, and
              automation solutions. We design and manufacture RFID Readers, Antennas, Tags, and integrated RFID systems
              for diverse industry applications.
            </p>
            <p>
              With in-house R&amp;D, RF simulation, product design, prototyping, fabrication, and testing capabilities,
              we develop customized solutions with flexible wired and wireless communication interfaces, enabling
              reliable, scalable, and application-specific RFID deployments from concept to implementation.
            </p>
          </div>
        </PageContainer>
      </section>

      <section aria-label="Vision and mission" className="border-b border-border bg-surface">
        <PageContainer className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:py-24">
          <div>
            <Eyebrow>Our vision</Eyebrow>
            <p className="mt-5 text-lead text-pretty">
              To become a globally recognized RFID technology leader, pioneering indigenous innovation, advanced
              engineering, and integrated manufacturing from India, while delivering intelligent, scalable, and globally
              competitive identification, tracking, security, and automation solutions across industries.
            </p>
          </div>
          <div className="md:border-l md:border-border md:pl-12">
            <Eyebrow>Our mission</Eyebrow>
            <p className="mt-5 text-lead text-pretty">
              To establish India as a global hub for indigenous RFID innovation through advanced R&amp;D, engineering,
              vertical manufacturing, and development of globally competitive Readers, Tags, Modules, Antennas, and
              intelligent identification solutions.
            </p>
          </div>
        </PageContainer>
      </section>

      <section aria-label="Our team" className="border-b border-border">
        <PageContainer className="py-16 lg:py-24">
          <Eyebrow>Our team</Eyebrow>
          <div className="mt-5 max-w-3xl space-y-4 text-lead text-pretty">
            <p>
              Our team combines experienced engineers and MBA professionals focused on engineering excellence,
              market-driven innovation, reliable product support, customer-centric solutions, and uncompromising
              quality.
            </p>
            <p className="text-muted-foreground">
              Delivering efficient products, faster issue resolution, and a trusted brand experience built around
              customer success.
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
