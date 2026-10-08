"use client";

import { useEffect, useRef, useState } from "react";
import { ContactForm } from "./ContactForm";

const OPEN_EVENT = "molytex:open-contact";

/** Opens the site-wide contact popup from anywhere, optionally prefilling the email. */
export function openContact(email = "") {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: email }));
}

export function ContactDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [opened, setOpened] = useState(0);

  useEffect(() => {
    const onOpen = (e: Event) => {
      setEmail((e as CustomEvent<string>).detail);
      setOpened((n) => n + 1);
      ref.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="contact-dialog"
      aria-labelledby="contact-dialog-title"
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <div className="contact-form-card contact-dialog-body">
        <button type="button" className="contact-dialog-close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h3 id="contact-dialog-title" className="h3">Contact Us</h3>
        <p className="muted mt-8">Fields marked <span style={{ color: "var(--green-700)", fontWeight: 700 }}>*</span> are required.</p>
        {/* key resets the form (and its sent state) on every open */}
        <ContactForm key={opened} defaultEmail={email} />
      </div>
    </dialog>
  );
}
