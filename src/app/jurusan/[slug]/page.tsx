import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, ChevronRight, Clock, MessageCircle, Wallet } from "lucide-react";
import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { SCHOOL, waLink } from "@/lib/constants";
import { formatRpShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { JurusanCard } from "@/components/JurusanCard";
import { TrackLink } from "@/components/TrackLink";

export const revalidate = 86400;

async function getDetail(slug: string) {
  try {
    const rows = await db
      .select()
      .from(jurusan)
      .where(and(eq(jurusan.slug, slug), eq(jurusan.isActive, true)))
      .limit(1);
    const item = rows[0];
    if (!item) return null;
    const related = await db
      .select()
      .from(jurusan)
      .where(
        and(
          eq(jurusan.kategori, item.kategori),
          eq(jurusan.isActive, true),
          ne(jurusan.id, item.id),
        ),
      )
      .orderBy(asc(jurusan.sortOrder))
      .limit(3);
    return { item, related };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const rows = await db
      .select({ slug: jurusan.slug })
      .from(jurusan)
      .where(eq(jurusan.isActive, true));
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getDetail(slug);
  if (!data) return { title: "Jurusan Tidak Ditemukan" };
  return {
    title: data.item.nama,
    description: `${data.item.nama} SMK BBM Kandanghaur: prospek kerja, kurikulum, biaya. Durasi ${data.item.durasi}.`,
  };
}

export default async function JurusanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getDetail(slug);
  if (!data) notFound();
  const { item, related } = data;
  const skills = (item.skills as string[]) ?? [];
  const prospek = (item.prospek as string[]) ?? [];
  const kurikulum = (item.kurikulum as string[] | null) ?? [];

  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-background-alt">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-text-secondary">
              <li>
                <Link href="/" className="hover:text-primary hover:underline">
                  Beranda
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li>
                <Link href="/jurusan" className="hover:text-primary hover:underline">
                  Jurusan
                </Link>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-4" />
              </li>
              <li aria-current="page" className="font-medium text-text-primary">
                {item.nama}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-4 py-10 lg:grid-cols-3">
        <article className="flex flex-col gap-6 lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={item.coverUrl ?? "/images/placeholder-jurusan.svg"}
              alt={`Foto praktik jurusan ${item.nama}`}
              fill
              sizes="(max-width: 1024px) 100vw, 760px"
              priority
              className="object-cover"
            />
          </div>

          <div>
            <p className="flex flex-wrap gap-2">
              <Badge tone="primary">{item.kategori}</Badge>
              <Badge tone="outline">
                <Clock className="size-3.5" aria-hidden /> {item.durasi}
              </Badge>
            </p>
            <h1 className="pt-3 text-2xl font-bold text-text-primary md:text-[30px]">
              {item.nama}
            </h1>
            {item.deskripsi && (
              <p className="pt-2 leading-[1.7] text-text-secondary">{item.deskripsi}</p>
            )}
          </div>

          {skills.length > 0 && (
            <section aria-label="Keterampilan">
              <h2 className="text-xl font-bold text-text-primary">Keterampilan yang Dikuasai</h2>
              <ul className="flex flex-wrap gap-2 pt-3">
                {skills.map((s) => (
                  <li key={s}>
                    <Badge tone="primary">{s}</Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {kurikulum.length > 0 && (
            <section aria-label="Kurikulum">
              <h2 className="text-xl font-bold text-text-primary">Kurikulum</h2>
              <ul className="flex list-disc flex-col gap-1.5 pt-3 pl-5 text-text-primary">
                {kurikulum.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </section>
          )}

          {prospek.length > 0 && (
            <section aria-label="Prospek kerja">
              <h2 className="text-xl font-bold text-text-primary">Prospek Kerja & Wirausaha</h2>
              <ul className="flex flex-col gap-2 pt-3">
                {prospek.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-text-primary">
                    <BadgeCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-label="Biaya">
            <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
              <Wallet className="size-5 text-primary" aria-hidden /> Estimasi Biaya
            </h2>
            <dl className="grid gap-3 pt-3 sm:grid-cols-2">
              <div className="rounded-md border border-border bg-surface p-4">
                <dt className="text-sm text-text-secondary">Biaya masuk</dt>
                <dd className="text-xl font-bold text-text-primary">
                  {formatRpShort(item.biayaMasuk).replace("Rp", "Rp ")}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-surface p-4">
                <dt className="text-sm text-text-secondary">SPP bulanan</dt>
                <dd className="text-xl font-bold text-text-primary">
                  {formatRpShort(item.sppBulanan, "/bln").replace("Rp", "Rp ")}
                </dd>
              </div>
            </dl>
            <p className="pt-2 text-sm text-text-secondary">
              Rincian lengkap + cicilan + beasiswa di{" "}
              <Link href="/ppdb#biaya" className="font-semibold text-primary hover:underline">
                halaman PPDB
              </Link>
              .
            </p>
          </section>
        </article>

        <aside className="lg:pt-1">
          <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-md lg:sticky lg:top-24">
            <h2 className="font-bold text-text-primary">Minat jurusan ini?</h2>
            <p className="text-sm text-text-secondary">
              Isi PPDB ±2 menit, otomatis terisi {item.nama}.
            </p>
            <TrackLink
              href={`/ppdb?jurusan=${item.slug}`}
              sumber={`detail-${item.slug}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Daftar Jurusan Ini <ArrowRight className="size-4" aria-hidden />
            </TrackLink>
            <a
              href={waLink(
                `Assalamualaikum, saya ingin bertanya tentang jurusan ${item.nama} di SMK BBM.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-secondary font-semibold text-text-primary hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MessageCircle className="size-4" aria-hidden /> Tanya via WA
            </a>
            <p className="text-[13px] text-text-secondary">
              {SCHOOL.telepon} • {SCHOOL.email}
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border bg-background-alt">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-10">
            <h2 className="text-xl font-bold text-text-primary">Jurusan Lainnya</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <JurusanCard
                  key={r.id}
                  slug={r.slug}
                  nama={r.nama}
                  coverUrl={r.coverUrl ?? "/images/placeholder-jurusan.svg"}
                  durasi={r.durasi}
                  skills={(r.skills as string[]) ?? []}
                  prospek={(r.prospek as string[]) ?? []}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
