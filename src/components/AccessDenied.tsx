import Link from "next/link";
import { ShieldAlert } from "lucide-react";

/** Kartu 403 untuk halaman internal — dipakai setelah guard can() gagal. */
export function AccessDenied({ kembali = "/dashboard" }: { kembali?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg bg-background-alt px-6 py-12 text-center">
      <span className="flex size-[120px] items-center justify-center rounded-full bg-primary-soft">
        <ShieldAlert aria-hidden className="size-24 text-border" strokeWidth={1.5} />
      </span>
      <h2 className="text-xl font-semibold text-text-primary">Tidak punya akses</h2>
      <p className="line-clamp-2 max-w-md text-text-secondary">
        Peran akun Anda tidak diizinkan membuka halaman ini. Hubungi wakasek bila ini keliru.
      </p>
      <Link
        href={kembali}
        className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        ← Kembali ke dashboard
      </Link>
    </div>
  );
}
