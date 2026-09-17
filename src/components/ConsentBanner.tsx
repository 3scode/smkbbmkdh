"use client";

import { useEffect, useState } from "react";
import { CONSENT_KEY, gaId, setConsent } from "@/lib/analytics";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (gaId() && !window.localStorage.getItem(CONSENT_KEY)) {
        setVisible(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const choose = (granted: boolean) => {
    setConsent(granted);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Persetujuan analitik"
      className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-xl rounded-lg border border-border bg-surface p-4 shadow-lg md:bottom-6"
    >
      <p className="text-sm text-text-secondary">
        Kami memakai analitik anonim untuk meningkatkan layanan. Boleh kami mengukur kunjungan
        secara anonim?
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose(true)}
          className="h-11 flex-1 rounded-md bg-primary font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Terima
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="h-11 flex-1 rounded-md border border-border font-semibold text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}
