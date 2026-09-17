"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { waLink, WA_TANYA } from "@/lib/constants";
import { trackDaftarClick } from "@/lib/analytics";

export function WAFloat() {
  return (
    <div className="print:hidden">
      <a
        href={waLink(WA_TANYA)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Humas SMK BBM"
        className="fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-[1.08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:bottom-6"
      >
        <MessageCircle className="size-7" aria-hidden />
      </a>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur md:hidden">
        <Link
          href="/ppdb"
          onClick={() => trackDaftarClick("sticky-bottom")}
          className="flex h-12 w-full items-center justify-center rounded-md bg-primary font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Daftar PPDB Sekarang
        </Link>
      </div>
    </div>
  );
}
