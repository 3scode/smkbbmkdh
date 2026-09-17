import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Landmark, School, User } from "lucide-react";
import { loadProfil } from "@/content";
import { SCHOOL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfilTabs } from "@/components/ProfilTabs";
import { TrackLink } from "@/components/TrackLink";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Profil, Visi, Misi & Tujuan",
  description: `Profil ${SCHOOL.nama} ${SCHOOL.kota}: sejarah, visi, 7 misi, 7 tujuan, sambutan kepala sekolah, NPSN ${SCHOOL.npsn}.`,
};

const NILAI = [
  { title: "Iman", desc: "Keimanan & ahlak mulia sebagai fondasi." },
  { title: "Ilmu", desc: "Keterampilan vokasi + bahasa asing." },
  { title: "Mandiri", desc: "Wirausaha & kemandirian ekonomi." },
  { title: "Kepemimpinan", desc: "Disiplin, tanggung jawab, longlife education." },
] as const;

export default function ProfilPage() {
  const { content, fromFallback } = loadProfil();

  return (
    <div className="flex flex-col">
      {/* Header */}
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
                Profil
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Profil Sekolah
          </h1>
          <p className="pt-1 text-text-secondary">
            {SCHOOL.nama} — {SCHOOL.kota}, NPSN {SCHOOL.npsn}
          </p>
        </div>
      </section>

      {fromFallback && (
        <div className="mx-auto w-full max-w-[1200px] px-4 pt-6" role="alert">
          <p className="rounded-md border border-error/30 bg-[#FEF2F2] p-4 text-sm text-error">
            Data profil sedang diperbarui — menampilkan versi terakhir.{" "}
            <a href="/kontak" className="font-semibold underline">
              Hubungi sekolah
            </a>{" "}
            untuk info terbaru.
          </p>
        </div>
      )}

      {/* Sejarah */}
      <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
        <div className="flex flex-col gap-4">
          <SectionHeading
            align="left"
            eyebrow="Sejarah"
            title="Sekolah Kejuruan untuk Kandanghaur"
          />
          {content.sejarah.map((p, i) => (
            <p key={i} className="leading-[1.7] text-text-primary">
              {p}
            </p>
          ))}
          <p>
            <Badge tone="success" dot>
              NPSN {SCHOOL.npsn}
            </Badge>{" "}
            <Badge tone="primary">Swasta</Badge>
          </p>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-md">
          <Image
            src="/images/taman-smk/taman-1.jpg"
            alt="Taman dan gedung SMK Bangun Bangsa Mandiri Kandanghaur"
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            loading="lazy"
            className="object-cover"
          />
        </div>
      </section>

      {/* Visi Misi Tujuan */}
      <section className="bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-12 md:py-16">
          <SectionHeading
            eyebrow="Visi, Misi & Tujuan"
            title="Landasan Kami Mendidik"
            desc="Teks lengkap dan utuh — bacaan utama bagi Ayah/Bunda sebelum mendaftar."
          />
          <ProfilTabs content={content} />
        </div>
      </section>

      {/* Nilai */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-16">
        <SectionHeading eyebrow="Nilai Utama" title="Iman, Ilmu, Mandiri, Kepemimpinan" />
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {NILAI.map((n) => (
            <div
              key={n.title}
              className="rounded-md border border-border bg-surface p-5 text-center shadow-sm"
            >
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Landmark className="size-6" aria-hidden />
              </span>
              <h3 className="pt-2 font-bold text-text-primary">{n.title}</h3>
              <p className="pt-1 text-sm text-text-secondary">{n.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Kepsek */}
      <section className="bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-6 px-4 py-12 text-center md:py-16">
          <SectionHeading eyebrow="Sambutan" title="Kepala Sekolah" />
          <span className="flex size-40 items-center justify-center rounded-full bg-primary-soft text-primary">
            {content.kepsek.foto ? (
              <Image
                src={content.kepsek.foto}
                alt={`Foto ${content.kepsek.nama}`}
                width={160}
                height={160}
                loading="lazy"
                className="rounded-full object-cover"
              />
            ) : (
              <User className="size-20" aria-hidden />
            )}
          </span>
          {content.kepsek.sambutan.map((p, i) => (
            <p key={i} className="max-w-3xl leading-[1.7] text-text-primary">
              {p}
            </p>
          ))}
          <p className="font-bold text-text-primary">{content.kepsek.nama}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TrackLink
              sumber="profil"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Daftar PPDB
            </TrackLink>
            <Link
              href="/jurusan"
              className="inline-flex h-12 items-center justify-center gap-1 rounded-md border border-primary bg-surface px-6 font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <School className="size-4" aria-hidden /> Lihat Jurusan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
