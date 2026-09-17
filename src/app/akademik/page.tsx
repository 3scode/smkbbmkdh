import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, GraduationCap, School, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { DemoNotice } from "@/components/DemoNotice";
import { TOTAL_GURU, TOTAL_KAPRODI, TOTAL_SISWA, TAHUN_AJARAN } from "@/data/akademik";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Data Akademik",
  description:
    "Direktori guru, kepala program keahlian, dan data siswa SMK BBM Kandanghaur — transparan untuk orang tua dan calon siswa.",
};

const RAK = [
  {
    href: "/akademik/guru",
    icon: Users,
    eyebrow: "Direktori",
    title: "Guru",
    desc: "Siapa mengajar mata pelajaran apa, lengkap dengan jadwal dan tugas wali kelas.",
    hitung: `${TOTAL_GURU} guru`,
  },
  {
    href: "/akademik/kaprodi",
    icon: GraduationCap,
    eyebrow: "Penanggung jawab",
    title: "Kepala Program Keahlian",
    desc: "Penanggung jawab tiap jurusan — terhubung ke halaman jurusan masing-masing.",
    hitung: `${TOTAL_KAPRODI} kaprodi`,
  },
  {
    href: "/akademik/siswa",
    icon: School,
    eyebrow: "Agregat",
    title: "Data Siswa",
    desc: "Jumlah siswa per jurusan dan per tingkat, tanpa menampilkan data pribadi.",
    hitung: `${TOTAL_SISWA} siswa`,
  },
];

export default function AkademikPage() {
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
              <li aria-current="page" className="font-medium text-text-primary">
                Akademik
              </li>
            </ol>
          </nav>
          <h1 className="text-2xl font-bold text-text-primary md:text-[30px]">Data Akademik</h1>
          <p className="max-w-2xl text-text-secondary">
            Kenali guru, kepala program keahlian, dan sebaran siswa SMK BBM Kandanghaur tahun
            ajaran {TAHUN_AJARAN}. Terbuka untuk Ayah/Bunda tanpa perlu login.
          </p>
          <DemoNotice text="Halaman ini memakai data contoh (demo) agar Bapak/Ibu kepala sekolah bisa menilai formatnya. Seluruh angka, nama, dan NUPTK di bawah ini bukan data real dan akan diganti data sekolah yang sebenarnya setelah disetujui." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading
          align="left"
          eyebrow="Tiga Rak"
          title="Jelajahi Data Akademik"
          desc="Pilih rak di bawah — setiap rak bisa dicari dan disaring per jurusan."
        />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {RAK.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex flex-col gap-3 rounded-md border border-border bg-surface p-5 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-md bg-primary-soft">
                  <r.icon aria-hidden className="size-6 text-primary" />
                </span>
                <Badge tone="amber" size="sm">
                  Demo
                </Badge>
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[13px] font-medium text-text-secondary">{r.eyebrow}</span>
                <span className="text-xl font-semibold text-text-primary group-hover:underline">
                  {r.title}
                </span>
                <span className="line-clamp-2 text-sm text-text-secondary">{r.desc}</span>
              </span>
              <span className="mt-auto flex items-center justify-between pt-1">
                <span className="text-sm font-bold text-primary tabular-nums">{r.hitung}</span>
                <span className="inline-flex min-h-[44px] items-center font-semibold text-primary">
                  Buka <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-background-alt">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
          <SectionHeading
            align="left"
            eyebrow="Pembaruan"
            title="Bagaimana data ini diperbarui?"
            desc="Humas memperbarui sendiri tanpa coding — data real menggantikan contoh setelah disetujui kepala sekolah."
          />
          <ol className="flex list-decimal flex-col gap-2 pt-6 pl-5 text-text-secondary">
            <li>Kepala sekolah menyerahkan daftar guru, kaprodi, dan rekap siswa yang final.</li>
            <li>Humas memasukkan ke database sekolah (dashboard Supabase) — terbit ≤5 menit.</li>
            <li>Label “Demo” hilang otomatis untuk baris yang sudah memakai data real.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
