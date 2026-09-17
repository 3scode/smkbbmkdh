import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JurusanFilter } from "@/components/JurusanFilter";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Program Keahlian",
  description:
    "Pilih jurusan SMK BBM Kandanghaur: prospek kerja, keterampilan, kurikulum, dan biaya. Daftar langsung ke PPDB.",
};

async function getJurusan() {
  try {
    return await db
      .select()
      .from(jurusan)
      .where(eq(jurusan.isActive, true))
      .orderBy(asc(jurusan.sortOrder));
  } catch {
    return [];
  }
}

export default async function JurusanPage() {
  const rows = await getJurusan();
  const kategoriList = [...new Set(rows.map((r) => r.kategori))].sort();

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
                Jurusan
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Program Keahlian
          </h1>
          <p className="pt-1 text-text-secondary">
            Setiap jurusan siap kerja + wirausaha + bahasa Inggris. Klik Daftar untuk langsung
            mengisi PPDB.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading
          align="left"
          eyebrow="Katalog"
          title="Semua Jurusan"
          desc="Saring berdasarkan kategori atau cari dengan kata kunci."
        />
        <div className="pt-6">
          <Suspense
            fallback={
              <p className="text-text-secondary" aria-busy="true">
                Memuat filter jurusan…
              </p>
            }
          >
            <JurusanFilter
              items={rows.map((r) => ({
                id: r.id,
                slug: r.slug,
                nama: r.nama,
                kategori: r.kategori,
                durasi: r.durasi,
                skills: (r.skills as string[]) ?? [],
                prospek: (r.prospek as string[]) ?? [],
                sppBulanan: r.sppBulanan,
                coverUrl: r.coverUrl,
              }))}
              kategoriList={kategoriList}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
