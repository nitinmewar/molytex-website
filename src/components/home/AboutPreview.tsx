import Image from "next/image";
import Link from "next/link";

export function AboutPreview() {
  return (
    <section className="about-sec">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-media">
            <div className="frame">
              <Image src="/assets/about-team.webp" alt="Molytex Healthcare team packaging medical products" fill style={{ objectFit: "cover" }} sizes="(max-width: 900px) 100vw, 50vw" priority />
            </div>
            <div className="badge">
              <div className="n">100<span className="grn">%</span></div>
              <div className="t">Commitment to quality in every product we deliver</div>
            </div>
          </div>
          <div className="about-copy">
            <span className="eyebrow">About Molytex Healthcare</span>
            <h2 className="h2 mt-16">Healthcare-focused, built on reliability and trust</h2>
            <p className="lead mt-16">Molytex Healthcare is a healthcare-focused company dedicated to delivering reliable medical and surgical products that support modern patient care.</p>
            <p className="body-lg mt-16">Our goal is to provide high-quality healthcare solutions that hospitals, clinics, and healthcare professionals can trust. By focusing on quality, compliance, and dependable supply, we aim to contribute to safer healthcare environments and improved access to essential medical products.</p>
            <div className="about-points">
              <ul className="check-list">
                <li>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>{" "}
                  Quality &amp; compliance focus
                </li>
                <li>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>{" "}
                  Dependable supply chain
                </li>
              </ul>
              <ul className="check-list">
                <li>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>{" "}
                  Institutional partnerships
                </li>
                <li>
                  <span className="ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>{" "}
                  Pan-India distribution
                </li>
              </ul>
            </div>
            <div className="row mt-32">
              <Link className="btn btn-primary" href="/about">
                More About Us{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
              <Link className="textlink" href="/certifications">
                Our quality commitment{" "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
