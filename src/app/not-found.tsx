import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { waLink, WA_TANYA } from "@/lib/constants";

export default function GlobalNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold text-text-primary">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-text-secondary">
        Alamat yang kamu buka salah atau sudah dipindahkan. Kembali ke beranda atau hubungi Humas
        via WhatsApp.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Kembali ke Beranda
        </Link>
        <a
          href={waLink(WA_TANYA)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-secondary px-5 font-semibold text-text-primary hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <MessageCircle className="size-4" aria-hidden /> Hubungi WA
        </a>
      </div>
    </div>
  );
}
