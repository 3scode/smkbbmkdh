"use client";

import { useState } from "react";
import { CalendarDays, ImageIcon, Play, Trophy, User, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { SafeImage } from "./SafeImage";
import { Lightbox } from "./Lightbox";
import { OfflineNote } from "./OfflineNote";

export interface GaleriItem {
  id: string;
  caption: string;
  kategori: string;
  takenAt: string | null;
  imageUrl: string;
  videoUrl: string | null;
}

export interface EkskulItem {
  id: string;
  nama: string;
  jadwal: string | null;
  pembina: string | null;
  deskripsi: string | null;
}

export interface PrestasiItem {
  id: string;
  judul: string;
  tahun: number;
  tingkat: string | null;
}

function formatBulan(takenAt: string | null): string {
  if (!takenAt) return "";
  const d = new Date(takenAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

export function GaleriGrid({
  galeri,
  ekskul,
  prestasi,
}: {
  galeri: GaleriItem[];
  ekskul: EkskulItem[];
  prestasi: PrestasiItem[];
}) {
  const kategoriList = [...new Set(galeri.map((g) => g.kategori))].sort();
  const tahunList = [
    ...new Set(
      galeri
        .map((g) => (g.takenAt ? new Date(g.takenAt).getFullYear() : null))
        .filter((y): y is number => y !== null && !Number.isNaN(y)),
    ),
  ].sort((a, b) => b - a);

  const [kategori, setKategori] = useState<string | null>(null);
  const [tahun, setTahun] = useState<number | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = galeri.filter((g) => {
    if (kategori && g.kategori !== kategori) return false;
    if (tahun !== null) {
      const y = g.takenAt ? new Date(g.takenAt).getFullYear() : null;
      if (y !== tahun) return false;
    }
    return true;
  });

  const lbItems = filtered.map((g) => ({
    src: g.videoUrl ?? g.imageUrl,
    alt: g.caption,
    caption: `${g.caption}${formatBulan(g.takenAt) ? ` • ${formatBulan(g.takenAt)}` : ""}`,
  }));

  const reset = () => {
    setKategori(null);
    setTahun(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <OfflineNote />
      <div className="flex flex-col gap-3">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter kategori galeri"
        >
          <Chip active={kategori === null} onClick={() => setKategori(null)} label="Semua" />
          {kategoriList.map((k) => (
            <Chip key={k} active={kategori === k} onClick={() => setKategori(k)} label={k} />
          ))}
        </div>
        {tahunList.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter tahun">
            <Chip active={tahun === null} onClick={() => setTahun(null)} label="Semua tahun" />
            {tahunList.map((t) => (
              <Chip key={t} active={tahun === t} onClick={() => setTahun(t)} label={String(t)} />
            ))}
          </div>
        )}
        <p aria-live="polite" className="text-sm text-text-secondary">
          Menampilkan {filtered.length} dari {galeri.length} foto
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="columns-2 gap-4 md:columns-3 xl:columns-4 [&>*]:mb-4">
          {filtered.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Perbesar foto: ${g.caption}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-md break-inside-avoid shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span className="relative block aspect-[4/3] w-full">
                <SafeImage
                  src={g.imageUrl}
                  alt={g.caption}
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="transition-transform duration-300 group-hover:scale-[1.06]"
                />
              </span>
              {g.videoUrl && (
                <span
                  className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-full bg-text-primary/70 text-white"
                  aria-hidden
                >
                  <Play className="size-4" />
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 translate-y-1 bg-text-primary/70 p-2 text-left text-[13px] font-medium text-white opacity-100 transition-all duration-300 group-hover:translate-y-0 md:translate-y-full md:opacity-0 md:group-hover:opacity-100">
                {g.caption}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ImageIcon}
          title="Belum ada foto kategori ini"
          description="Coba tahun atau kategori lain."
          ctaLabel="Reset filter"
          onCtaClick={reset}
        />
      )}

      {ekskul.length > 0 && (
        <section aria-label="Ekstrakurikuler" className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-text-primary">Ekstrakurikuler</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ekskul.map((e) => (
              <div key={e.id} className="rounded-md border border-border bg-surface p-4 shadow-sm">
                <h3 className="font-bold text-text-primary">{e.nama}</h3>
                {e.jadwal && (
                  <p className="flex items-center gap-1.5 pt-1 text-sm text-text-secondary">
                    <CalendarDays className="size-4 shrink-0" aria-hidden /> {e.jadwal}
                  </p>
                )}
                {e.pembina && (
                  <p className="flex items-center gap-1.5 pt-1 text-sm text-text-secondary">
                    <User className="size-4 shrink-0" aria-hidden /> {e.pembina}
                  </p>
                )}
                {e.deskripsi && <p className="pt-2 text-sm text-text-secondary">{e.deskripsi}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {prestasi.length > 0 && (
        <section aria-label="Prestasi" className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <Trophy className="size-5 text-secondary" aria-hidden /> Prestasi
          </h2>
          <ol className="flex flex-col gap-3">
            {prestasi.map((p) => (
              <li
                key={p.id}
                className="flex items-start gap-3 rounded-md border border-border bg-surface p-4 shadow-sm"
              >
                <Medal className="size-5 shrink-0 text-secondary" aria-hidden />
                <div>
                  <p className="font-semibold text-text-primary">{p.judul}</p>
                  <p className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{p.tahun}</span>
                    {p.tingkat && (
                      <Badge tone="amber" size="sm">
                        {p.tingkat}
                      </Badge>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {lightbox !== null && lbItems.length > 0 && (
        <Lightbox
          items={lbItems}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onIndex={setLightbox}
        />
      )}
    </div>
  );
}

/** Facade video YouTube: thumbnail dulu, iframe dimuat saat diklik (hemat kuota). */
export function VideoFacade({ url, title }: { url: string; title: string }) {
  const [play, setPlay] = useState(false);
  const id = youtubeId(url);
  if (play && id) {
    return (
      <span className="relative block aspect-video w-full overflow-hidden rounded-md">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Putar video: ${title}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {id ? (
        <span className="relative block h-full w-full">
          <SafeImage
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            sizes="(max-width: 768px) 100vw, 560px"
          />
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-background-alt">
          <ImageIcon className="size-8 text-border" aria-hidden />
        </span>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-text-primary/30 transition-colors group-hover:bg-text-primary/50">
        <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-text-primary">
          <Play className="size-6" aria-hidden />
        </span>
      </span>
    </button>
  );
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m?.[1] ?? null;
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
