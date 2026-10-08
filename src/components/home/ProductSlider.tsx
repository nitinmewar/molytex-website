"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Slide = {
  tag: string;
  index: string;
  title: string;
  desc1: string;
  desc2: string;
  features: string[];
};

const slides: Slide[] = [
  {
    tag: "01 — Surgical",
    index: "Category 01",
    title: "Surgical Consumables",
    desc1: "We provide a reliable range of surgical consumables designed for safety, precision, and consistent performance in medical environments.",
    desc2: "Our products support healthcare professionals in delivering effective and dependable patient care.",
    features: ["Designed for safety & precision", "Consistent clinical performance"],
  },
  {
    tag: "02 — Orthopedic",
    index: "Category 02",
    title: "Orthopedic & Rehabilitation Aids",
    desc1: "Molytex offers a variety of orthopedic and rehabilitation products designed to support recovery, mobility, and patient comfort.",
    desc2: "These products assist healthcare providers in improving patient outcomes and rehabilitation support.",
    features: ["Supports recovery & mobility", "Focused on patient comfort"],
  },
  {
    tag: "03 — Disposables",
    index: "Category 03",
    title: "Hospital Disposables",
    desc1: "Our hospital disposables are designed to support infection control and daily medical procedures in healthcare facilities.",
    desc2: "We focus on delivering consistent quality and reliability for clinical environments.",
    features: ["Supports infection control", "Reliable for daily procedures"],
  },
  {
    tag: "04 — Infection Control",
    index: "Category 04",
    title: "Infection Control Solutions",
    desc1: "Maintaining hygiene and infection prevention is critical in healthcare settings. Molytex supports healthcare institutions with dependable infection control products.",
    desc2: "Our solutions help promote safer healthcare environments.",
    features: ["Hygiene & prevention focused", "Promotes safer environments"],
  },
  {
    tag: "05 — Supply Network",
    index: "Category 05",
    title: "Healthcare Supply Network",
    desc1: "Molytex works with healthcare institutions and partners to ensure dependable product availability and supply.",
    desc2: "Our growing distribution network supports healthcare providers across India.",
    features: ["Dependable product availability", "Growing pan-India network"],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ProductSlider() {
  const [active, setActive] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const touchStartX = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback((index: number) => {
    setActive(((index % slides.length) + slides.length) % slides.length);
  }, []);

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    },
    [prev, next],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? active + 1 : active - 1);
  };

  const dur = prefersReduced ? "0ms" : "600ms";

  return (
    <section className="prod-sec">
      <div className="prod-panel">
        <div className="prod-inner">
          <span className="eyebrow on-dark">Product Categories</span>
          <h2 className="h2 prod-title">
            A focused portfolio for<span className="prod-rule" aria-hidden="true" />
            <br />
            clinical environments
          </h2>
          <div
            className="prod-slider"
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label="Product categories"
            onKeyDown={onKeyDown}
          >
            <div className="prod-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <div
                className="prod-track"
                style={{
                  "--i": active,
                  "--n": slides.length,
                  transition: `transform ${dur} var(--ease)`,
                } as React.CSSProperties}
              >
                {slides.map((slide, i) => (
                  <article className="prod-card" key={slide.index}>
                    <div className="prod-cat">
                      <svg viewBox="0 0 190 190" aria-hidden="true">
                        <defs>
                          <mask id={`pm-a-${i}`}>
                            <rect x="-10" y="-10" width="210" height="210" fill="#fff" />
                            <circle cx="95" cy="66" r="77" fill="#000" />
                            <circle cx="128" cy="128" r="70" fill="#000" />
                          </mask>
                          <mask id={`pm-b-${i}`}>
                            <rect x="-10" y="-10" width="210" height="210" fill="#fff" />
                            <circle cx="95" cy="66" r="77" fill="#000" />
                          </mask>
                        </defs>
                        <g fill="currentColor" stroke="none">
                          <circle cx="63" cy="126" r="63" mask={`url(#pm-a-${i})`} />
                          <circle cx="128" cy="128" r="61" mask={`url(#pm-b-${i})`} />
                          <circle cx="95" cy="66" r="66" />
                        </g>
                      </svg>
                      {slide.index}
                    </div>
                    <h3>{slide.title}</h3>
                    <p>{slide.desc1}</p>
                    <p>{slide.desc2}</p>
                    <ul className="prod-feat">
                      {slide.features.map((f) => (
                        <li key={f}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
            <div className="prod-nav">
              <div className="prod-dots">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`prod-dot${i === active ? " active" : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="prod-arrows">
                <button className="prod-arrow" onClick={prev} aria-label="Previous">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 7l-5 5 5 5" /></svg>
                </button>
                <button className="prod-arrow" onClick={next} aria-label="Next">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 7l5 5-5 5" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
