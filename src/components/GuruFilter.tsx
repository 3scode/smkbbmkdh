"use client";

import { useEffect, useId } from "react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { BookOpenCheck, Clock, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/constants";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { GURU_CONTOH, JURUSAN_LIST, TOTAL_GURU, inisial, type Guru } from "@/data/akademik";

export function GuruFilter() {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ history: "replace", throttleMs: 300 }),
  );
  const [jurusan, setJurusan] = useQueryState("jurusan", parseAsString);
  const searchId = useId();
  const hintId = `${searchId}-hint`;

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
  const filtered = GURU_CONTOH.filter((g) => {
    if (jurusan && g.jurusanSlug !== jurusan) return false;
    if (keyword.length === 0) return true;
    if (keyword.length < 2) return true;
    return (
      g.nama.toLowerCase().includes(keyword) ||
      g.mapel.toLowerCase().includes(keyword) ||
      g.jurusanNama.toLowerCase().includes(keyword)
    );
  });

  const reset = () => {
    void setQ(null);
    void setJurusan(null);
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
            placeholder="Cari nama atau mata pelajaran… (tekan / )"
            aria-describedby={hintId}
            className="h-12 w-full rounded-sm border border-border bg-surface pr-4 pl-10 text-base text-text-primary placeholder:text-text-secondary hover:border-text-secondary focus:border-primary focus:ring-[3px] focus:ring-primary-soft focus:outline-none"
          />
        </div>
        <p id={hintId} className="text-[13px] text-text-secondary">
          {keyword.length === 1
            ? "Ketik minimal 2 huruf untuk mencari."
            : "Tips: coba “jaringan”, “akuntansi”, atau “busana”."}
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter jurusan">
          <FilterChip active={!jurusan} onClick={() => void setJurusan(null)} label="Semua" />
          {JURUSAN_LIST.map((j) => (
            <FilterChip
              key={j.slug}
              active={jurusan === j.slug}
              onClick={() => void setJurusan(j.slug)}
              label={j.nama}
            />
          ))}
        </div>
      </div>

      <p aria-live="polite" className="text-sm text-text-secondary tabular-nums">
        Menampilkan {filtered.length} dari {GURU_CONTOH.length} contoh guru
        {q.trim() ? (
          <>
            {" "}
            untuk “<strong className="text-text-primary">{q.trim()}</strong>”
          </>
        ) : null}
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GuruCard key={g.id} guru={g} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="Tidak ada guru yang cocok"
          description="Coba kata kunci lain atau reset filter jurusan."
          ctaLabel="Reset filter"
          onCtaClick={reset}
          linkLabel="Tanya via WA →"
          linkHref={waLink("Assalamualaikum, saya ingin bertanya tentang guru di SMK BBM.")}
        />
      )}

      <p className="text-[13px] text-text-secondary">
        Menampilkan {GURU_CONTOH.length} contoh dari total {TOTAL_GURU} guru. Data real 32 guru
        dimasukkan setelah persetujuan kepala sekolah.
      </p>
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
        "h-11 min-h-[44px] shrink-0 rounded-full px-4 text-sm font-semibold transition-all duration-200",
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

function GuruCard({ guru: g }: { guru: Guru }) {
  return (
    <article className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-lg font-bold text-primary-hover"
        >
          {inisial(g.nama)}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="line-clamp-2 leading-snug font-semibold text-text-primary">{g.nama}</h3>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="amber" size="sm">
              Demo
            </Badge>
            <Link
              href={`/jurusan/${g.jurusanSlug}`}
              aria-label={`Lihat jurusan ${g.jurusanNama}`}
              className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Badge tone="primary" size="sm" className="hover:underline hover:underline-offset-4">
                {g.jurusanNama}
              </Badge>
            </Link>
          </div>
        </div>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-start gap-2">
          <BookOpenCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <dt className="sr-only">Mata pelajaran</dt>
            <dd className="font-medium text-text-primary">{g.mapel}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <dt className="sr-only">Jadwal</dt>
            <dd className="text-text-secondary">{g.jadwal}</dd>
          </div>
        </div>
        {g.waliKelas && (
          <div className="flex items-start gap-2">
            <Users aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <dt className="sr-only">Tugas tambahan</dt>
              <dd className="text-text-secondary">{g.waliKelas}</dd>
            </div>
          </div>
        )}
      </dl>
      <p className="text-[13px] text-text-secondary">
        NUPTK (contoh):{" "}
        <span className="font-medium text-text-primary tabular-nums">{g.nuptk}</span>
      </p>
      <Link
        href={`/jurusan/${g.jurusanSlug}`}
        className="inline-flex min-h-[44px] items-center font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        Lihat jurusan <span aria-hidden>&nbsp;→</span>
      </Link>
    </article>
  );
}
