import Link from "next/link";
import Image from "next/image";
import { ContactButton } from "@/components/contact/ContactButton";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/certifications", label: "Certifications" },
];

const PRODUCT_CATEGORIES = [
  "Surgical Consumables",
  "Orthopedic Products",
  "Rehabilitation Aids",
  "Hospital Disposables",
  "Infection Control",
  "Medical Accessories",
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image
              src="/assets/molytex-logo-white.png"
              alt="Molytex Healthcare"
              width={91}
              height={45}
            />
            <p className="footer-desc">
              Molytex Healthcare delivers reliable medical and surgical products
              that support modern patient care — trusted by hospitals, clinics,
              and healthcare institutions across India.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3a1.97 1.97 0 100 3.94 1.97 1.97 0 000-3.94zM20.5 20v-6.3c0-3.37-1.8-4.94-4.2-4.94a3.6 3.6 0 00-3.27 1.8h-.05V8.5H9.6V20h3.38v-5.7c0-1.5.28-2.95 2.14-2.95 1.83 0 1.86 1.71 1.86 3.05V20H20.5z" /></svg>
              </a>
              <a href="#" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24"><path d="M18.2 3h3.3l-7.2 8.2L22.8 21h-6.6l-5.2-6.8L5.1 21H1.8l7.7-8.8L1.5 3h6.8l4.7 6.2L18.2 3zm-1.2 16h1.8L7.2 4.8H5.3L17 19z" /></svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 00-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 001.76-1.77A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3-5.2 3z" /></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul>
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li><ContactButton>Contact Us</ContactButton></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Product Categories</h5>
            <ul>
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href="/products">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <ul className="footer-contact">
              <li>
                <svg viewBox="0 0 24 24" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>Molytex Healthcare<br />[Office address], India</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h4l1.5 5-2 1.5a12 12 0 005 5l1.5-2 5 1.5v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                </svg>
                <span>+91 [phone number]</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <span>info@molytexproducts.com</span>
              </li>
            </ul>
            <Link href="/privacy-policy" className="footer-privacy-link">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 Molytex Healthcare. All rights reserved.</span>
          <span>*AI-generated images used for illustrative purposes only.</span>
        </div>
      </div>
    </footer>
  );
}
