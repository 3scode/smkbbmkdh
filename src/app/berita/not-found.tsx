import Link from "next/link";
import { desc, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { BeritaCard } from "@/components/BeritaCard";

export default async function BeritaNotFound() {
  let related: Array<{
    id: string;
    slug: string;
    judul: string;
    kategori: string;
    coverUrl: string | null;
    publishedAt: Date | null;
    excerpt: string | null;
    readingMinutes: number;
  }> = [];
  try {
    related = await db
      .select()
      .from(berita)
      .where(isNotNull(berita.publishedAt))
      .orderBy(desc(berita.publishedAt))
      .limit(3);
  } catch {
    related = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold text-text-primary">Artikel tidak ditemukan</h1>
      <p className="max-w-md text-text-secondary">
        Artikel sudah dihapus atau alamat salah. Coba berita terbaru di bawah ini.
      </p>
      <Link
        href="/berita"
        className="inline-flex h-11 items-center rounded-md border border-primary px-5 font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Kembali ke daftar berita
      </Link>
      {related.length > 0 && (
        <div className="grid w-full gap-4 pt-6 text-left sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <BeritaCard
              key={r.id}
              slug={r.slug}
              judul={r.judul}
              tanggal={
                r.publishedAt
                  ? new Date(r.publishedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""
              }
              kategori={r.kategori}
              coverUrl={r.coverUrl ?? "/images/placeholder-berita.svg"}
              excerpt={r.excerpt ?? undefined}
              readingMinutes={r.readingMinutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
