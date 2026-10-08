"use client";

import { useState, type FormEvent } from "react";
import { sendInquiry } from "@/lib/sendInquiry";
import { Turnstile } from "@/components/contact/Turnstile";

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [engaged, setEngaged] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");
    const result = await sendInquiry(new FormData(e.currentTarget));
    setSending(false);
    if (result.success) setSubmitted(true);
    else {
      setError(result.error);
      setAttempt((n) => n + 1);
    }
  }

  if (submitted) {
    return (
      <p className="form-note consult-done" role="status">
        Thank you — your request has been noted. Our team will be in touch.
      </p>
    );
  }

  return (
    <form className="consult-form" onSubmit={handleSubmit} onFocus={() => setEngaged(true)} noValidate>
      <div className="consult-field">
        <label htmlFor="k-name">Your name</label>
        <input id="k-name" name="name" placeholder="e.g. John Smith" autoComplete="name" maxLength={120} required />
      </div>
      <div className="consult-field">
        <label htmlFor="k-email">Email address</label>
        <input id="k-email" name="email" type="email" placeholder="e.g. john@email.com" autoComplete="email" maxLength={254} required />
      </div>
      <div className="consult-field">
        <label htmlFor="k-phone">Phone number</label>
        <input id="k-phone" name="phone" type="tel" placeholder="e.g. +1 222 444 66" autoComplete="tel" maxLength={32} />
      </div>
      <div className="consult-field">
        <label htmlFor="k-org">Company Name</label>
        <input id="k-org" name="organization" placeholder="e.g. Execor" autoComplete="organization" maxLength={160} required />
      </div>
      <div className="consult-field full">
        <label htmlFor="k-msg">Your message</label>
        <textarea id="k-msg" name="message" placeholder="Type here ..." maxLength={4000} required />
      </div>
      {error && <p className="consult-error full" role="alert">{error}</p>}
      <div className="full">
        {engaged && <Turnstile key={attempt} />}
        <button type="submit" className="btn btn-green consult-submit" disabled={sending}>
          {sending ? "Sending…" : "Schedule a Free Consultation"}
        </button>
      </div>
    </form>
  );
}
