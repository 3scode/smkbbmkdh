export const SCHOOL = {
  nama: "SMK Bangun Bangsa Mandiri",
  namaSingkat: "SMK BBM",
  kota: "Kandanghaur",
  alamat: "Jl. PU Kemped No.212, Kandanghaur, Indramayu 45254",
  npsn: "20233754",
  telepon: "(0234) 123456",
  email: "humas@smkbbm.sch.id",
  jamSeninJumat: "07.00–15.00",
  jamSabtu: "08.00–12.00",
} as const;

export const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Jurusan", href: "/jurusan" },
  { label: "Akademik", href: "/akademik" },
  { label: "Fasilitas", href: "/fasilitas" },
  { label: "Berita", href: "/berita" },
  { label: "PPDB", href: "/ppdb" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
] as const;

export function waNumber(): string {
  return process.env.NEXT_PUBLIC_WA_NUMBER ?? "6281234567890";
}

export function waLink(text: string): string {
  return `https://wa.me/${waNumber()}?text=${encodeURIComponent(text)}`;
}

export const WA_TANYA =
  "Assalamualaikum, saya ingin bertanya tentang SMK Bangun Bangsa Mandiri Kandanghaur.";
