"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Tombol salin teks + toast inline (check 2 detik). */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} tersalin` : `Salin ${label}`}
      className="flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-md border border-border px-3 text-sm font-semibold text-text-primary hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {copied ? (
        <>
          <Check className="size-4 text-success" aria-hidden /> Tersalin
        </>
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}
