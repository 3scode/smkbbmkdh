import { MapPin, Navigation } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

const MAP_QUERY = encodeURIComponent(
  "SMKS Bangun Bangsa Mandiri Kandanghaur, Jl. PU Kemped, Indramayu",
);

/**
 * Peta Google Maps (embed gratis tanpa API key, lazy).
 * Selalu sertakan alamat teks + tombol Rute sebagai fallback
 * jika iframe diblokir/offline.
 */
export function MapsEmbed() {
  return (
    <div className="flex h-full flex-col gap-3">
      <a
        href="#kontak-form"
        className="sr-only focus:not-sr-only focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Lewati peta
      </a>
      <div className="relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-border bg-background-alt">
        <iframe
          title="Peta SMK Bangun Bangsa Mandiri Kandanghaur"
          src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <p className="flex flex-1 items-start gap-2 text-sm text-text-primary">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          {SCHOOL.alamat}
        </p>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Navigation className="size-4" aria-hidden /> Rute ke Sekolah
        </a>
      </div>
    </div>
  );
}
