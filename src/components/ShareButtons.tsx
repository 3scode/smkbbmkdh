"use client";

import { useState } from "react";
import { Check, Link2, MessageCircle } from "lucide-react";
import { FacebookIcon } from "./SocialIcons";

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btn =
    "flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-semibold text-text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Bagikan">
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
      >
        <MessageCircle className="size-4" aria-hidden /> WA
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
      >
        <FacebookIcon className="size-4" /> FB
      </a>
      <button type="button" className={btn} onClick={copy}>
        {copied ? (
          <Check className="size-4 text-success" aria-hidden />
        ) : (
          <Link2 className="size-4" aria-hidden />
        )}
        {copied ? "Tautan disalin" : "Salin tautan"}
      </button>
    </div>
  );
}
