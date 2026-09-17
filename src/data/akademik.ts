/**
 * Data Akademik — DUMMY untuk demo ke kepala sekolah.
 *
 * Seluruh isi file ini adalah contoh agar format tampilan bisa dinilai.
 * BUKAN data real: jangan disajikan sebagai fakta.
 * Penggantian: ganti array di bawah dengan fetch Supabase/CMS
 * (skema final menyusul) tanpa mengubah komponen tampilan.
 */

export interface JurusanRef {
  slug: string;
  nama: string;
}

export interface Guru {
  id: string;
  nama: string;
  /** NUPTK contoh; prefix 9999 menandai dummy. */
  nuptk: string;
  mapel: string;
  jurusanSlug: string;
  jurusanNama: string;
  jadwal: string;
  waliKelas?: string;
}

export interface Kaprodi {
  id: string;
  nama: string;
  nuptk: string;
  jurusanSlug: string;
  jurusanNama: string;
  periode: string;
}

export interface SiswaAgregat {
  jurusanSlug: string;
  jurusanNama: string;
  x: number;
  xi: number;
  xii: number;
}

export const TAHUN_AJARAN = "2026/2027";

/** Total klaim publik (hero) — ditampilkan sebagai angka, daftar guru di bawah adalah contoh sebagian. */
export const TOTAL_GURU = 32;
export const TOTAL_KAPRODI = 6;
export const TOTAL_SISWA = 480;

export const JURUSAN_LIST: JurusanRef[] = [
  { slug: "tkr", nama: "Teknik Kendaraan Ringan" },
  { slug: "tkj", nama: "Teknik Komputer dan Jaringan" },
  { slug: "akuntansi", nama: "Akuntansi" },
  { slug: "dkv", nama: "Desain Komunikasi Visual" },
  { slug: "busana", nama: "Tata Busana" },
  { slug: "tsm", nama: "Teknik Sepeda Motor" },
];

/** Contoh 12 dari 32 guru — format lengkap, isi dummy. */
export const GURU_CONTOH: Guru[] = [
  { id: "g01", nama: "H. Ahmad Suryana, S.Pd.", nuptk: "9999000000000001", mapel: "Pendidikan Agama Islam", jurusanSlug: "tkr", jurusanNama: "Teknik Kendaraan Ringan", jadwal: "Senin–Kamis • 07.00–15.00", waliKelas: "Wali kelas X TKR 1" },
  { id: "g02", nama: "Dewi Lestari, S.T.", nuptk: "9999000000000002", mapel: "Sistem Pemindah Tenaga", jurusanSlug: "tkr", jurusanNama: "Teknik Kendaraan Ringan", jadwal: "Senin–Jumat • 07.00–15.00" },
  { id: "g03", nama: "Rudi Hartono, S.Kom.", nuptk: "9999000000000003", mapel: "Administrasi Jaringan", jurusanSlug: "tkj", jurusanNama: "Teknik Komputer dan Jaringan", jadwal: "Senin–Jumat • 07.00–15.00", waliKelas: "Wali kelas XI TKJ 1" },
  { id: "g04", nama: "Siti Nurhaliza, S.Kom.", nuptk: "9999000000000004", mapel: "Pemrograman Web", jurusanSlug: "tkj", jurusanNama: "Teknik Komputer dan Jaringan", jadwal: "Senin–Kamis • 07.00–15.00" },
  { id: "g05", nama: "Drs. Bambang Sutrisno", nuptk: "9999000000000005", mapel: "Akuntansi Keuangan", jurusanSlug: "akuntansi", jurusanNama: "Akuntansi", jadwal: "Senin–Jumat • 07.00–15.00", waliKelas: "Wali kelas XII AK 1" },
  { id: "g06", nama: "Rina Marlina, S.E.", nuptk: "9999000000000006", mapel: "Perpajakan", jurusanSlug: "akuntansi", jurusanNama: "Akuntansi", jadwal: "Senin–Kamis • 07.00–15.00" },
  { id: "g07", nama: "Agus Setiawan, S.Ds.", nuptk: "9999000000000007", mapel: "Desain Grafis", jurusanSlug: "dkv", jurusanNama: "Desain Komunikasi Visual", jadwal: "Senin–Jumat • 07.00–15.00", waliKelas: "Wali kelas X DKV 1" },
  { id: "g08", nama: "Maya Putri, S.Ds.", nuptk: "9999000000000008", mapel: "Fotografi & Videografi", jurusanSlug: "dkv", jurusanNama: "Desain Komunikasi Visual", jadwal: "Senin–Kamis • 07.00–15.00" },
  { id: "g09", nama: "Hj. Fatimah Zahra, S.Pd.", nuptk: "9999000000000009", mapel: "Teknologi Menjahit", jurusanSlug: "busana", jurusanNama: "Tata Busana", jadwal: "Senin–Jumat • 07.00–15.00", waliKelas: "Wali kelas XI Busana 1" },
  { id: "g10", nama: "Nur Aisyah, S.Pd.", nuptk: "9999000000000010", mapel: "Desain Busana", jurusanSlug: "busana", jurusanNama: "Tata Busana", jadwal: "Senin–Kamis • 07.00–15.00" },
  { id: "g11", nama: "Joko Prasetyo, S.T.", nuptk: "9999000000000011", mapel: "Pemeliharaan Mesin Sepeda Motor", jurusanSlug: "tsm", jurusanNama: "Teknik Sepeda Motor", jadwal: "Senin–Jumat • 07.00–15.00", waliKelas: "Wali kelas X TSM 1" },
  { id: "g12", nama: "Eko Wijaya, S.Pd.", nuptk: "9999000000000012", mapel: "Kelistrikan Sepeda Motor", jurusanSlug: "tsm", jurusanNama: "Teknik Sepeda Motor", jadwal: "Senin–Kamis • 07.00–15.00" },
];

