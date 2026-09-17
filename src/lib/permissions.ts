import type { Peran } from "./schema";

/**
 * Matriks otorisasi — satu-satunya sumber kebenaran hak akses.
 * Hierarki: siswa < guru < kaprodi/kesiswaan < wakasek < admin.
 * kaprodi & kesiswaan sederajat tapi beda fungsi (jurusan vs siswa/ekskul).
 * Dipakai di Server Component & Route Handler SETELAH requireSession().
 */

export type Kemampuan =
  | "dashboard:lihat"
  | "direktori:lihat_internal"
  | "guru:lihat_semua"
  | "siswa:lihat_semua"
  | "jurusan:kelola"
  | "siswa:kelola"
  | "ekskul:kelola"
  | "konten:kelola"
  | "ppdb:verifikasi"
  | "akun:kelola_staf"
  | "akun:kelola_semua";

const MATRIKS: Record<Kemampuan, Peran[]> = {
  "dashboard:lihat": ["siswa", "guru", "kaprodi", "wakasek", "kesiswaan", "admin"],
  // Guru hanya sejurusannya (difilter di query); peran lain boleh semua internal
  "direktori:lihat_internal": ["guru", "kaprodi", "wakasek", "kesiswaan", "admin"],
  "guru:lihat_semua": ["kaprodi", "wakasek", "kesiswaan", "admin"],
  "siswa:lihat_semua": ["kaprodi", "wakasek", "kesiswaan", "admin"],
  "jurusan:kelola": ["wakasek", "admin"],
  "siswa:kelola": ["kesiswaan", "wakasek", "admin"],
  "ekskul:kelola": ["kesiswaan", "wakasek", "admin"],
  "konten:kelola": ["wakasek", "admin"],
  "ppdb:verifikasi": ["wakasek", "admin"],
  // Wakasek mengelola akun di bawahnya; admin mengelola semua termasuk wakasek
  "akun:kelola_staf": ["wakasek", "admin"],
  "akun:kelola_semua": ["admin"],
};

/** Peran yang boleh dikelola oleh pemilik kemampuan akun (untuk guard target). */
const KELOLA_TARGET: Record<string, Peran[]> = {
  wakasek: ["siswa", "guru", "kaprodi", "kesiswaan"],
  admin: ["siswa", "guru", "kaprodi", "wakasek", "kesiswaan", "admin"],
};

export function can(peran: Peran, kemampuan: Kemampuan): boolean {
  return MATRIKS[kemampuan].includes(peran);
}

/** Bolehkah `oleh` mengelola akun berperangai `target`? */
export function canManageAccount(oleh: Peran, target: Peran): boolean {
  if (oleh === "admin") return true;
  if (oleh === "wakasek")
    return can(oleh, "akun:kelola_staf") && (KELOLA_TARGET.wakasek?.includes(target) ?? false);
  return false;
}

/** Ruang lingkup jurusan untuk peran guru (dipakai memfilter query). */
export function lingkupJurusan(
  peran: Peran,
  jurusanSendiri: string | null,
): "semua" | string | "tidak_ada" {
  if (peran === "guru") return jurusanSendiri ?? "tidak_ada";
  if (peran === "siswa") return "tidak_ada";
  return "semua";
}
