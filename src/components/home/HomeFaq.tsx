"use client";

import { useState, useCallback } from "react";

const FAQ_ITEMS = [
  {
    question: "What products does Molytex offer?",
    answer: "Molytex provides a focused portfolio of medical and surgical products, including surgical consumables, orthopedic and rehabilitation aids, hospital disposables, infection control solutions, and medical accessories — all intended for clinical and institutional use.",
  },
  {
    question: "Who do you serve?",
    answer: "We support hospitals, clinics, diagnostic centers, nursing homes, rehabilitation centers, and healthcare institutions, as well as procurement teams and distributors across India.",
  },
  {
    question: "Can I purchase products online?",
    answer: "Molytex is not an online store. Our website is informational, and we work directly with healthcare institutions through inquiries and procurement partnerships rather than online checkout.",
  },
  {
    question: "How can I request information?",
    answer: "You can reach us through the Contact page by submitting the inquiry form with your organization details and product interest. Our team will follow up to understand your requirements.",
  },
  {
    question: "Do you support institutional procurement?",
    answer: "Yes. We work with institutional procurement teams to support dependable supply, consistent quality, and long-term healthcare partnerships.",
  },
  {
    question: "Do you provide support across India?",
    answer: "Our distribution network supports healthcare providers across India and continues to grow as we build new institutional relationships.",
  },
];

export function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = useCallback((i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section className="section bg-grey faq-sec">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow">Frequently Asked Questions</span>
          <h2 className="h2">Answers for procurement &amp; partners</h2>
        </div>
        <div className="faq mt-40">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item${openIndex === i ? " open" : ""}`}>
              <button
                className="faq-q"
                aria-expanded={openIndex === i}
                onClick={() => toggle(i)}
              >
                {item.question}
                <span className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </span>
              </button>
              <div className="faq-a" style={openIndex === i ? { maxHeight: 340 } : undefined}>
                <div className="faq-a-inner">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
