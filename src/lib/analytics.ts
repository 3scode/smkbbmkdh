"use client";

/**
 * GA4 ringan: event via dataLayer, hormati consent (localStorage).
 * Tanpa NEXT_PUBLIC_GA_ID → semua no-op (dev/lokal aman).
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "smkbbm-ga-consent";

export function gaId(): string {
  return process.env.NEXT_PUBLIC_GA_ID ?? "";
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "granted";
}

export function setConsent(granted: boolean): void {
  window.localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
  if (granted) window.gtag?.("event", "consent_granted");
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!gaId() || !hasConsent()) return;
  window.gtag?.("event", name, params);
}

export const trackDaftarClick = (sumber: string) => trackEvent("click_daftar_ppdb", { sumber });
