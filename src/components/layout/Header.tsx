"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ContactButton } from "@/components/contact/ContactButton";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/certifications", label: "Certifications" },
  { href: "/resources", label: "Resources" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <nav className="nav" aria-label="Primary">
          <Link className="brand" href="/" aria-label="Molytex Healthcare home">
            <Image
              src="/assets/molytex-logo-header.webp"
              alt="Molytex Healthcare"
              width={787}
              height={371}
              priority
            />
          </Link>

          <div className="nav-menu">
            {NAV_LINKS.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link${pathname === link.href ? " active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="nav-spacer" />

          <span className="nav-soon" title="Skincare Division — Coming Soon">
            Skincare Division <span className="pill">Soon</span>
          </span>

          <div className="nav-cta">
            <ContactButton className="btn btn-green btn-request">
              Contact Us
            </ContactButton>
            <button
              className="nav-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Scrim */}
      <div
        className={`nav-scrim${drawerOpen ? " open" : ""}`}
        id="navScrim"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile drawer */}
      <aside
        className={`nav-drawer${drawerOpen ? " open" : ""}`}
        id="navDrawer"
        aria-label="Mobile menu"
      >
        <div className="drawer-head">
          <Image
            src="/assets/molytex-logo-white.webp"
            alt="Molytex Healthcare"
            width={69}
            height={34}
          />
          <button
            className="drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setDrawerOpen(false)}
            className="drawer-link"
          >
            {link.label}
          </Link>
        ))}

        <span className="drawer-link soon">
          Skincare Division{" "}
          <span className="pill" style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", background: "rgba(106,191,31,.22)", color: "#bff08a", padding: ".25em .6em", borderRadius: "999px", border: "1px solid rgba(106,191,31,.4)" }}>
            Coming Soon
          </span>
        </span>

        <ContactButton
          className="btn btn-green btn-block"
          onClick={() => setDrawerOpen(false)}
        >
          Contact Us
        </ContactButton>
      </aside>
    </>
  );
}
