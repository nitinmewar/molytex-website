import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";

export function CommitmentBand() {
  return (
    <section className="commit">
      <Image src="/assets/commitment-team.webp" alt="Molytex team at work in a clean production facility" fill style={{ objectFit: "cover" }} sizes="100vw" />
      <div className="wrap">
        <div className="commit-card">
          <span className="eyebrow on-dark">Our Commitment</span>
          <h2 className="h2 mt-16">Proudly Supporting Modern Healthcare</h2>
          <p>At the core of Molytex Healthcare is a commitment to supporting healthcare providers with reliable medical and surgical products. Our focus is on quality, safety, and consistency in every product we deliver.</p>
          <p>By working closely with healthcare institutions and professionals, we strive to contribute to better patient care and stronger healthcare systems.</p>
          <div className="row mt-32">
            <Link className="btn btn-green" href="/about">
              Our Story{" "}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <ContactButton className="btn btn-outline-white">Partner With Us</ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
}
