import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarClock, ChevronRight, ClipboardCheck, FileCheck2, Send } from "lucide-react";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { getPpdbStatus } from "@/lib/ppdb";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import { Countdown } from "@/components/Countdown";
import { BiayaTable } from "@/components/BiayaTable";
import { FAQ } from "@/components/FAQ";
import { PPDBForm } from "@/components/PPDBForm";
import { NotifyForm } from "@/components/NotifyForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PPDB — Pendaftaran Siswa Baru",
  description:
    "Info PPDB SMK BBM Kandanghaur: gelombang, biaya transparan, syarat, FAQ, dan formulir pendaftaran online ±2 menit.",
};

const FAQ_PPDB = [
  {
    q: "Berapa total biaya masuk?",
    a: "Lihat tabel biaya di atas — transparan sesuai SNP. Tersedia cicilan dan beasiswa tahfidz/prestasi seni-olahraga.",
  },
  {
    q: "Apa saja syarat pendaftaran?",
    a: "Fotokopi KK, akta kelahiran, rapor semester 5, dan pas foto 3x4. Berkas asli dibawa saat daftar ulang.",
  },
  {
    q: "Apakah seragam sudah termasuk?",
    a: "Seragam tertera terpisah di tabel biaya dan bisa dicicil. Detail tanyakan via WA Humas.",
  },
  {
    q: "Adakah beasiswa?",
    a: "Ada: beasiswa tahfidz Al-Qur'an dan prestasi seni-olahraga minimal tingkat kabupaten.",
  },
  {
    q: "Apakah ada antar-jemput?",
    a: "Untuk area Kandanghaur, Gabuswetan, dan Kroya, hubungi Humas via WA untuk info rute.",
  },
  {
    q: "Kapan daftar ulang?",
    a: "Senin–Jumat 08.00–14.00 di ruang TU dengan membawa nomor bukti pendaftaran.",
  },
  {
    q: "Bisakah pindah jurusan setelah daftar?",
    a: "Bisa selama kuota tersedia dan sebelum daftar ulang — hubungi Humas via WA.",
  },
];

const STEPS = [
  { Icon: Send, title: "1. Isi Form", desc: "Lengkapi data ±2 menit via HP." },
  { Icon: FileCheck2, title: "2. Verifikasi WA", desc: "Konfirmasi nomor bukti ke Humas." },
  { Icon: ClipboardCheck, title: "3. Daftar Ulang", desc: "Datang bawa berkas + nomor bukti." },
];

async function getJurusanOptions() {
  try {
    return await db
      .select({ id: jurusan.id, slug: jurusan.slug, nama: jurusan.nama })
      .from(jurusan)
      .where(eq(jurusan.isActive, true))
      .orderBy(asc(jurusan.sortOrder));
  } catch {
    return [];
  }
}

export default async function PpdbPage({
  searchParams,
}: {
  searchParams: Promise<{ jurusan?: string }>;
}) {
  const { jurusan: jurusanSlug } = await searchParams;
  // Sequential + fallback null: halaman tetap tampil saat DB down
  const status = await getPpdbStatus().catch(() => null);
  const jurusanList = await getJurusanOptions();
  const terbuka = status?.gelombang.status === "buka";

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-4 px-4 py-10 text-center">
          <nav aria-label="Breadcrumb" className="self-start">
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
                PPDB
              </li>
            </ol>
          </nav>
          <p>
            {terbuka ? (
              <Badge tone="success" dot>
                Pendaftaran Dibuka
              </Badge>
            ) : (
              <Badge tone="outline">Pendaftaran Ditutup Sementara</Badge>
            )}
          </p>
          <h1 className="max-w-2xl text-2xl font-bold text-text-primary md:text-[30px]">
            Pendaftaran Peserta Didik Baru
          </h1>
          <p className="max-w-xl text-text-secondary">
            Biaya terjangkau & transparan • Beasiswa tahfidz/prestasi • Gratis konsultasi jurusan
          </p>
          {terbuka && status && (
            <Countdown
              endDate={new Date(status.gelombang.endDate).toISOString()}
              nama={status.gelombang.nama}
            />
          )}
          <ol
            className="grid w-full max-w-3xl gap-3 pt-2 sm:grid-cols-3"
            aria-label="Alur pendaftaran"
          >
            {STEPS.map((s) => (
              <li
                key={s.title}
                className="flex items-center gap-3 rounded-md border border-border bg-surface p-3 text-left shadow-sm"
              >
                <s.Icon className="size-8 shrink-0 text-primary" aria-hidden />
                <span>
                  <span className="block font-bold text-text-primary">{s.title}</span>
                  <span className="block text-[13px] text-text-secondary">{s.desc}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-10 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <section
            aria-label="Formulir pendaftaran"
            className="rounded-lg border border-border bg-surface p-5 shadow-sm md:p-6"
          >
            <h2 className="pb-1 text-xl font-bold text-text-primary">
              {terbuka ? "Formulir Pendaftaran" : "Gelombang Ditutup"}
            </h2>
            {!terbuka && (
              <p className="pb-4 text-text-secondary">
                Pendaftaran gelombang ini ditutup. Tinggalkan nomor WA untuk dihubungi saat
                gelombang berikutnya dibuka.
              </p>
            )}
            <Suspense
              fallback={
                <div className="flex flex-col gap-3" aria-busy="true" aria-label="Memuat formulir">
                  <Skeleton className="h-12 w-full rounded-sm" />
                  <Skeleton className="h-12 w-full rounded-sm" />
                  <Skeleton className="h-12 w-full rounded-sm" />
                </div>
              }
            >
              {terbuka ? (
                <PPDBForm
                  jurusanList={jurusanList}
                  initialSlug={jurusanSlug}
                  gelombangNama={status?.gelombang.nama ?? ""}
                />
              ) : (
                <NotifyForm gelombangId={status?.gelombang.id} />
              )}
            </Suspense>
          </section>

          <section aria-label="Syarat pendaftaran">
            <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
              <CalendarClock className="size-5 text-primary" aria-hidden /> Syarat & Berkas
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pt-3 pl-5 text-text-primary">
              {(
                (status?.gelombang.syarat as string[] | undefined) ?? [
                  "Fotokopi KK 1 lembar",
                  "Fotokopi akta kelahiran 1 lembar",
                ]
              ).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <section
            aria-label="Biaya"
            className="rounded-lg border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-24"
          >
            <h2 className="pb-3 text-xl font-bold text-text-primary" id="biaya">
              Rincian Biaya
            </h2>
            <BiayaTable
              biaya={(status?.gelombang.biaya as Record<string, number> | undefined) ?? {}}
            />
          </section>

          <section aria-label="Tanya jawab">
            <SectionHeading align="left" eyebrow="FAQ" title="Sering Ditanyakan" />
            <div className="pt-4">
              <FAQ items={FAQ_PPDB} idPrefix="ppdb" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
