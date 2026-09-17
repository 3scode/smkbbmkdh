import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe,
  Landmark,
  Megaphone,
  Store,
  Trophy,
  Users,
  Wrench,
} from "lucide-react";
import { asc, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita, jurusan, pengumuman, siteConfig, testimoni } from "@/lib/schema";
import { SCHOOL, waLink, WA_TANYA } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { JurusanCard } from "@/components/JurusanCard";
import { BeritaCard } from "@/components/BeritaCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { StatsCounter } from "@/components/StatsCounter";
import { TestimoniCarousel } from "@/components/TestimoniCarousel";
import { TrackLink } from "@/components/TrackLink";

export const revalidate = 3600;

const VALUES = [
  {
    Icon: Landmark,
    title: "Iman & Ahlak Mulia",
    desc: "Keimanan sebagai fondasi seluruh kegiatan belajar.",
  },
  {
    Icon: Wrench,
    title: "Keterampilan Vokasi",
    desc: "Praktik bengkel, lab, dan teaching factory.",
  },
  { Icon: Store, title: "Jiwa Wirausaha", desc: "Stan usaha siswa + bazar tiap semester." },
  {
    Icon: Globe,
    title: "Bahasa & Wawasan Global",
    desc: "Intensif bahasa Inggris tanpa biaya tambahan.",
  },
  { Icon: Trophy, title: "Seni & Olahraga", desc: "Bakat dikawal sampai level profesional." },
  { Icon: Building2, title: "Kemitraan DUDI", desc: "Magang + penyaluran kerja lulusan." },
] as const;

const GALERI_PREVIEW = [
  { src: "/images/ekskul-futsal/futsal-2.jpg", alt: "Tim futsal SMK BBM", href: "/galeri" },
  { src: "/images/taman-smk/taman-2.jpg", alt: "Taman sekolah SMK BBM", href: "/fasilitas" },
  { src: "/images/kegiatan-osis/osis-2.jpg", alt: "Kegiatan OSIS SMK BBM", href: "/galeri" },
  {
    src: "/images/dll/latihan-dasar-kepemimpinan-siswa.jpg",
    alt: "Latihan dasar kepemimpinan siswa",
    href: "/galeri",
  },
] as const;

const FAQ_SINGKAT = [
  {
    q: "Berapa biaya masuk SMK BBM?",
    a: "Biaya transparan sesuai SNP dan diumumkan terbuka di halaman PPDB. Tersedia cicilan serta beasiswa tahfidz dan prestasi seni-olahraga.",
  },
  {
    q: "Bagaimana cara mendaftar?",
    a: "Isi formulir online di halaman PPDB (±2 menit), dapatkan nomor bukti, lalu konfirmasi via WhatsApp. Bisa juga datang langsung ke Jl. PU Kemped No.212.",
  },
  {
    q: "Apakah lulusan bisa langsung kerja?",
    a: "Ya. Sekolah bermitra dengan DUDI lokal untuk magang dan penyaluran kerja, plus bekal wirausaha dan bahasa Inggris.",
  },
  {
    q: "Di mana lokasi sekolah?",
    a: "Jl. PU Kemped No.212, Kandanghaur, Indramayu — dekat dengan Gabuswetan dan Kroya. Lihat peta di halaman Kontak.",
  },
] as const;

interface HomeStats {
  siswa: number;
  guru: number;
  dudi: number;
  serapan: number;
}

/** Query aman per section: gagal satu → fallback, section lain tetap tampil. */
async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

