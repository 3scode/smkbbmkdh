import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { DemoNotice } from "@/components/DemoNotice";
import { KAPRODI_LIST, inisial } from "@/data/akademik";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kepala Program Keahlian",
  description:
    "Penanggung jawab tiap jurusan SMK BBM Kandanghaur — terhubung ke halaman jurusan dan direktori guru.",
};

export default function KaprodiPage() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-10">
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
              <li>
                <Link href="/akademik" className="hover:text-primary hover:underline">
                  Akademik
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-text-primary">
                Kaprodi
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-text-primary md:text-[30px]">
            Kepala Program Keahlian
          </h1>
          <p className="max-w-2xl text-text-secondary">
            Satu penanggung jawab per jurusan — pintu pertama bila Ayah/Bunda ingin bertanya soal
            kurikulum dan prospek kerja.
          </p>
          <DemoNotice text="Nama dan NUPTK di bawah ini contoh (demo), bukan pejabat real. Daftar final disahkan kepala sekolah." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading
          align="left"
          eyebrow="Enam Jurusan"
          title="Semua Kaprodi"
          desc="Klik nama jurusan untuk membaca kurikulum dan prospeknya."
        />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {KAPRODI_LIST.map((k) => (
            <article
              key={k.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary-hover"
                >
                  {inisial(k.nama)}
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="line-clamp-2 leading-snug font-semibold text-text-primary">
                    {k.nama}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone="amber" size="sm">
                      Demo
                    </Badge>
                    <Badge tone="primary" size="sm">
                      {k.jurusanNama}
                    </Badge>
                  </div>
                </div>
              </div>
              <dl className="flex flex-col gap-1 text-sm text-text-secondary">
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-text-primary">Periode</dt>
                  <dd className="tabular-nums">{k.periode}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="shrink-0 font-medium text-text-primary">NUPTK</dt>
                  <dd className="tabular-nums">{k.nuptk} (contoh)</dd>
                </div>
              </dl>
              <div className="mt-auto flex gap-2 pt-2">
                <Link
                  href={`/jurusan/${k.jurusanSlug}`}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-primary bg-surface font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Lihat jurusan
                </Link>
                <Link
                  href={`/akademik/guru?jurusan=${k.jurusanSlug}`}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Lihat guru
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
