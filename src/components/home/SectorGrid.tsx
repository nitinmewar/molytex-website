import Image from "next/image";

const sectors = [
  { title: "Hospitals", desc: "Multi-specialty & tertiary care", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V7l8-4 8 4v14" /><path d="M4 21h16M9 21v-4h6v4" /><path d="M12 7v4M10 9h4" /></svg>, image: "/assets/hero-1.png" },
  { title: "Clinics", desc: "Outpatient & day-care settings", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v6a4 4 0 008 0V3M9 13v3a4 4 0 008 0v-1" /><circle cx="17" cy="15" r="2" /></svg>, image: "/assets/hero-2.png" },
  { title: "Diagnostic Centers", desc: "Labs & imaging facilities", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M6 21h12M8 21l-2-3M9 4l3 3-3 3-2-2a1.4 1.4 0 010-2l1-1a1.4 1.4 0 012 0z" /><path d="M11 9l2 2M13 17a6 6 0 005-9" /></svg>, image: "/assets/hero-3.png" },
  { title: "Nursing Homes", desc: "Inpatient & residential care", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M3 8v11M3 13h18v6M21 19v-4a3 3 0 00-3-3H9v-1" /><circle cx="6.5" cy="10.5" r="1.6" /></svg>, image: "/assets/hero-1.png" },
  { title: "Rehabilitation Centers", desc: "Recovery & mobility support", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l2-5 3 10 2-7 2 4h4" /></svg>, image: "/assets/hero-2.png" },
  { title: "Healthcare Institutions", desc: "Public & private bodies", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V5a2 2 0 012-2h7a2 2 0 012 2v16M15 21V9h3a2 2 0 012 2v10M3 21h18" /><path d="M8 7h3M8 11h3M8 15h3" /></svg>, image: "/assets/hero-3.png" },
];

export function SectorGrid() {
  return (
    <section className="section bg-grey">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Healthcare Sectors We Serve</span>
          <h2 className="h2">Supporting care across the healthcare system</h2>
          <p className="lead measure">From large hospitals to specialised centres, we support the institutions that deliver everyday patient care.</p>
        </div>
        <div className="sector-grid mt-40">
          {sectors.map((s) => (
            <div className="sector" key={s.title}>
              <Image src={s.image} alt={s.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 920px) 50vw, 33vw" />
              <div className="sector-label">
                <span className="dot">{s.icon}</span>
                <div className="txt">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
