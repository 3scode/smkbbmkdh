"use client";

import Link from "next/link";
import { trackDaftarClick } from "@/lib/analytics";

/** Link CTA ke /ppdb dengan event GA4 click_daftar_ppdb. */
export function TrackLink({
  href = "/ppdb",
  sumber,
  className,
  children,
}: {
  href?: string;
  sumber: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        if (href === "/ppdb") trackDaftarClick(sumber);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
