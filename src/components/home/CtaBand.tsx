"use client";

import type { FormEvent } from "react";
import { openContact } from "@/components/contact/ContactDialog";

export function CtaBand() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    openContact(String(new FormData(e.currentTarget).get("email") ?? ""));
  }

  return (
    <section className="cta-strip">
      <div className="cta-strip-inner">
        <p>Let&apos;s talk about how Molytex can support your institution with dependable medical and surgical products.</p>
        <form className="cta-strip-form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="cta-email">Your email address</label>
          <input id="cta-email" name="email" type="email" placeholder="Your email address" autoComplete="email" maxLength={254} required />
          <button type="submit" aria-label="Get in touch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M8 16L16 8M9 8h7v7" /></svg>
          </button>
        </form>
      </div>
    </section>
  );
}
