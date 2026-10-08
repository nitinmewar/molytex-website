import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../home.css";
import "../pages.css";
import { AboutPreview } from "@/components/home/AboutPreview";
import { CertPreview } from "@/components/home/CertPreview";
import { ContactButton } from "@/components/contact/ContactButton";
import { ArrowIcon } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Molytex Healthcare — a healthcare-focused company committed to delivering reliable medical and surgical products across India.",
};

// Line breaks follow Figma; no single max-width reproduces all four.
const VALUES = [
  { icon: "value-integrity", title: "Integrity", text: "Operating with transparency\nand accountability" },
  { icon: "value-quality", title: "Quality", text: "Commitment to excellence in\nevery product" },
  { icon: "value-partnership", title: "Partnership", text: "Building lasting healthcare\nrelationships" },
  { icon: "value-innovation", title: "Innovation", text: "Continuously improving\nour processes" },
];

export default function AboutPage() {
  return (
    <main>
      <section className="phero phero-about">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">About Us</li>
            </ol>
          </nav>
          <h1>About Molytex Healthcare</h1>
          <p className="phero-lead">
            A healthcare-focused company committed to delivering reliable medical and surgical products across India.
          </p>
        </div>
      </section>

      <AboutPreview />

      <section className="mv-sec bg-grey">
        <div className="wrap">
          <div className="ph-head">
            <span className="eyebrow">Our Purpose</span>
            <h2>Mission &amp; Vision</h2>
          </div>
          <div className="mv-grid">
            <article className="pcard mv-card">
              <span className="mv-ic">
                <Image src="/assets/icons/icon-mission.svg" alt="" width={24} height={24} />
              </span>
              <h3>Our Mission</h3>
              <p>To deliver reliable, quality-driven healthcare products that support institutions in providing better patient care.</p>
            </article>
            <article className="pcard mv-card">
              <span className="mv-ic green">
                <Image src="/assets/icons/icon-vision.svg" alt="" width={24} height={24} />
              </span>
              <h3>Our Vision</h3>
              <p>To become a trusted healthcare supply partner recognized for quality, dependability, and commitment to modern healthcare.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="values-sec">
        <div className="wrap">
          <div className="ph-head">
            <span className="eyebrow">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="values-grid">
            {VALUES.map((v) => (
              <article className="pcard value-card" key={v.title}>
                <Image src={`/assets/icons/${v.icon}.svg`} alt="" width={40} height={40} />
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CertPreview />

      <section className="pcta pcta-about">
        <div className="wrap">
          <h2>Partner with Molytex Healthcare</h2>
          <p>Looking for a reliable healthcare supply partner? Let&rsquo;s start a conversation.</p>
          <div className="pcta-actions">
            <ContactButton className="btn btn-green btn-fig">
              Get in Touch <ArrowIcon />
            </ContactButton>
          </div>
        </div>
      </section>
    </main>
  );
}