async function getHomeData() {
  const statsFallback: HomeStats = { siswa: 480, guru: 32, dudi: 18, serapan: 87 };
  // Sequential: aman untuk pool koneksi kecil (Supabase free tier).
  const j = await safe(
    db
      .select()
      .from(jurusan)
      .where(eq(jurusan.isActive, true))
      .orderBy(asc(jurusan.sortOrder))
      .limit(4),
    [],
  );
  const b = await safe(
    db
      .select()
      .from(berita)
      .where(isNotNull(berita.publishedAt))
      .orderBy(desc(berita.publishedAt))
      .limit(3),
    [],
  );
  const p = await safe(
    db
      .select()
      .from(pengumuman)
      .where(eq(pengumuman.isPinned, true))
      .orderBy(desc(pengumuman.publishedAt))
      .limit(3),
    [],
  );
  const t = await safe(db.select().from(testimoni).limit(4), []);
  const s = await safe(
    db.select().from(siteConfig).where(eq(siteConfig.key, "stats")).limit(1),
    [],
  );
  return {
    jurusan: j,
    berita: b,
    info: p,
    testimoni: t,
    stats: (s[0]?.value as HomeStats | undefined) ?? statsFallback,
  };
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`motion-safe:animate-fade-up ${className ?? ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default async function HomePage() {
  const data = await getHomeData();
  const stats = [
    { value: data.stats.siswa, suffix: "+", label: "Siswa Aktif" },
    { value: data.stats.guru, suffix: "", label: "Guru & Tendik" },
    { value: data.stats.dudi, suffix: "", label: "Mitra DUDI" },
    { value: data.stats.serapan, suffix: "%", label: "Lulusan Terserap" },
  ];

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <section className="bg-background-alt">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
          <Reveal>
            <Badge tone="success" dot>
              PPDB Gelombang 1 Dibuka
            </Badge>
            <h1 className="pt-4 text-[30px] leading-[1.15] font-bold text-text-primary md:text-[40px]">
              Mandiri Berahlak, <span className="text-primary">Terampil Berwirausaha</span>
            </h1>
            <p className="pt-3 text-text-secondary">
              Sekolah terjangkau di Kandanghaur untuk pasar kerja lokal & global — vokasi,
              kewirausahaan, bahasa Inggris, dan pembinaan akhlak.
            </p>
            <div className="flex flex-col gap-3 pt-6 sm:flex-row">
              <TrackLink
                sumber="hero"
                className="inline-flex h-[52px] items-center justify-center rounded-md bg-primary px-7 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-primary-hover hover:shadow-md active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Daftar PPDB
              </TrackLink>
              <Link
                href="/jurusan"
                className="inline-flex h-[52px] items-center justify-center rounded-md bg-secondary px-7 font-semibold text-text-primary shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-secondary-hover hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Lihat Jurusan
              </Link>
            </div>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 text-[13px] text-text-secondary">
              <span className="flex items-center gap-1">
                <BadgeCheck className="size-4 text-success" aria-hidden />
                NPSN {SCHOOL.npsn}
              </span>
              <span>Swasta • Kandanghaur, Indramayu</span>
            </p>
          </Reveal>
          <Reveal delay={80} className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-lg">
              <Image
                src="/images/ekskul-futsal/futsal-1.jpg"
                alt="Tim futsal SMK Bangun Bangsa Mandiri Kandanghaur"
                fill
                sizes="(max-width: 768px) 100vw, 560px"
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 flex gap-6 rounded-md border border-border bg-surface px-5 py-3 shadow-md md:left-8">
              <p className="text-center">
                <span className="block text-xl font-bold text-primary">
                  <StatsCounter value={data.stats.siswa} suffix="+" label="Siswa Aktif" />
                </span>
                <span className="text-xs text-text-secondary">Siswa Aktif</span>
              </p>
              <p className="text-center">
                <span className="block text-xl font-bold text-primary">
                  <StatsCounter value={data.stats.serapan} suffix="%" label="Lulusan Terserap" />
                </span>
                <span className="text-xs text-text-secondary">Lulusan Terserap</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS BAND */}
      <section aria-label="Statistik sekolah" className="border-y border-border bg-surface">
        <dl className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <dd className="text-3xl font-bold text-primary">
                <StatsCounter value={s.value} suffix={s.suffix} label={s.label} />
              </dd>
              <dt className="pt-1 text-sm text-text-secondary">{s.label}</dt>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* PROFIL SNIPPET */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-20">
        <Reveal>
          <SectionHeading
            align="split"
            eyebrow="Profil Sekolah"
            title="Sekolah Kejuruan Berfondasi Akhlak"
            desc={`${SCHOOL.nama} di ${SCHOOL.alamat} membekali siswa dengan keterampilan kejuruan, kewirausahaan, kepemimpinan, dan bahasa asing.`}
            link={{ label: "Profil lengkap", href: "/profil" }}
          />
        </Reveal>
      </section>

      {/* JURUSAN PREVIEW */}
      <section className="bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-12 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Program Keahlian"
              title="Pilih Jurusan, Siap Kerja & Wirausaha"
              desc="Enam konsentrasi keahlian dengan prospek kerja lokal maupun global."
              link={{ label: "Lihat semua jurusan", href: "/jurusan" }}
            />
          </Reveal>
          {data.jurusan.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.jurusan.map((j, i) => (
                <Reveal key={j.id} delay={i * 80}>
                  <JurusanCard
                    slug={j.slug}
                    nama={j.nama}
                    coverUrl={j.coverUrl ?? "/images/placeholder-jurusan.svg"}
                    durasi={j.durasi}
                    skills={(j.skills as string[]) ?? []}
                    prospek={(j.prospek as string[]) ?? []}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <ErrorBanner message="Jurusan belum tersedia. Lihat daftar lengkap atau hubungi WA." />
          )}
        </div>
      </section>

      {/* KENAPA BBM */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Kenapa SMK BBM?"
            title="Mandiri Berahlak, Terampil Berwirausaha"
            desc="Enam nilai yang membedakan kami dari sekolah lain di Kandanghaur."
          />
        </Reveal>
        <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="flex h-full flex-col gap-2 rounded-md border border-border bg-surface p-5 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md">
                <span className="flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <v.Icon className="size-6" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold text-text-primary">{v.title}</h3>
                <p className="text-text-secondary">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FASILITAS & GALERI PREVIEW */}
      <section className="bg-background-alt">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-12 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Kehidupan Sekolah"
              title="Fasilitas Nyata, Kegiatan Seru"
              link={{ label: "Buka galeri", href: "/galeri" }}
            />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {GALERI_PREVIEW.map((g, i) => (
              <Reveal key={g.src} delay={i * 80}>
                <Link
                  href={g.href}
                  className="group relative block aspect-[4/3] overflow-hidden rounded-md shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 280px"
                    loading="lazy"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.06]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-text-primary/70 p-2 text-[13px] font-medium text-white">
                    {g.alt}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BERITA + PENGUMUMAN */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Kabar Sekolah"
            title="Berita & Pengumuman Terbaru"
            link={{ label: "Semua berita", href: "/berita" }}
          />
        </Reveal>
        <div className="grid gap-6 pt-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {data.berita.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.berita.map((b) => (
                  <BeritaCard
                    key={b.id}
                    slug={b.slug}
                    judul={b.judul}
                    tanggal={
                      b.publishedAt
                        ? new Date(b.publishedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""
                    }
                    kategori={b.kategori}
                    coverUrl={b.coverUrl ?? "/images/placeholder-berita.svg"}
                    excerpt={b.excerpt ?? undefined}
                    readingMinutes={b.readingMinutes}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Megaphone}
                title="Belum ada berita terbaru"
                description="Ikuti info PPDB & kegiatan via WhatsApp sekolah agar tidak ketinggalan."
                ctaLabel="Hubungi via WA"
                ctaHref={waLink(WA_TANYA)}
                linkLabel="Lihat arsip berita →"
                linkHref="/berita"
              />
            )}
          </div>
          <aside aria-label="Pengumuman" className="flex flex-col gap-3">
            <h3 className="font-bold text-text-primary">Pengumuman</h3>
            {data.info.length > 0 ? (
              data.info.map((p) => (
                <Card
                  key={p.id}
                  variant="compact"
                  href="/berita"
                  eyebrow={
                    p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""
                  }
                  title={p.judul}
                />
              ))
            ) : (
              <p className="text-sm text-text-secondary">Belum ada pengumuman.</p>
            )}
          </aside>
        </div>
      </section>

      {/* TESTIMONI */}
      {data.testimoni.length > 0 && (
        <section className="bg-background-alt">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-12 md:py-20">
            <Reveal>
              <SectionHeading eyebrow="Kata Alumni" title="Mereka Sudah Membuktikan" />
            </Reveal>
            <Reveal>
              <TestimoniCarousel items={data.testimoni} />
            </Reveal>
          </div>
        </section>
      )}

      {/* CTA PPDB + FAQ */}
      <section className="mx-auto w-full max-w-[1200px] px-4 py-12 md:py-20">
        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-lg bg-primary px-6 py-12 text-center shadow-lg">
            <Users className="size-12 text-secondary" aria-hidden />
            <h2 className="max-w-xl text-2xl font-bold text-white md:text-[30px]">
              Siap Jadi Generasi Mandiri Berahlak?
            </h2>
            <p className="max-w-xl text-white/85">
              Pendaftaran Gelombang 1 dibuka. Isi formulir ±2 menit, gratis konsultasi jurusan via
              WhatsApp.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TrackLink
                sumber="cta-bawah"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-md bg-secondary px-7 font-semibold text-text-primary transition-all duration-200 hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Daftar PPDB <ArrowRight className="size-4" aria-hidden />
              </TrackLink>
              <Link
                href="/ppdb#biaya"
                className="inline-flex h-[52px] items-center justify-center rounded-md border border-white/40 px-7 font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Lihat Biaya
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="mx-auto flex max-w-3xl flex-col gap-3 pt-10">
          <Reveal>
            <h2 className="pb-2 text-center text-2xl font-bold text-text-primary">
              Pertanyaan Singkat
            </h2>
          </Reveal>
          <Accordion defaultValue="faq-0">
            {FAQ_SINGKAT.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}
