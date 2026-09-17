import { z } from "zod";

/**
 * Skema query GET (dipakai T-04/05/06). Aturan DESIGN:
 * - `q` pencarian minimal 2 karakter (di bawah itu: abaikan + hint di UI)
 * - `limit` default 9 (list) / 12 (katalog), maks 24
 */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(24).default(9),
  q: z
    .string()
    .trim()
    .max(80)
    .optional()
    .transform((v) => (v && v.length >= 2 ? v : undefined)),
  kategori: z.string().trim().max(40).optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export const katalogQuerySchema = listQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(24).default(12),
});

export type KatalogQuery = z.infer<typeof katalogQuerySchema>;

export const galeriQuerySchema = katalogQuerySchema.extend({
  tahun: z.coerce.number().int().min(2000).max(2100).optional(),
});

export type GaleriQuery = z.infer<typeof galeriQuerySchema>;

/** Parse query dari Request URL; gagal → default aman (tidak pernah throw). */
export function parseListQuery(url: string): ListQuery {
  const params = Object.fromEntries(new URL(url).searchParams);
  const parsed = listQuerySchema.safeParse(params);
  if (parsed.success) return parsed.data;
  return { page: 1, limit: 9, q: undefined, kategori: undefined };
}

/* ---------- Form PPDB / Kontak / Notify (FR-07, FR-10) ---------- */

/** WA Indonesia: 08xx / 628xx / +628xx, total digit nasional 10-14. */
export const waRegex = /^(?:0?8\d{8,12}|628\d{8,12}|\+628\d{8,12})$/;

/** Normalisasi ke format 62 (tanpa +) untuk wa.me & penyimpanan. */
export function normalizeWa(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("08")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits; // sudah 62...
}

const namaSchema = z
  .string()
  .trim()
  .min(3, "Nama minimal 3 huruf")
  .max(120)
  .regex(/^[A-Za-z\s.'-]+$/, "Nama hanya boleh huruf, spasi, titik, strip");

const waSchema = z
  .string()
  .trim()
  .regex(waRegex, "No. WA 10-14 digit diawali 08")
  .transform((v) => normalizeWa(v));

export const ppdbSchema = z.object({
  nama: namaSchema,
  asalSmp: z.string().trim().min(3, "Isi asal SMP").max(120),
  jurusanId: z.string().uuid("Pilih jurusan"),
  wa: waSchema,
  tglLahir: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return false;
        const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
        return age >= 12;
      },
      { message: "Usia minimal 12 tahun" },
    ),
  consentWali: z
    .union([z.literal("on"), z.literal("true"), z.literal(true)], {
      error: "Centang persetujuan wali (UU PDP)",
    })
    .transform(() => true as const),
});

export type PpdbInput = z.infer<typeof ppdbSchema>;

/** Tipe input form (sebelum transform): dipakai react-hook-form. */
export type PpdbFormValues = z.input<typeof ppdbSchema>;

export const KEPERLUAN = ["PPDB", "Biaya", "Kerjasama", "Lainnya"] as const;

export const kontakSchema = z.object({
  nama: namaSchema,
  wa: waSchema,
  keperluan: z.enum(KEPERLUAN, "Pilih keperluan"),
  pesan: z.string().trim().min(10, "Pesan minimal 10 karakter").max(2000),
});

export type KontakInput = z.infer<typeof kontakSchema>;

export const notifySchema = z.object({
  wa: waSchema,
  gelombangId: z.string().uuid().optional(),
});

export type NotifyInput = z.infer<typeof notifySchema>;

export const FASILITAS_KATEGORI = ["Iman", "Vokasi", "Penunjang"] as const;

export const fasilitasQuerySchema = z.object({
  kategori: z
    .string()
    .trim()
    .optional()
    .refine((v) => v === undefined || (FASILITAS_KATEGORI as readonly string[]).includes(v), {
      message: "Kategori harus salah satu: Iman, Vokasi, Penunjang",
    }),
});

export const slugParamSchema = z
  .string()
  .trim()
  .min(1, "Slug tidak boleh kosong")
  .max(160)
  .regex(/^[a-z0-9-]+$/, "Slug tidak valid");

/** Bersihkan input untuk LIKE: buang wildcard agar tidak bisa melebar. */
export function sanitizeLike(input: string): string {
  return input
    .replace(/[%_\\]/g, "")
    .trim()
    .slice(0, 80);
}
