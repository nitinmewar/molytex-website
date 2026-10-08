"use client";

import { useEffect, useRef } from "react";

type TurnstileApi = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
let scriptLoad: Promise<void> | undefined;

function loadTurnstile(): Promise<void> {
  scriptLoad ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoad = undefined;
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

/**
 * Spam check for a form. It adds a hidden `cf-turnstile-response` field to the enclosing form.
 * "interaction-only" keeps it invisible unless Cloudflare needs the visitor to click, so the Figma layout holds.
 * Remount it (change its key) after a failed submit: each token is single-use.
 */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let widgetId: string | undefined;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId = window.turnstile.render(ref.current, { sitekey: SITE_KEY, appearance: "interaction-only" });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, []);

  return <div ref={ref} />;
}
