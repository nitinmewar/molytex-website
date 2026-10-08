import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button, ArrowIcon, buttonClass } from "@/components/ui/Button";
import { ContactButton } from "@/components/contact/ContactButton";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore healthcare procurement guides, infection control insights, safety standards, and supply chain best practices from Molytex Healthcare.",
};

/* ── Data ──────────────────────────────────── */

const ARTICLES = [
  {
    category: "Procurement Best Practices",
    title: "How to Build a Resilient Hospital Procurement Strategy",
    description:
      "Key principles for structuring vendor relationships, maintaining buffer stock, and reducing supply disruptions in acute-care settings.",
    slug: "#",
  },
  {
    category: "Infection Control",
    title: "Single-Use vs. Reusable: Choosing the Right Consumables",
    description:
      "A balanced look at cost, safety, and environmental factors when selecting disposable and reusable medical supplies.",
    slug: "#",
  },
  {
    category: "Safety Standards",
    title: "Understanding BIS & ISO Markings on Surgical Products",
    description:
      "A quick guide to the certification labels you see on packaging — what they mean and why they matter for patient safety.",
    slug: "#",
  },
  {
    category: "Supply Chain",
    title: "Cold-Chain & Storage Best Practices for Medical Devices",
    description:
      "Temperature, humidity, and shelf-life considerations that every hospital storeroom manager should have on a checklist.",
    slug: "#",
  },
  {
    category: "Procurement Best Practices",
    title: "Evaluating New Vendors: A Checklist for Healthcare Buyers",
    description:
      "The 12-point framework we recommend when onboarding a new medical supplies vendor — from documentation to trial orders.",
    slug: "#",
  },
  {
    category: "Infection Control",
    title: "PPE Selection Guide for Multi-Speciality Hospitals",
    description:
      "Matching PPE types to department risk levels — from general wards to ICUs and operating theatres.",
    slug: "#",
  },
];

const DOWNLOADS = [
  {
    title: "Product Catalogue 2025",
    format: "PDF",
    size: "4.2 MB",
  },
  {
    title: "Quality & Compliance Overview",
    format: "PDF",
    size: "1.8 MB",
  },
  {
    title: "Hospital Procurement Checklist",
    format: "PDF",
    size: "620 KB",
  },
];

/* ── Helpers ───────────────────────────────── */

function categoryVariant(cat: string): "blue" | "green" {
  return cat === "Infection Control" || cat === "Safety Standards"
    ? "green"
    : "blue";
}

/* ── Page ──────────────────────────────────── */

export default function ResourcesPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────── */}
      <section
        className="relative pb-[clamp(48px,6vw,80px)] pt-[clamp(100px,14vw,160px)]"
        style={{
          background:
            "radial-gradient(1100px 500px at 88% -10%, rgba(106,191,31,.18), transparent 60%), radial-gradient(900px 600px at 0% 120%, rgba(0,97,204,.55), transparent 60%), linear-gradient(180deg, var(--color-blue-800), var(--color-blue-900))",
        }}
      >
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
          <nav aria-label="Breadcrumb" className="mb-6 text-[0.82rem] text-white/55">
            <ol className="flex items-center gap-1.5">
              <li>
                <Link href="/" className="transition-colors hover:text-white/80">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">/</li>
              <li className="text-white/90">Resources</li>
            </ol>
          </nav>

          <ScrollReveal>
            <Eyebrow dark>Knowledge Center</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-extrabold text-white">
              Resources &amp; Knowledge Center
            </h1>
            <p className="mt-4 max-w-[58ch] text-[clamp(1.075rem,1.5vw,1.3rem)] leading-relaxed text-white/70">
              Practical guides, procurement insights, and reference material to help healthcare teams make informed supply decisions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Articles Grid ────────────────────── */}
      <section className="py-[clamp(64px,8vw,120px)]">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
          <ScrollReveal>
            <div className="text-center">
              <Eyebrow center>Articles &amp; Guides</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3vw,2.55rem)] font-bold">
                Latest from our knowledge base
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article, i) => (
              <ScrollReveal key={article.title} delay={i}>
                <Card hoverable className="flex h-full flex-col">
                  {/* Thumbnail placeholder */}
                  <div className="grid h-[180px] place-items-center rounded-t-[var(--radius-lg)] border-b border-line bg-bg">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-tint text-blue">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                        <path d="M8 7h8M8 11h6" />
                      </svg>
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <Tag variant={categoryVariant(article.category)} className="mb-3 self-start">
                      {article.category}
                    </Tag>
                    <h3 className="font-display text-[1.05rem] font-bold leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-muted">
                      {article.description}
                    </p>
                    <Link
                      href={article.slug}
                      className="mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-bold text-blue transition-colors hover:text-blue-700"
                    >
                      Read More
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Downloads ─────────────────────────── */}
      <section className="bg-bg py-[clamp(64px,8vw,120px)]">
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)]">
          <ScrollReveal>
            <div className="text-center">
              <Eyebrow center>Downloads</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.7rem,3vw,2.55rem)] font-bold">
                Downloadable resources
              </h2>
              <p className="mt-3 mx-auto max-w-[48ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-ink-2">
                Reference documents available for healthcare procurement and quality teams.
              </p>
            </div>
          </ScrollReveal>

          <div className="mx-auto mt-10 grid max-w-[800px] gap-4">
            {DOWNLOADS.map((dl, i) => (
              <ScrollReveal key={dl.title} delay={i}>
                <div className="flex items-center gap-5 rounded-[var(--radius-lg)] border border-line bg-white px-6 py-5 shadow-xs transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
                  {/* PDF icon */}
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-red-50 text-red-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </span>

                  <div className="flex-1">
                    <p className="font-display text-[0.98rem] font-bold">{dl.title}</p>
                    <p className="mt-0.5 text-[0.82rem] text-muted">
                      {dl.format} &middot; {dl.size}
                    </p>
                  </div>

                  <span className="text-[0.85rem] font-bold text-blue">
                    Coming Soon
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ──────────────────────────── */}
      <section
        className="py-[clamp(48px,6vw,80px)]"
        style={{
          background:
            "radial-gradient(900px 480px at 85% -20%, rgba(106,191,31,.16), transparent 60%), linear-gradient(120deg, var(--color-blue-800), var(--color-blue-900))",
        }}
      >
        <div className="mx-auto max-w-[var(--maxw)] px-[var(--gutter)] text-center">
          <ScrollReveal>
            <h2 className="mx-auto font-display text-[clamp(1.7rem,3.5vw,2.6rem)] font-extrabold text-white">
              Need Help Choosing the Right Products?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={1}>
            <p className="mx-auto mt-3 max-w-[50ch] text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-white/70">
              Our team can help you find the right medical and surgical supplies for your institution&apos;s requirements.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={2}>
            <div className="mt-7 flex flex-wrap justify-center gap-3.5">
              <ContactButton className={buttonClass("green", "lg")}>
                Get In Touch <ArrowIcon />
              </ContactButton>
              <Button href="/products" variant="outline-white" size="lg">
                Explore Products
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
