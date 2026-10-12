import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "../pages.css";
import { ContactButton } from "@/components/contact/ContactButton";
import { ArrowIcon } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Molytex Healthcare's product portfolio — surgical instruments, masks, gloves, supports and rehabilitation aids, custom procedure packs, and hospital consumables.",
};

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
            <div className="prow-gallery">
              {c.images.map((img) => (
                <div key={img.src} className="prow-media">
                  <Image
                    src={`/assets/products/${img.src}.webp`}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 920px) 100vw, 516px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            <div className="prow-copy">
              <span className="prow-num">{String(i + 1).padStart(2, "0")}</span>
              <h2>{c.name}</h2>
              <p>{c.text}</p>
              {c.note && <p><strong>{c.note}</strong></p>}
              {c.points && (
                <ul className="prow-list">
                  {c.points.map((pt) => (
                    <li key={pt}>
                      <Image src="/assets/icons/check.svg" alt="" width={20} height={20} />
                      {pt}
                    </li>
                  ))}
                </ul>
              )}
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
