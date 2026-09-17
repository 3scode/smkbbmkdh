import { count, desc, eq } from "drizzle-orm";
import { db } from "./db";
import { ppdbGelombang, ppdbRegistration } from "./schema";

/** Gelombang aktif (status buka), fallback ke terbaru jika tak ada yang buka. */
export async function getGelombangAktif() {
  const rows = await db
    .select()
    .from(ppdbGelombang)
    .orderBy(desc(ppdbGelombang.startDate))
    .limit(10);
  return rows.find((g) => g.status === "buka") ?? rows[0] ?? null;
}

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** PPDB-2026-A7X2 — 4 char acak tanpa huruf ambigu (I, O, 0, 1). */
export function generateNomorBukti(): string {
  const year = new Date().getFullYear();
  let suffix = "";
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (const b of bytes) suffix += ID_CHARS[b % ID_CHARS.length];
  return `PPDB-${year}-${suffix}`;
}

/** Samarkan nama: "Rizky Pratama" → "Rizky P." (bukti publik tanpa data penuh). */
export function maskNama(nama: string): string {
  const parts = nama.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts[0]} ${(parts[1]?.[0] ?? "").toUpperCase()}.`;
}

export interface PpdbStatus {
  gelombang: typeof ppdbGelombang.$inferSelect;
  semuaGelombang: Array<typeof ppdbGelombang.$inferSelect>;
  sisaHari: number;
  sisaKuota: number;
}

/** Status PPDB live — dipakai route /api/ppdb/status DAN halaman /ppdb. */
export async function getPpdbStatus(): Promise<PpdbStatus | null> {
  const gelombang = await db
    .select()
    .from(ppdbGelombang)
    .orderBy(desc(ppdbGelombang.startDate))
    .limit(10);
  const aktif = gelombang.find((g) => g.status === "buka") ?? gelombang[0] ?? null;
  if (!aktif) return null;
  const sisaHari = Math.max(
    0,
    Math.ceil((new Date(aktif.endDate).getTime() - Date.now()) / 86_400_000),
  );
  const terisi = await db
    .select({ total: count() })
    .from(ppdbRegistration)
    .where(eq(ppdbRegistration.gelombangId, aktif.id));
  return {
    gelombang: aktif,
    semuaGelombang: gelombang,
    sisaHari,
    sisaKuota: Math.max(0, aktif.kuota - (terisi[0]?.total ?? 0)),
  };
}
