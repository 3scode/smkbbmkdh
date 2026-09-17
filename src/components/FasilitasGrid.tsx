"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { waLink } from "@/lib/constants";
import { Badge, type BadgeTone } from "./ui/Badge";
import { EmptyState } from "./ui/EmptyState";
import { SafeImage } from "./SafeImage";
import { Lightbox } from "./Lightbox";

export interface FasilitasItem {
  id: string;
  nama: string;
  kategori: string;
  kapasitas: string | null;
  deskripsi: string | null;
  fotoUrls: string[];
  isFeatured: boolean;
}

const KATEGORI = ["Semua", "Iman", "Vokasi", "Penunjang"] as const;

const toneFor: Record<string, BadgeTone> = {
  Iman: "success",
  Vokasi: "primary",
  Penunjang: "amber",
};

export function FasilitasGrid({ items }: { items: FasilitasItem[] }) {
  const [kategori, setKategori] = useState<(typeof KATEGORI)[number]>("Semua");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = kategori === "Semua" ? items : items.filter((f) => f.kategori === kategori);
  const featured = filtered.find((f) => f.isFeatured) ?? filtered[0];
  const rest = featured ? filtered.filter((f) => f.id !== featured.id) : [];

  const lbEntries = filtered.flatMap((f) =>
    (f.fotoUrls.length > 0 ? f.fotoUrls : ["/images/placeholder-berita.svg"]).map((src) => ({
      id: f.id,
      item: { src, alt: `Foto ${f.nama}`, caption: f.nama } as const,
    })),
  );
  const lbItems = lbEntries.map((e) => e.item);
  const openAt = (id: string) => {
    const idx = lbEntries.findIndex((e) => e.id === id);
    setLightbox(idx >= 0 ? idx : 0);
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filter kategori fasilitas"
      >
        {KATEGORI.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={kategori === k}
            onClick={() => setKategori(k)}
            className={cn(
              "h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              kategori === k
                ? "scale-[1.02] bg-primary text-white shadow-sm"
                : "border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Foto fasilitas menyusul"
          description="Jadwalkan kunjungan langsung untuk lihat lab & bengkel."
          ctaLabel="Jadwalkan via WA"
          ctaHref={waLink("Assalamualaikum, saya ingin menjadwalkan kunjungan ke SMK BBM.")}
        />
      ) : (
        <>
          {featured && (
            <article className="grid gap-4 rounded-lg border border-border bg-surface p-4 shadow-sm md:grid-cols-2">
              <button
                type="button"
                onClick={() => openAt(featured.id)}
                aria-label={`Perbesar foto ${featured.nama}`}
                className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <SafeImage
                  src={featured.fotoUrls[0] ?? "/images/placeholder-berita.svg"}
                  alt={`Foto ${featured.nama}`}
                  sizes="(max-width: 768px) 100vw, 560px"
                />
              </button>
              <div className="flex flex-col justify-center gap-2">
                <p>
                  <Badge tone={toneFor[featured.kategori] ?? "primary"}>{featured.kategori}</Badge>
                </p>
                <h2 className="text-2xl font-bold text-text-primary">{featured.nama}</h2>
                {featured.kapasitas && (
                  <p className="text-sm font-medium text-text-secondary">{featured.kapasitas}</p>
                )}
                {featured.deskripsi && <p className="text-text-secondary">{featured.deskripsi}</p>}
              </div>
            </article>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((f) => (
              <article
                key={f.id}
                className="flex flex-col overflow-hidden rounded-md border border-border bg-surface shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => openAt(f.id)}
                  aria-label={`Perbesar foto ${f.nama}`}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                >
                  <SafeImage
                    src={f.fotoUrls[0] ?? "/images/placeholder-berita.svg"}
                    alt={`Foto ${f.nama}`}
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="transition-transform duration-300 hover:scale-[1.06]"
                  />
                </button>
                <div className="flex flex-1 flex-col gap-1.5 p-4">
                  <p>
                    <Badge tone={toneFor[f.kategori] ?? "primary"}>{f.kategori}</Badge>
                  </p>
                  <h3 className="font-semibold text-text-primary">{f.nama}</h3>
                  {f.kapasitas && <p className="text-[13px] text-text-secondary">{f.kapasitas}</p>}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col items-center gap-3 rounded-lg bg-primary-soft px-6 py-8 text-center">
        <CalendarClock className="size-8 text-primary" aria-hidden />
        <h2 className="text-xl font-bold text-text-primary">Lihat Langsung Lebih Yakin</h2>
        <p className="max-w-md text-text-secondary">
          Ayah/Bunda bisa menjadwalkan kunjungan untuk melihat lab, bengkel, dan masjid.
        </p>
        <Link
          href={waLink("Assalamualaikum, saya ingin menjadwalkan kunjungan ke SMK BBM.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-12 items-center rounded-md bg-primary px-6 font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Jadwalkan Kunjungan via WA
        </Link>
      </div>

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
