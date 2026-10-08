import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../home.css";
import "../pages.css";
import { CertPreview } from "@/components/home/CertPreview";
import { ContactButton } from "@/components/contact/ContactButton";
import { ArrowIcon } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Certifications & Quality",
  description:
    "Every Molytex Healthcare product is backed by documented quality processes, regulatory alignment, and a culture of continuous improvement.",
};

const PILLARS = [
  {
    icon: "pillar-doc",
    title: "Documentation",
    text: "Comprehensive documentation system covering every process — from procurement and quality checks to dispatch and customer feedback.",
  },
  {
    icon: "pillar-audit",
    title: "Auditing",
    text: "Internal and external audits conducted on a scheduled basis to verify conformance, identify gaps, and drive accountability across teams.",
  },
  {
    icon: "pillar-improve",
    title: "Continuous Improvement",
    text: "Data-driven review cycles that feed back into process refinement — ensuring quality outcomes improve quarter over quarter.",
  },
];

export default function CertificationsPage() {
  return (
    <main>
      <section className="phero phero-certs">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Certifications &amp; Quality</li>
            </ol>
          </nav>
          <span className="eyebrow on-dark">Quality &amp; Compliance</span>
          <h1>Certifications &amp; Quality</h1>
          <p className="phero-lead">
            Every product we supply is backed by documented quality processes, regulatory alignment, and a culture of continuous improvement.
          </p>
        </div>
      </section>

      <section className="commit-sec">
        <div className="wrap">
          <div className="ph-head lg">
            <span className="eyebrow">Our Commitment</span>
            <h2>Quality is not an afterthought</h2>
            <p>
              At Molytex Healthcare, quality assurance is embedded in how we source, inspect, store, and deliver every product. We partner with manufacturers who uphold the highest standards — and verify compliance at every stage of the supply chain.
            </p>
          </div>
        </div>
      </section>

      <CertPreview />

      <section className="pillars-sec">
        <div className="wrap">
          <div className="ph-head lg">
            <span className="eyebrow">Compliance Framework</span>
            <h2>How we maintain standards</h2>
            <p>Three pillars support our quality management approach — ensuring nothing is left to chance.</p>
          </div>
          <div className="pillars-grid">
            {PILLARS.map((p) => (
              <article className="pcard pillar" key={p.title}>
                <span className="pillar-ic">
                  <Image src={`/assets/icons/${p.icon}.svg`} alt="" width={28} height={28} />
                </span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pcta pcta-certs">
        <div className="wrap">
          <h2>Questions About Our Quality Standards?</h2>
          <p>Our team is happy to share documentation, certifications, or answer any compliance questions you may have.</p>
          <div className="pcta-actions">
            <ContactButton className="btn btn-green btn-ink btn-fig-lg">
              Get In Touch <ArrowIcon />
            </ContactButton>
            <Link href="/products" className="btn btn-outline-white btn-fig-lg">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
