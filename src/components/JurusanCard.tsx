import { Card, type CardVariant } from "./ui/Card";

export interface JurusanCardProps {
  slug: string;
  nama: string;
  coverUrl?: string;
  durasi?: string;
  skills?: string[];
  prospek?: string[];
  biayaSingkat?: string;
  variant?: CardVariant;
  className?: string;
}

export function JurusanCard({
  slug,
  nama,
  coverUrl,
  durasi = "3 Tahun",
  skills = [],
  prospek = [],
  biayaSingkat,
  variant = "default",
  className,
}: JurusanCardProps) {
  const shown = skills.slice(0, 4);
  const rest = skills.length - shown.length;
  const meta = [
    durasi,
    shown.length > 0 ? `${shown.join(" • ")}${rest > 0 ? ` +${rest}` : ""}` : null,
    biayaSingkat,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <Card
      variant={variant}
      href={`/jurusan/${slug}`}
      image={coverUrl}
      imageAlt={`Foto praktik jurusan ${nama}`}
      badge={durasi}
      badgeTone="primary"
      eyebrow="Program Keahlian"
      title={nama}
      desc={prospek.slice(0, 3).join(" • ")}
      meta={meta}
      actionLabel="Lihat jurusan"
      className={className}
    />
  );
}
