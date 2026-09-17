import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { fasilitas } from "@/lib/schema";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FasilitasGrid } from "@/components/FasilitasGrid";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Fasilitas",
  description:
    "Fasilitas SMK BBM Kandanghaur: masjid, lab komputer, bengkel otomotif, perpustakaan, lapangan futsal, dan kantin kewirausahaan.",
};

async function getFasilitas() {
  try {
    return await db.select().from(fasilitas).orderBy(asc(fasilitas.nama));
  } catch {
    return [];
  }
}

export default async function FasilitasPage() {
  const rows = await getFasilitas();
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
                Fasilitas
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Fasilitas Sekolah
          </h1>
          <p className="pt-1 text-text-secondary">
            Bukti nyata sarana ibadah, praktik vokasi, dan penunjang belajar.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading align="left" eyebrow="Sarana" title="Jelajahi Fasilitas" />
        <div className="pt-6">
          <FasilitasGrid
            items={rows.map((r) => ({
              id: r.id,
              nama: r.nama,
              kategori: r.kategori,
              kapasitas: r.kapasitas,
              deskripsi: r.deskripsi,
              fotoUrls: (r.fotoUrls as string[]) ?? [],
              isFeatured: r.isFeatured,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
