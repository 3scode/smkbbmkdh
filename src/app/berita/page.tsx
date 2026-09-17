import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Megaphone } from "lucide-react";
import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita, pengumuman } from "@/lib/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { BeritaFilter } from "@/components/BeritaFilter";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description:
    "Berita, pengumuman PPDB, dan agenda SMK BBM Kandanghaur — bukti sekolah yang hidup dan transparan.",
};

async function getData() {
  try {
    const b = await db
      .select()
      .from(berita)
      .where(isNotNull(berita.publishedAt))
      .orderBy(desc(berita.publishedAt))
      .limit(60);
    const p = await db
      .select()
      .from(pengumuman)
      .where(eq(pengumuman.isPinned, true))
      .orderBy(desc(pengumuman.publishedAt))
      .limit(5);
    const a = await db
      .select()
      .from(pengumuman)
      .where(eq(pengumuman.kategori, "agenda"))
      .orderBy(desc(pengumuman.publishedAt))
      .limit(5);
    return { berita: b, pengumuman: p, agenda: a };
  } catch {
    return { berita: [], pengumuman: [], agenda: [] };
  }
}

export default async function BeritaPage() {
  const data = await getData();
  const kategoriList = [...new Set(data.berita.map((b) => b.kategori))].sort();

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-background-alt">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-sm text-text-secondary">
              <li>
                <Link href="/" className="hover:text-primary hover:underline">
                  Beranda
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-text-primary">
                Berita
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Berita & Pengumuman
          </h1>
          <p className="pt-1 text-text-secondary">
            Prestasi, kerjasama DUDI, wirausaha, dan info PPDB.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Arsip"
              title="Semua Berita"
            />
            {/* Suspense granular: skeleton hanya untuk area list,
                TIDAK pakai loading.tsx agar notFound() di [slug] tetap 404.
                (loading.tsx memaksa streaming shell 200 sebelum notFound.) */}
            <Suspense fallback={<BeritaListSkeleton />}>
              <BeritaFilter
                items={data.berita.map((b) => ({
                  id: b.id,
                  slug: b.slug,
                  judul: b.judul,
                  excerpt: b.excerpt,
                  kategori: b.kategori,
                  coverUrl: b.coverUrl,
                  publishedAt: b.publishedAt ? new Date(b.publishedAt).toISOString() : null,
                  readingMinutes: b.readingMinutes,
                }))}
                kategoriList={kategoriList}
              />
            </Suspense>
          </div>

          <aside aria-label="Pengumuman dan agenda" className="flex flex-col gap-6 lg:pt-[72px]">
            <section aria-label="Pengumuman" className="rounded-lg border border-info/30 bg-[#F0F9FF] p-4">
              <h2 className="flex items-center gap-2 font-bold text-text-primary">
                <Megaphone className="size-5 text-info" aria-hidden />
                Pengumuman
              </h2>
              {data.pengumuman.length > 0 ? (
                <ul className="flex flex-col gap-2 pt-3">
                  {data.pengumuman.map((p) => (
                    <li key={p.id}>
                      <details className="group rounded-md bg-surface p-3 shadow-sm">
                        <summary className="cursor-pointer text-[15px] font-semibold text-text-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                          {p.judul}
                        </summary>
                        <p className="pt-2 text-sm text-text-secondary">{p.body}</p>
                      </details>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pt-2 text-sm text-text-secondary">Belum ada pengumuman.</p>
              )}
            </section>

            <section aria-label="Agenda" className="rounded-lg border border-border bg-surface p-4 shadow-sm">
              <h2 className="font-bold text-text-primary">Agenda</h2>
              {data.agenda.length > 0 ? (
                <ul className="flex flex-col gap-3 pt-3">
                  {data.agenda.map((a) => (
                    <li key={a.id} className="border-l-2 border-secondary pl-3">
                      <p className="text-[15px] font-semibold text-text-primary">{a.judul}</p>
                      <p className="text-[13px] text-text-secondary">
                        {new Date(a.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="pt-2 text-sm text-text-secondary">Belum ada agenda.</p>
              )}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

function BeritaListSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Memuat berita">
      <Skeleton className="h-[280px] w-full rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-video w-full rounded-md" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
