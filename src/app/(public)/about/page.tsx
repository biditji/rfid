import type { Metadata } from "next";
import {
  Users,
  Target,
  Globe,
  Award,
  Lightbulb,
  Handshake,
} from "lucide-react";
import { FadeIn } from "@/components/shared/fade-in";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about RFIDHub — our mission, team, and commitment to delivering enterprise-grade RFID solutions worldwide.",
};

const stats = [
  { value: "2019", label: "Founded" },
  { value: "500+", label: "Enterprise Clients" },
  { value: "12K+", label: "Products Shipped" },
  { value: "28", label: "Countries Served" },
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description:
      "We obsess over accuracy — in our products, our recommendations, and our support. Every deployment is engineered to perform.",
  },
  {
    icon: Lightbulb,
    title: "Expertise",
    description:
      "Our team has 40+ combined years in RFID, IoT, and supply chain technology. We don't just sell hardware — we understand the problem.",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "We work with you long after the sale. From initial scoping to production deployment, we're in it for the long term.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "Founded in Austin",
    description:
      "Started as a two-person RFID consultancy helping local retailers deploy item-level tagging.",
  },
  {
    year: "2020",
    title: "Launched E-Commerce",
    description:
      "Opened our online store, making enterprise RFID hardware accessible to small and mid-size businesses.",
  },
  {
    year: "2021",
    title: "European Expansion",
    description:
      "Opened a warehouse in Rotterdam, cutting delivery times for EU customers to 2–3 business days.",
  },
  {
    year: "2023",
    title: "500 Enterprise Clients",
    description:
      "Reached a milestone of 500 active enterprise accounts across retail, logistics, and healthcare.",
  },
  {
    year: "2024",
    title: "Asia-Pacific Launch",
    description:
      "Opened Singapore fulfillment center and partnered with regional distributors across Southeast Asia.",
  },
  {
    year: "2025",
    title: "Admin Platform Launch",
    description:
      "Launched the RFIDHub management platform, giving customers real-time inventory and order visibility.",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former supply chain director at Zebra Technologies. 15 years in RFID and IoT.",
  },
  {
    name: "Michael Torres",
    role: "CTO & Co-Founder",
    bio: "Built large-scale IoT platforms at Impinj and Samsara. Systems architect.",
  },
  {
    name: "Emma Lindström",
    role: "VP of Sales",
    bio: "Led enterprise sales at HID Global. Specializes in B2B hardware distribution.",
  },
  {
    name: "David Okafor",
    role: "Head of Engineering",
    bio: "Full-stack engineer with a background in warehouse automation systems.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <FadeIn>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                  We make RFID
                  <br />
                  <span className="text-zinc-400">actually work.</span>
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-zinc-500">
                  RFIDHub was founded on a simple observation: buying RFID
                  hardware shouldn&apos;t require a procurement department, three
                  conference calls, and a six-week lead time.
                </p>
                <p className="mt-4 leading-relaxed text-zinc-500">
                  We built RFIDHub to be the opposite — a focused,
                  knowledgeable supplier where you can find the right product,
                  get real technical guidance, and have it shipped the same day.
                  No fluff, no middlemen, no unnecessary complexity.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-10">
                <div className="flex h-full items-center justify-center py-10">
                  <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-zinc-300" />
                    <p className="mt-3 text-sm text-zinc-400">Team photo</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-zinc-200 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <FadeIn key={stat.label} delay={idx * 0.08}>
                <div className="px-6 py-10 text-center">
                  <div className="text-3xl font-bold text-zinc-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-zinc-500">
                    {stat.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              What drives us
            </h2>
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((value, idx) => (
              <FadeIn key={value.title} delay={idx * 0.08}>
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100">
                    <value.icon className="h-5 w-5 text-zinc-700" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-zinc-200 bg-zinc-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Our team
            </h2>
            <p className="mt-2 text-zinc-500">
              Engineers and operators who&apos;ve deployed RFID at scale.
            </p>
          </FadeIn>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person, idx) => (
              <FadeIn key={person.name} delay={idx * 0.06}>
                <div className="rounded-xl border border-zinc-200 bg-white p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-lg font-semibold text-zinc-500">
                    {person.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-zinc-900">
                    {person.name}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500">
                    {person.role}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                    {person.bio}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Our journey
            </h2>
          </FadeIn>

          <div className="mt-10 space-y-0">
            {timeline.map((item, idx) => (
              <FadeIn key={item.year} delay={idx * 0.05}>
                <div className="flex gap-6 border-l-2 border-zinc-200 py-6 pl-8 last:border-l-emerald-300">
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-200 bg-white">
                      <div className="h-2 w-2 rounded-full bg-zinc-400" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900">
                      {item.year}
                    </span>
                    <h3 className="mt-1 text-sm font-semibold text-zinc-800">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
