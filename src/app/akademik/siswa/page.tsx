import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { DemoNotice } from "@/components/DemoNotice";
import { SISWA_AGREGAT, TOTAL_SISWA, TAHUN_AJARAN } from "@/data/akademik";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Data Siswa",
  description:
    "Sebaran jumlah siswa SMK BBM Kandanghaur per jurusan dan per tingkat — agregat tanpa data pribadi.",
};

export default function SiswaPage() {
  const totalX = SISWA_AGREGAT.reduce((a, r) => a + r.x, 0);
  const totalXI = SISWA_AGREGAT.reduce((a, r) => a + r.xi, 0);
  const totalXII = SISWA_AGREGAT.reduce((a, r) => a + r.xii, 0);

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
                Siswa
              </li>
            </ol>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary md:text-[30px]">Data Siswa</h1>
            <Badge tone="amber">Demo</Badge>
          </div>
          <p className="max-w-2xl text-text-secondary">
            Rekap jumlah siswa tahun ajaran {TAHUN_AJARAN} per jurusan dan per tingkat. Nama dan
            data pribadi siswa tidak ditampilkan di halaman publik (UU PDP).
          </p>
          <DemoNotice text="Angka-angka di bawah ini contoh (demo) dengan total 480 — bukan jumlah real. Data real direkap humas per tahun ajaran." />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading
          align="left"
          eyebrow="Rekap"
          title={`Sebaran ${TOTAL_SISWA} Siswa`}
          desc="Geser tabel ke samping di layar kecil, atau baca kartu per jurusan."
        />

        <div className="hidden pt-6 md:block">
          <div className="overflow-x-auto rounded-md border border-border bg-surface shadow-sm">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <caption className="sr-only">
                Jumlah siswa per jurusan dan per tingkat, tahun ajaran {TAHUN_AJARAN}
              </caption>
              <thead>
                <tr className="border-b border-border bg-background-alt text-sm text-text-secondary">
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Jurusan
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Kelas X
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Kelas XI
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Kelas XII
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {SISWA_AGREGAT.map((r) => (
                  <tr
                    key={r.jurusanSlug}
                    className="border-b border-border text-sm last:border-0 hover:bg-background"
                  >
                    <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                      <Link
                        href={`/jurusan/${r.jurusanSlug}`}
                        className="underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {r.jurusanNama}
                      </Link>
                    </th>
                    <td className="px-4 py-3 text-right text-text-secondary tabular-nums">{r.x}</td>
                    <td className="px-4 py-3 text-right text-text-secondary tabular-nums">{r.xi}</td>
                    <td className="px-4 py-3 text-right text-text-secondary tabular-nums">{r.xii}</td>
                    <td className="px-4 py-3 text-right font-bold text-text-primary tabular-nums">
                      {r.x + r.xi + r.xii}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-primary-soft text-sm font-bold text-primary-hover">
                  <th scope="row" className="px-4 py-3">
                    Total
                  </th>
                  <td className="px-4 py-3 text-right tabular-nums">{totalX}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{totalXI}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{totalXII}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{TOTAL_SISWA}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <ul className="flex flex-col gap-3 pt-6 md:hidden">
          {SISWA_AGREGAT.map((r) => (
            <li
              key={r.jurusanSlug}
              className="flex flex-col gap-1 rounded-md border border-border bg-surface p-4 shadow-sm"
            >
              <Link
                href={`/jurusan/${r.jurusanSlug}`}
                className="font-semibold text-text-primary underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {r.jurusanNama}
              </Link>
              <p className="text-sm text-text-secondary tabular-nums">
                X: {r.x} • XI: {r.xi} • XII: {r.xii}
              </p>
              <p className="text-sm font-bold text-primary tabular-nums">
                Total {r.x + r.xi + r.xii} siswa
              </p>
            </li>
          ))}
          <li className="rounded-md bg-primary-soft p-4 text-sm font-bold text-primary-hover tabular-nums">
            Total seluruhnya: {TOTAL_SISWA} siswa
          </li>
        </ul>
      </section>
    </div>
  );
}
