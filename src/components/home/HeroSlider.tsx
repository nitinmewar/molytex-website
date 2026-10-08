"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "@/components/contact/ContactButton";

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

// A CTA without href opens the contact popup.
type Cta = { label: string; href?: string };

const slides: { eyebrow: string; heading: string; subtitle: string; support: string; primaryCta: Cta; secondaryCta: Cta; image: string }[] = [
  {
    eyebrow: "Medical & Surgical Supply Partner",
    heading: "Reliable Medical & Surgical Solutions",
    subtitle:
      "Providing high-quality healthcare products trusted by hospitals, clinics, and institutions across India.",
    support:
      "Supporting modern healthcare through dependable supply and procurement partnerships.",
    primaryCta: { label: "Contact Us" },
    secondaryCta: { label: "Explore our Products", href: "/products" },
    image: "/assets/hero-1.webp",
  },
  {
    eyebrow: "Quality & Compliance First",
    heading: "Healthcare Supply Built on Trust",
    subtitle:
      "Products sourced and delivered with a commitment to quality, safety, and consistency — for the institutions that depend on them.",
    support:
      "A compliance-aligned approach across every product category we supply.",
    primaryCta: { label: "Our Quality Commitment", href: "/certifications" },
    secondaryCta: { label: "Explore our Products", href: "/products" },
    image: "/assets/about-team.webp",
  },
  {
    eyebrow: "Pan-India Distribution",
    heading: "Supporting Modern Healthcare Across India",
    subtitle:
      "A growing distribution network and long-term partnerships that keep essential medical products dependably within reach.",
    support:
      "Working alongside hospitals, clinics, and healthcare institutions nationwide.",
    primaryCta: { label: "Partner With Us" },
    secondaryCta: { label: "About Molytex", href: "/about" },
    image: "/assets/contact-team.webp",
  },
];

const DURATION = 6000;

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const n = slides.length;

  /* Navigate */
  const go = useCallback(
    (k: number) => {
      setActive(((k % n) + n) % n);
    },
    [n],
  );

  /* Auto-play helpers */
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    stop();
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % n);
    }, DURATION);
  }, [n, stop]);

  const restart = useCallback(() => {
    stop();
    start();
  }, [stop, start]);

  /* Mount: start auto-play */
  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  /* Visibility change */
  useEffect(() => {
    const handler = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [start, stop]);

  /* Touch / swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 44) {
      go(active + (dx < 0 ? 1 : -1));
      restart();
    }
  };

  return (
    <section className="hero">
      <div
        className="heroB hero-slider"
        ref={sliderRef}
        aria-roledescription="carousel"
        aria-label="Molytex hero"
        onMouseEnter={stop}
        onMouseLeave={start}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* crossfading background images */}
        <div className="hero-bg">
          {slides.map((s, i) => (
            <div
              key={s.image}
              className={`hero-bg-img${i === active ? " active" : ""}`}
              style={{ position: "absolute", inset: 0 }}
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        <div className="wrap-wide hero-content">
          {/* crossfading message slides */}
          <div className="hero-text">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`hero-text-slide${i === active ? " active" : ""}`}
                role="group"
                aria-label={`Slide ${i + 1} of ${n}`}
              >
                <span className="eyebrow on-dark">{s.eyebrow}</span>
                <h1>{s.heading}</h1>
                <p className="sub">{s.subtitle}</p>
                <p className="support">{s.support}</p>
                <div className="ctas">
                  {s.primaryCta.href ? (
                    <Link className="btn btn-green btn-lg" href={s.primaryCta.href}>
                      {s.primaryCta.label} <Arrow />
                    </Link>
                  ) : (
                    <ContactButton className="btn btn-green btn-lg">
                      {s.primaryCta.label} <Arrow />
                    </ContactButton>
                  )}
                  <Link className="btn btn-outline-white btn-lg" href={s.secondaryCta.href ?? "/"}>
                    {s.secondaryCta.label}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* slider controls */}
          <div className="hero-controls">
            <div className="hero-dots" role="tablist" aria-label="Hero slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`hero-dot${i === active ? " active" : ""}`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    go(i);
                    restart();
                  }}
                />
              ))}
            </div>
          </div>

          <div className="credbar">
            <div className="cred">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </span>
              <div>
                <div className="v">Quality-first</div>
                <div className="l">Compliance-aligned</div>
              </div>
            </div>
            <div className="cred">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 21V7l8-4 8 4v14" />
                  <path d="M4 21h16M9 21v-4h6v4" />
                  <path d="M12 7v4M10 9h4" />
                </svg>
              </span>
              <div>
                <div className="v">50+ Partners</div>
                <div className="l">Hospitals &amp; clinics</div>
              </div>
            </div>
            <div className="cred">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
                  <circle cx="7" cy="18" r="1.8" />
                  <circle cx="17.5" cy="18" r="1.8" />
                </svg>
              </span>
              <div>
                <div className="v">Pan-India</div>
                <div className="l">Distribution network</div>
              </div>
            </div>
            <div className="cred">
              <span className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="9" r="6" />
                  <path d="M9 14l-2 7 5-3 5 3-2-7" />
                  <path d="M12 6v3l2 1" />
                </svg>
              </span>
              <div>
                <div className="v">10+ Categories</div>
                <div className="l">Medical &amp; surgical</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
