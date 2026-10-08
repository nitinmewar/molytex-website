"use client";

import { useState, type FormEvent } from "react";
import { sendInquiry } from "@/lib/sendInquiry";
import { LIMITS, PRODUCT_OPTIONS } from "@/lib/inquiry";
import { Turnstile } from "./Turnstile";

export function ContactForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [engaged, setEngaged] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const result = await sendInquiry(fd);

    setSending(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error);
      setAttempt((n) => n + 1);
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
    <form onSubmit={handleSubmit} onFocus={() => setEngaged(true)} className="form-grid mt-24" noValidate>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="c-name">Name <span className="req">*</span></label>
          <input className="form-control" id="c-name" name="name" placeholder="Your full name" maxLength={LIMITS.name} required />
        </div>
        <div className="form-field">
          <label htmlFor="c-org">Organization <span className="req">*</span></label>
          <input className="form-control" id="c-org" name="organization" placeholder="Hospital / clinic / company" maxLength={LIMITS.organization} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="c-email">Email <span className="req">*</span></label>
          <input className="form-control" id="c-email" name="email" type="email" placeholder="you@organization.com" defaultValue={defaultEmail} maxLength={LIMITS.email} required />
        </div>
        <div className="form-field">
          <label htmlFor="c-phone">Phone</label>
          <input className="form-control" id="c-phone" name="phone" type="tel" placeholder="+91 ..." maxLength={LIMITS.phone} />
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
        <textarea className="form-control" id="c-msg" name="message" placeholder="Tell us about your requirements…" maxLength={LIMITS.message} required />
      </div>
      {engaged && <Turnstile key={attempt} />}
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
