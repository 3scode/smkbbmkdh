import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { SCHOOL, waLink, WA_TANYA } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyButton } from "@/components/CopyButton";
import { MapsEmbed } from "@/components/MapsEmbed";
import { KontakForm } from "@/components/KontakForm";
import { FAQ } from "@/components/FAQ";
import { TrackLink } from "@/components/TrackLink";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description: `Hubungi ${SCHOOL.nama} ${SCHOOL.kota}: alamat, WA, email, jam layanan, peta lokasi, dan form pesan.`,
};

const FAQ_MINI = [
  {
    q: "Jam berapa bisa datang survei?",
    a: `Senin–Jumat ${SCHOOL.jamSeninJumat}, Sabtu ${SCHOOL.jamSabtu}. Sebaiknya konfirmasi via WA dulu.`,
  },
  {
    q: "Apakah bisa daftar langsung di sekolah?",
    a: "Bisa. Bawa fotokopi KK, akta, rapor semester 5, dan pas foto 3x4 ke ruang TU.",
  },
  { q: "Berapa lama pesan dibalas?", a: "Maksimal 1x24 jam pada jam layanan via WA atau email." },
];

export default function KontakPage() {
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
                Kontak
              </li>
            </ol>
          </nav>
          <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
            Kontak & Lokasi
          </h1>
          <p className="pt-1 text-text-secondary">
            Tanya biaya, jurusan, atau jadwal survei — langsung dibalas Humas.
          </p>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-6 px-4 py-10 lg:grid-cols-12">
        <address className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 not-italic shadow-sm lg:col-span-5">
          <h2 className="font-bold text-text-primary">Info Sekolah</h2>
          <p className="flex items-start justify-between gap-2 text-text-primary">
            <span>{SCHOOL.alamat}</span>
            <CopyButton text={SCHOOL.alamat} label="alamat" />
          </p>
          <p>
            <a
              href={waLink(WA_TANYA)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat WhatsApp Humas SMK BBM"
              className="flex min-h-12 items-center gap-2 font-semibold text-primary hover:underline"
            >
              <MessageCircle className="size-5 shrink-0" aria-hidden />
              Chat WhatsApp Humas
            </a>
          </p>
          <p>
            <a
              href={`tel:${SCHOOL.telepon}`}
              className="flex min-h-12 items-center gap-2 text-text-primary hover:text-primary hover:underline"
            >
              <Phone className="size-5 shrink-0" aria-hidden /> {SCHOOL.telepon}
            </a>
          </p>
          <p>
            <a
              href={`mailto:${SCHOOL.email}`}
              className="flex min-h-12 items-center gap-2 break-all text-text-primary hover:text-primary hover:underline"
            >
              <Mail className="size-5 shrink-0" aria-hidden /> {SCHOOL.email}
            </a>
          </p>
          <p className="flex items-start gap-2 text-text-primary">
            <Clock className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              Senin–Jumat {SCHOOL.jamSeninJumat}
              <br />
              Sabtu {SCHOOL.jamSabtu}
            </span>
          </p>
        </address>

        <div className="lg:col-span-7">
          <MapsEmbed />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 pb-12 lg:grid-cols-2">
        <div
          id="kontak-form"
          className="scroll-mt-24 rounded-lg border border-border bg-surface p-5 shadow-sm md:p-6"
        >
          <h2 className="pb-1 text-xl font-bold text-text-primary">Kirim Pesan</h2>
          <p className="pb-4 text-sm text-text-secondary">
            Dibalas maksimal 1x24 jam pada jam layanan.
          </p>
          <KontakForm />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <SectionHeading align="left" eyebrow="FAQ" title="Singkat" />
            <div className="pt-4">
              <FAQ items={FAQ_MINI} idPrefix="kontak" />
            </div>
          </div>
          <div className="rounded-lg bg-primary-soft p-5 text-center">
            <p className="font-bold text-text-primary">Sudah yakin mau daftar?</p>
            <p className="pt-1 text-sm text-text-secondary">
              Isi PPDB online ±2 menit, tanpa antre.
            </p>
            <TrackLink
              sumber="kontak"
              className="mt-3 inline-flex h-12 items-center rounded-md bg-primary px-6 font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Daftar PPDB
            </TrackLink>
          </div>
        </div>
      </section>
    </div>
  );
}
