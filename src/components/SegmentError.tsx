"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/constants";
import { Button } from "./ui/Button";

/** Boundary error ramah per segmen: pesan + Retry + pulang + WA darurat. */
export function SegmentError({
  title,
  message,
  logTag,
  error,
  reset,
  homeHref = "/",
}: {
  title: string;
  message: string;
  logTag: string;
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
}) {
  useEffect(() => {
    console.error(`[${logTag}]`, error.message);
  }, [error, logTag]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-start gap-4 px-4 py-10">
      <div
        role="alert"
        className="flex w-full flex-col gap-3 rounded-md border border-error/30 bg-[#FEF2F2] p-5"
      >
        <h1 className="text-xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="danger" onClick={reset}>
            Coba Lagi
          </Button>
          <Link
            href={homeHref}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-5 font-semibold text-text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Kembali
          </Link>
          <a
            href={waLink("Assalamualaikum, website SMK BBM mengalami gangguan. Mohon bantuan.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 font-semibold text-white hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <MessageCircle className="size-4" aria-hidden /> WA Darurat
          </a>
        </div>
      </div>
      <Link href="/" className="text-sm font-semibold text-primary hover:underline">
        ← Beranda SMK BBM
      </Link>
    </div>
  );
}
