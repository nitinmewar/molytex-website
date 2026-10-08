import Image from "next/image";

// pdf is omitted until a public copy exists; the card then shows no link.
const certs: { tag: string; title: string; desc: string; logo: string; pdf?: string; w: number; h: number; dx?: number }[] = [
  { tag: "Quality Management", title: "ISO 9001", desc: "Ensures consistent quality standards", logo: "/assets/cert-iso9001.jpg", pdf: "/certificates/iso-9001.pdf", w: 255, h: 170, dx: -7 },
  { tag: "Medical Devices", title: "ISO 13485", desc: "Certified medical device processes", logo: "/assets/cert-iso13485.webp", pdf: "/certificates/iso-13485.pdf", w: 157, h: 170 },
  { tag: "Regulatory Approval", title: "CDSCO Registration Certificate", desc: "Approved for regulated products", logo: "/assets/cert-cdsco.jpg", w: 240, h: 170 },
  { tag: "Startup Recognition", title: "DIPP Startup Certificate", desc: "Recognized under Startup India", logo: "/assets/cert-dpiit.webp", pdf: "/certificates/dpiit-startup.pdf", w: 227, h: 76 },
];

export function CertPreview() {
  return (
    <section className="cert-sec bg-grey">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow">Quality &amp; Compliance</span>
          <h2 className="h2">Quality you can stand behind</h2>
          <p className="lead">A trust-building foundation of quality systems, standards, and regulatory alignment — with room to add certificates as they are issued.</p>
        </div>
        <div className="cert-grid">
          {certs.map((c) => (
            <article className="card card-hover cert" key={c.title}>
              <div className="cert-logo">
                <Image src={c.logo} alt={`${c.title} logo`} width={c.w} height={c.h} style={{ width: c.w, height: c.h, translate: `${c.dx ?? 0}px 0` }} />
              </div>
              <span className="tag green">{c.tag}</span>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
              {c.pdf && (
                <a className="textlink" href={c.pdf} target="_blank" rel="noopener">
                  View certificate{" "}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
