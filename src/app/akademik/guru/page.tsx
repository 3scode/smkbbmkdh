import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { GuruFilter } from "@/components/GuruFilter";
import { DemoNotice } from "@/components/DemoNotice";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Direktori Guru",
  description:
    "Daftar guru SMK BBM Kandanghaur per mata pelajaran dan jurusan — cari nama, saring per jurusan.",
};

export default function GuruPage() {
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
                Guru
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-text-primary md:text-[30px]">Direktori Guru</h1>
          <p className="max-w-2xl text-text-secondary">
            Cari nama atau mata pelajaran, saring per jurusan. Setiap kartu memuat NUPTK, jadwal,
            dan tugas wali kelas bila ada.
          </p>
          <DemoNotice text="Daftar ini contoh (demo): 12 nama ditampilkan sebagai contoh format dari total 32 guru. Nama, NUPTK, dan jadwal bukan data real." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading
          align="left"
          eyebrow="Direktori"
          title="Semua Guru"
          desc="Saring berdasarkan jurusan atau cari dengan kata kunci."
        />
        <div className="pt-6">
          <Suspense fallback={<GuruListSkeleton />}>
            <GuruFilter />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function GuruListSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true" aria-label="Memuat direktori guru">
      <span className="sr-only">Memuat direktori guru…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-14 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-4/5" />
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
