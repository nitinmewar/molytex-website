const partners = [
  {
    name: "Defence Healthcare",
    detail: "Command Hospitals • Base Hospitals • AFMSD",
    icon: <><path d="M4 21V7l8-4 8 4v14" /><path d="M4 21h16M9 21v-4h6v4" /><path d="M12 7v4M10 9h4" /></>,
  },
  {
    name: "AIIMS",
    detail: "AIIMS Rae Bareli • AIIMS Gorakhpur • AIIMS Deoghar",
    icon: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  },
  {
    name: "Diagnostics",
    detail: "Diagnostic Laboratories • Pathology Labs",
    icon: <><path d="M6 21h12M8 21l-2-3M9 4l3 3-3 3-2-2a1.4 1.4 0 010-2l1-1a1.4 1.4 0 012 0z" /><path d="M11 9l2 2M13 17a6 6 0 005-9" /></>,
  },
  {
    name: "Medical Colleges",
    detail: "BRD Medical College • Government Institutions",
    icon: <><path d="M5 3v6a4 4 0 008 0V3M9 13v3a4 4 0 008 0v-1" /><circle cx="17" cy="15" r="2" /></>,
  },
];

export function PartnerMarquee() {
  return (
    <section className="partners-sec">
      <div className="wrap">
        <p className="partners-label">Working alongside healthcare institutions &amp; partners</p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {/* Two copies so the -50% loop is seamless. */}
          {[0, 1].map((copy) =>
            partners.map((p) => (
              <div className="partner-logo" key={`${copy}-${p.name}`} aria-hidden={copy === 1 || undefined}>
                <span className="mk">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                </span>
                <span>{p.name}<small>{p.detail}</small></span>
              </div>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
