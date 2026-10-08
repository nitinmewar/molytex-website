import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../pages.css";
import { ContactButton } from "@/components/contact/ContactButton";
import { ArrowIcon } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Molytex Healthcare's product portfolio — surgical consumables, orthopedic products, rehabilitation aids, hospital disposables, infection control, and medical accessories.",
};

const CATEGORIES = [
  {
    id: "surgical-consumables",
    name: "Surgical Consumables",
    image: "surgical",
    alt: "Molytex cautery tip cleaner scrub sponges and packaging",
    text: "A reliable range of surgical consumables designed for safety, precision, and consistent performance in medical environments.",
    points: ["Sterile and safety-compliant", "Consistent batch quality", "Supporting surgical teams daily"],
  },
  {
    id: "orthopedic-products",
    name: "Orthopedic Products",
    image: "orthopedic",
    alt: "Knee brace, lumbar support, implants and walking boot",
    text: "Orthopedic products designed to support recovery, stability, and mobility for patients across diverse clinical settings.",
    points: ["Supports fracture management", "Aids in patient mobility", "Trusted by orthopedic professionals"],
  },
  {
    id: "rehabilitation-aids",
    name: "Rehabilitation Aids",
    image: "rehab",
    alt: "Wheelchair, crutches, walker and exercise equipment",
    text: "Rehabilitation products designed to support patient recovery, comfort, and improved mobility outcomes.",
    points: ["Supports post-surgical recovery", "Ergonomic and patient-friendly", "Suitable for clinical & home use"],
  },
  {
    id: "hospital-disposables",
    name: "Hospital Disposables",
    image: "disposables",
    alt: "Masks, caps, gloves, syringes and urine bags",
    text: "Essential disposable products for daily hospital operations, infection control, and clinical procedures.",
    points: ["Single-use for hygiene compliance", "Supports daily clinical routines", "Cost-effective for institutions"],
  },
  {
    id: "infection-control",
    name: "Infection Control",
    image: "infection",
    alt: "Molytex 3-ply surgical face mask and box",
    text: "Products that support infection prevention and hygiene maintenance in healthcare environments.",
    points: ["Promotes safer clinical environments", "Aligned to infection control protocols", "Essential for healthcare facilities"],
  },
  {
    id: "medical-accessories",
    name: "Medical Accessories",
    image: "accessories",
    alt: "Blood pressure monitor, thermometer, oximeter and surgical instruments",
    text: "Supporting medical equipment and clinical workflows with reliable accessories and complementary products.",
    points: ["Complements existing medical setups", "Supports clinical efficiency", "Broad utility across departments"],
  },
];

export default function ProductsPage() {
  return (
    <main>
      <section className="phero phero-products">
        <div className="wrap">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Products</li>
            </ol>
          </nav>
          <span className="eyebrow on-dark">Product Portfolio</span>
          <h1>Our Product Portfolio</h1>
          <p className="phero-lead">
            A focused range of medical and surgical products designed to support clinical environments and institutional healthcare.
          </p>
        </div>
      </section>

      <nav className="cat-bar" aria-label="Product categories">
        <div className="cat-bar-inner">
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`}>{c.name}</a>
          ))}
        </div>
      </nav>

      {CATEGORIES.map((c, i) => (
        <section key={c.id} id={c.id} className={`prow${i % 2 ? " grey flip" : ""}`}>
          <div className="wrap prow-grid">
            <div className="prow-media">
              <Image
                src={`/assets/products/${c.image}.webp`}
                alt={c.alt}
                fill
                sizes="(max-width: 920px) 100vw, 516px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="prow-copy">
              <span className="prow-num">{String(i + 1).padStart(2, "0")}</span>
              <h2>{c.name}</h2>
              <p>{c.text}</p>
              <ul className="prow-list">
                {c.points.map((pt) => (
                  <li key={pt}>
                    <Image src="/assets/icons/check.svg" alt="" width={20} height={20} />
                    {pt}
                  </li>
                ))}
              </ul>
              <ContactButton className="btn btn-primary btn-fig">
                Contact Us <ArrowIcon />
              </ContactButton>
            </div>
          </div>
        </section>
      ))}

      <section className="pcta pcta-products">
        <div className="wrap">
          <h2>Need help choosing the right products?</h2>
          <p>Our team is here to help you find the right solutions for your clinical requirements.</p>
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
