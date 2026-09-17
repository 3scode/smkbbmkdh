import { Card, type CardVariant } from "./ui/Card";
import type { BadgeTone } from "./ui/Badge";

const kategoriTone: Record<string, BadgeTone> = {
  Prestasi: "amber",
  DUDI: "primary",
  Wirausaha: "amber",
  Pengumuman: "info",
};

export interface BeritaCardProps {
  slug: string;
  judul: string;
  tanggal: string;
  kategori: string;
  coverUrl?: string;
  excerpt?: string;
  readingMinutes?: number;
  variant?: CardVariant;
  className?: string;
}

export function BeritaCard({
  slug,
  judul,
  tanggal,
  kategori,
  coverUrl,
  excerpt,
  readingMinutes = 3,
  variant = "default",
  className,
}: BeritaCardProps) {
  return (
    <Card
      variant={variant}
      href={`/berita/${slug}`}
      image={coverUrl}
      imageAlt={judul}
      badge={kategori}
      badgeTone={kategoriTone[kategori] ?? "primary"}
      eyebrow={`${tanggal} • ${readingMinutes} mnt baca`}
      title={judul}
      desc={excerpt}
      meta={`Humas SMK BBM`}
      actionLabel="Baca berita"
      className={className}
    />
  );
}
