import Link from "next/link";
import { Megaphone, Mail, Phone } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export function Topbar() {
  return (
    <div className="bg-text-primary text-sm text-slate-300 print:hidden">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-4 py-1.5">
        <p className="flex min-w-0 items-center gap-4">
          <a href={`tel:${SCHOOL.telepon}`} className="flex items-center gap-1.5 hover:text-white">
            <Phone className="size-4" aria-hidden />
            <span className="hidden sm:inline">{SCHOOL.telepon}</span>
            <span className="sm:hidden">Telepon</span>
          </a>
          <a
            href={`mailto:${SCHOOL.email}`}
            className="hidden items-center gap-1.5 hover:text-white md:flex"
          >
            <Mail className="size-4" aria-hidden />
            {SCHOOL.email}
          </a>
        </p>
        <Link
          href="/ppdb"
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[13px] font-semibold text-text-primary hover:bg-secondary-hover"
        >
          <Megaphone className="size-4" aria-hidden />
          PPDB Gelombang 1 Dibuka
        </Link>
      </div>
    </div>
  );
}
