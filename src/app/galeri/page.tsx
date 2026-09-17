import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { asc, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { ekskul, galeri, prestasi } from "@/lib/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GaleriGrid } from "@/components/GaleriGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri & Ekstrakurikuler",
  description:
    "Galeri kegiatan, ekstrakurikuler, dan prestasi SMK BBM Kandanghaur: futsal, OSIS, seni, keagamaan, dan wirausaha.",
};

async function getGaleri() {
  try {
    const [g, e, p] = [
      await db.select().from(galeri).orderBy(desc(galeri.takenAt), asc(galeri.sortOrder)),
      await db.select().from(ekskul).orderBy(asc(ekskul.nama)),
      await db.select().from(prestasi).orderBy(desc(prestasi.tahun)),
    ];
    return { galeri: g, ekskul: e, prestasi: p };
  } catch {
    return { galeri: [], ekskul: [], prestasi: [] };
  }
}

export default async function GaleriPage() {
  const data = await getGaleri();
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
                Galeri
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Galeri & Ekstrakurikuler
          </h1>
          <p className="pt-1 text-text-secondary">
            Praktik, seni, olahraga, keagamaan — bukti pengawalan potensi sampai profesional.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading align="left" eyebrow="Dokumentasi" title="Momen Sekolah" />
        <div className="pt-6">
          <GaleriGrid
            galeri={data.galeri.map((g) => ({
              id: g.id,
              caption: g.caption,
              kategori: g.kategori,
              takenAt: g.takenAt,
              imageUrl: g.imageUrl,
              videoUrl: g.videoUrl,
            }))}
            ekskul={data.ekskul.map((e) => ({
              id: e.id,
              nama: e.nama,
              jadwal: e.jadwal,
              pembina: e.pembina,
              deskripsi: e.deskripsi,
            }))}
            prestasi={data.prestasi.map((p) => ({
              id: p.id,
              judul: p.judul,
              tahun: p.tahun,
              tingkat: p.tingkat,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
