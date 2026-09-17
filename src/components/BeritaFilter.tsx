"use client";

import { useId, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { ChevronLeft, ChevronRight, Newspaper, Search } from "lucide-react";
import { cn, formatTanggalBaca } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { BeritaCard } from "./BeritaCard";

export interface BeritaItem {
  id: string;
  slug: string;
  judul: string;
  excerpt: string | null;
  kategori: string;
  coverUrl: string | null;
  publishedAt: string | null;
  readingMinutes: number;
}

const PAGE_SIZE = 9;

export function BeritaFilter({
  items,
  kategoriList,
}: {
  items: BeritaItem[];
  kategoriList: string[];
}) {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace", throttleMs: 300 }),
  );
  const [kategori, setKategori] = useQueryState("kategori", parseAsString);
  const [page, setPage] = useQueryState(
    "page",
    parseAsString.withDefault("1").withOptions({ history: "replace" }),
  );
  const searchId = useId();
  const hintId = `${searchId}-hint`;

  const keyword = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      items.filter((b) => {
        if (kategori && b.kategori !== kategori) return false;
        if (keyword.length === 0) return true;
        if (keyword.length < 2) return true;
        return (
          b.judul.toLowerCase().includes(keyword) ||
          (b.excerpt ?? "").toLowerCase().includes(keyword)
        );
      }),
    [items, kategori, keyword],
  );

  const pageNum = Math.max(1, Number(page) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(pageNum, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const [featured, ...rest] = pageItems;
  const showFeatured = !kategori && !keyword && safePage === 1;
  const gridItems = showFeatured ? rest : pageItems;

  const goPage = (p: number) => {
    void setPage(p <= 1 ? null : String(p));
    document.getElementById("berita-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const reset = () => {
    void setQ(null);
    void setKategori(null);
    void setPage(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div role="search" className="relative max-w-xl">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-text-secondary"
          />
          <input
            id={searchId}
            type="search"
            value={q}
            onChange={(e) => {
              void setQ(e.target.value === "" ? null : e.target.value);
              void setPage(null);
            }}
            placeholder="Cari berita…"
            aria-describedby={hintId}
            className="h-12 w-full rounded-sm border border-border bg-surface pr-4 pl-10 text-base text-text-primary placeholder:text-text-secondary hover:border-text-secondary focus:border-primary focus:ring-[3px] focus:ring-primary-soft focus:outline-none"
          />
        </div>
        {keyword.length === 1 && (
          <p id={hintId} className="text-[13px] text-text-secondary">
            Ketik minimal 2 huruf untuk mencari.
          </p>
        )}
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori berita">
          <Chip active={!kategori} onClick={() => { void setKategori(null); void setPage(null); }} label="Semua" />
          {kategoriList.map((k) => (
            <Chip
              key={k}
              active={kategori === k}
              onClick={() => { void setKategori(k); void setPage(null); }}
              label={k}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-text-secondary">
        Menampilkan {filtered.length} dari {items.length} berita
        {totalPages > 1 ? `, halaman ${safePage} dari ${totalPages}` : ""}
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Belum ada berita pada kategori ini"
          description="Coba kategori lain atau lihat semua berita."
          ctaLabel="Tampilkan semua"
          onCtaClick={reset}
          linkLabel="Lihat arsip →"
          linkHref="/berita"
        />
      ) : (
        <>
          {showFeatured && featured && (
            <Link
              id="berita-list"
              href={`/berita/${featured.slug}`}
              className="group grid gap-4 overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-250 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:grid-cols-2"
            >
              <span className="relative block aspect-video w-full overflow-hidden">
                <Image
                  src={featured.coverUrl ?? "/images/placeholder-berita.svg"}
                  alt={featured.judul}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  loading="lazy"
                  className="object-cover transition-transform duration-250 group-hover:scale-105"
                />
              </span>
              <span className="flex flex-col justify-center gap-2 p-5">
                <span className="flex flex-wrap items-center gap-2 text-[13px] text-text-secondary">
                  <Badge tone="amber">{featured.kategori}</Badge>
                  <span>
                    {featured.publishedAt
                      ? formatTanggalBaca(featured.publishedAt, featured.readingMinutes)
                      : ""}
                  </span>
                </span>
                <span className="line-clamp-3 text-2xl font-bold text-text-primary group-hover:underline">
                  {featured.judul}
                </span>
                {featured.excerpt && (
                  <span className="line-clamp-2 text-text-secondary">{featured.excerpt}</span>
                )}
              </span>
            </Link>
          )}
          <div id={showFeatured ? undefined : "berita-list"} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gridItems.map((b) => (
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

          {totalPages > 1 && (
            <nav aria-label="Halaman berita" className="flex items-center justify-center gap-2 pt-2">
              <PageButton
                label="Halaman sebelumnya"
                disabled={safePage <= 1}
                onClick={() => goPage(safePage - 1)}
              >
                <ChevronLeft className="size-5" aria-hidden />
              </PageButton>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goPage(i + 1)}
                  aria-label={`Halaman ${i + 1}`}
                  aria-current={safePage === i + 1 ? "page" : undefined}
                  className={cn(
                    "flex h-11 min-w-11 items-center justify-center rounded-md px-2 font-semibold",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    safePage === i + 1
                      ? "bg-primary text-white"
                      : "border border-border text-text-primary hover:border-primary hover:text-primary",
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <PageButton
                label="Halaman berikutnya"
                disabled={safePage >= totalPages}
                onClick={() => goPage(safePage + 1)}
              >
                <ChevronRight className="size-5" aria-hidden />
              </PageButton>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        active
          ? "scale-[1.02] bg-primary text-white shadow-sm"
          : "border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
      )}
    >
      {label}
    </button>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-text-primary hover:border-primary hover:text-primary disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {children}
    </button>
  );
}
