"use client";

import { useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { Search, Wrench } from "lucide-react";
import { cn, formatRpShort } from "@/lib/utils";
import { waLink } from "@/lib/constants";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { TrackLink } from "./TrackLink";

export interface JurusanItem {
  id: string;
  slug: string;
  nama: string;
  kategori: string;
  durasi: string;
  skills: string[];
  prospek: string[];
  sppBulanan: number;
  coverUrl: string | null;
}

export function JurusanFilter({
  items,
  kategoriList,
}: {
  items: JurusanItem[];
  kategoriList: string[];
}) {
  // URL state shareable (?q=&kategori=); tulis URL di-throttle 300ms
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace", throttleMs: 300 }),
  );
  const [kategori, setKategori] = useQueryState("kategori", parseAsString);
  const searchId = useId();
  const hintId = `${searchId}-hint`;

  // "/" fokus ke pencarian (di luar input)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        document.getElementById(searchId)?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchId]);

  const keyword = q.trim().toLowerCase();
  const filtered = items.filter((j) => {
    if (kategori && j.kategori !== kategori) return false;
    if (keyword.length === 0) return true;
    if (keyword.length < 2) return true; // tunggu min 2 char, jangan kosongkan grid
    return (
      j.nama.toLowerCase().includes(keyword) ||
      j.kategori.toLowerCase().includes(keyword) ||
      j.skills.some((s) => s.toLowerCase().includes(keyword))
    );
  });

  const reset = () => {
    void setQ(null);
    void setKategori(null);
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
            onChange={(e) => void setQ(e.target.value === "" ? null : e.target.value)}
            placeholder="Cari jurusan… (tekan / )"
            aria-describedby={hintId}
            className="h-12 w-full rounded-sm border border-border bg-surface pr-4 pl-10 text-base text-text-primary placeholder:text-text-secondary hover:border-text-secondary focus:border-primary focus:ring-[3px] focus:ring-primary-soft focus:outline-none"
          />
        </div>
        <p id={hintId} className="text-[13px] text-text-secondary">
          {keyword.length === 1
            ? "Ketik minimal 2 huruf untuk mencari."
            : "Tips: coba “komputer”, “otomotif”, atau “desain”."}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori">
          <FilterChip active={!kategori} onClick={() => void setKategori(null)} label="Semua" />
          {kategoriList.map((k) => (
            <FilterChip
              key={k}
              active={kategori === k}
              onClick={() => void setKategori(k)}
              label={k}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-text-secondary">
        Menampilkan {filtered.length} dari {items.length} jurusan
        {q.trim() ? (
          <>
            {" "}
            untuk “<strong className="text-text-primary">{q.trim()}</strong>”
          </>
        ) : null}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((j) => (
            <JurusanListCard key={j.id} item={j} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Wrench}
          title="Tidak ada jurusan yang cocok"
          description="Coba kata kunci lain atau reset filter kategori."
          ctaLabel="Reset filter"
          onCtaClick={reset}
          linkLabel="Tanya via WA →"
          linkHref={waLink("Assalamualaikum, saya ingin bertanya tentang jurusan di SMK BBM.")}
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
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

function JurusanListCard({ item }: { item: JurusanItem }) {
  const shown = item.skills.slice(0, 4);
  const rest = item.skills.length - shown.length;
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={item.coverUrl ?? "/images/placeholder-jurusan.svg"}
          alt={`Foto praktik jurusan ${item.nama}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          loading="lazy"
          className="object-cover"
        />
        <span className="absolute top-3 left-3">
          <Badge tone="primary">{item.durasi}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[13px] font-medium text-text-secondary">{item.kategori}</p>
        <h3 className="line-clamp-1 text-xl font-semibold text-text-primary">{item.nama}</h3>
        {shown.length > 0 && (
          <p className="line-clamp-1 text-sm text-text-secondary">
            {shown.join(" • ")}
            {rest > 0 ? ` +${rest}` : ""}
          </p>
        )}
        {item.prospek.length > 0 && (
          <ul className="flex list-disc flex-col gap-0.5 pl-5 text-sm text-text-secondary">
            {item.prospek.slice(0, 3).map((p) => (
              <li key={p} className="line-clamp-1">
                {p}
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm font-semibold text-primary">
          {formatRpShort(item.sppBulanan, "/bln")}
        </p>
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            href={`/jurusan/${item.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md border border-primary bg-surface font-semibold text-primary hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Detail
          </Link>
          <TrackLink
            href={`/ppdb?jurusan=${item.slug}`}
            sumber={`jurusan-${item.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-primary font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Daftar
          </TrackLink>
        </div>
      </div>
    </article>
  );
}
