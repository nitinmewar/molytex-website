"use client";

import { useState, type FormEvent } from "react";
import { submitInquiry } from "@/lib/actions/submitInquiry";

const PRODUCT_OPTIONS = [
  "Surgical Consumables",
  "Orthopedic Products",
  "Rehabilitation Aids",
  "Hospital Disposables",
  "Infection Control Products",
  "Medical Accessories",
  "General / Multiple",
] as const;

export function ContactForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const result = await submitInquiry(fd);

    setSending(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="form-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        Thank you — your request has been noted. Our team will be in touch.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid mt-24" noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="c-name">Name <span className="req">*</span></label>
          <input className="form-control" id="c-name" name="name" placeholder="Your full name" required />
        </div>
        <div className="form-field">
          <label htmlFor="c-org">Organization <span className="req">*</span></label>
          <input className="form-control" id="c-org" name="organization" placeholder="Hospital / clinic / company" required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="c-email">Email <span className="req">*</span></label>
          <input className="form-control" id="c-email" name="email" type="email" placeholder="you@organization.com" defaultValue={defaultEmail} required />
        </div>
        <div className="form-field">
          <label htmlFor="c-phone">Phone</label>
          <input className="form-control" id="c-phone" name="phone" type="tel" placeholder="+91 ..." />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="c-interest">Product Interest</label>
        <select className="form-control" id="c-interest" name="interest">
          <option value="">Select a category…</option>
          {PRODUCT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="c-msg">Message <span className="req">*</span></label>
        <textarea className="form-control" id="c-msg" name="message" placeholder="Tell us about your requirements…" required />
      </div>
      {error && (
        <div style={{ color: "var(--green-700)", fontWeight: 600, fontSize: ".95rem" }}>
          {error}
        </div>
      )}
      <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={sending}>
        {sending ? "Sending..." : "Send Request"}
        {!sending && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </form>
  );
}
