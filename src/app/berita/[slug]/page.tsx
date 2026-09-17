import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { and, desc, eq, isNotNull, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { formatTanggalBaca } from "@/lib/utils";
import { renderMarkdown } from "@/lib/markdown";
import { Badge } from "@/components/ui/Badge";
import { BeritaCard } from "@/components/BeritaCard";
import { ShareButtons } from "@/components/ShareButtons";

export const revalidate = 3600;

async function getDetail(slug: string) {
  try {
    const rows = await db
      .select()
      .from(berita)
      .where(and(eq(berita.slug, slug), isNotNull(berita.publishedAt)))
      .limit(1);
    const item = rows[0];
    if (!item) return null;
    const related = await db
      .select()
      .from(berita)
      .where(
        and(
          eq(berita.kategori, item.kategori),
          isNotNull(berita.publishedAt),
          ne(berita.id, item.id),
        ),
      )
      .orderBy(desc(berita.publishedAt))
      .limit(3);
    return { item, related };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const rows = await db
      .select({ slug: berita.slug })
      .from(berita)
      .where(isNotNull(berita.publishedAt));
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
  if (!data) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: data.item.judul,
    description: data.item.excerpt ?? data.item.judul,
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getDetail(slug);
  if (!data) notFound();
  const { item, related } = data;
  const html = await renderMarkdown(item.body);
  const initial = (item.author.trim()[0] ?? "H").toUpperCase();

  return (
    <article className="flex flex-col">
      <div className="mx-auto flex w-full max-w-[800px] flex-col px-4 pt-8">
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
              <Link href="/berita" className="hover:text-primary hover:underline">
                Berita
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-4" />
            </li>
            <li aria-current="page" className="line-clamp-1 font-medium text-text-primary">
              {item.judul}
            </li>
          </ol>
        </nav>

        <p className="flex flex-wrap items-center gap-2 pt-4 text-[13px] text-text-secondary">
          <Badge tone="amber">{item.kategori}</Badge>
          <span>
            {item.publishedAt
              ? formatTanggalBaca(item.publishedAt, item.readingMinutes)
              : ""}
          </span>
        </p>
        <h1 className="pt-2 text-2xl font-bold text-text-primary md:text-[30px]">
          {item.judul}
        </h1>
        <p className="flex items-center gap-2 pt-3 text-sm text-text-secondary">
          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-full bg-primary font-bold text-white"
          >
            {initial}
          </span>
          {item.author}
        </p>
      </div>

      {item.coverUrl && (
        <div className="mx-auto w-full max-w-[800px] px-4 pt-6">
          <span className="relative block aspect-video w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={item.coverUrl}
              alt={item.judul}
              fill
              sizes="(max-width: 800px) 100vw, 800px"
              priority
              className="object-cover"
            />
          </span>
        </div>
      )}

      <div className="mx-auto w-full max-w-[800px] px-4 py-8">
        <div
          className="prose-berita flex flex-col gap-4 leading-[1.7] text-text-primary [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:font-semibold [&_a]:text-primary [&_a]:underline [&_img]:rounded-md [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="pt-6">
          <ShareButtons title={item.judul} path={`/berita/${item.slug}`} />
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-border bg-background-alt">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-4 py-10">
            <h2 className="text-xl font-bold text-text-primary">Berita Terkait</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <BeritaCard
                  key={r.id}
                  slug={r.slug}
                  judul={r.judul}
                  tanggal={
                    r.publishedAt
                      ? new Date(r.publishedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""
                  }
                  kategori={r.kategori}
                  coverUrl={r.coverUrl ?? "/images/placeholder-berita.svg"}
                  excerpt={r.excerpt ?? undefined}
                  readingMinutes={r.readingMinutes}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