export const KAPRODI_LIST: Kaprodi[] = [
  { id: "k01", nama: "Dedi Kurniawan, S.T., M.Pd.", nuptk: "9999000000000101", jurusanSlug: "tkr", jurusanNama: "Teknik Kendaraan Ringan", periode: "2024–2028" },
  { id: "k02", nama: "Yusuf Maulana, S.Kom., M.Kom.", nuptk: "9999000000000102", jurusanSlug: "tkj", jurusanNama: "Teknik Komputer dan Jaringan", periode: "2024–2028" },
  { id: "k03", nama: "Sri Wahyuni, S.E., M.Si.", nuptk: "9999000000000103", jurusanSlug: "akuntansi", jurusanNama: "Akuntansi", periode: "2024–2028" },
  { id: "k04", nama: "Andi Nugraha, S.Ds., M.Ds.", nuptk: "9999000000000104", jurusanSlug: "dkv", jurusanNama: "Desain Komunikasi Visual", periode: "2024–2028" },
  { id: "k05", nama: "Lilis Suryani, S.Pd., M.Pd.", nuptk: "9999000000000105", jurusanSlug: "busana", jurusanNama: "Tata Busana", periode: "2024–2028" },
  { id: "k06", nama: "Hendra Gunawan, S.T.", nuptk: "9999000000000106", jurusanSlug: "tsm", jurusanNama: "Teknik Sepeda Motor", periode: "2024–2028" },
];

/** Agregat siswa per jurusan × tingkat — total 480, tanpa nama/NISN (UU PDP). */
export const SISWA_AGREGAT: SiswaAgregat[] = [
  { jurusanSlug: "tkr", jurusanNama: "Teknik Kendaraan Ringan", x: 30, xi: 28, xii: 26 },
  { jurusanSlug: "tkj", jurusanNama: "Teknik Komputer dan Jaringan", x: 30, xi: 28, xii: 24 },
  { jurusanSlug: "akuntansi", jurusanNama: "Akuntansi", x: 28, xi: 27, xii: 25 },
  { jurusanSlug: "dkv", jurusanNama: "Desain Komunikasi Visual", x: 28, xi: 26, xii: 24 },
  { jurusanSlug: "busana", jurusanNama: "Tata Busana", x: 28, xi: 26, xii: 24 },
  { jurusanSlug: "tsm", jurusanNama: "Teknik Sepeda Motor", x: 28, xi: 26, xii: 24 },
];

/** Inisial 2 huruf untuk avatar (tanpa foto asli selama demo). */
export function inisial(nama: string): string {
  const bersih = nama.replace(/^(H\.|Hj\.|Drs\.|Dra\.)\s+/, "");
  const kata = bersih.split(/[\s,.]+/).filter(Boolean);
  return ((kata[0]?.[0] ?? "?") + (kata[1]?.[0] ?? "")).toUpperCase();
}
