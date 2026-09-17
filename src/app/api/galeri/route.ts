import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { ekskul, galeri, prestasi } from "@/lib/schema";
import { cacheHeaders, fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { galeriQuerySchema, sanitizeLike } from "@/lib/validations";

export const revalidate = 3600;

export const GET = withHandler(async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawQ = (url.searchParams.get("q") ?? "").trim();
    if (rawQ.length === 1) {
      return fail("VALIDATION_ERROR", "Pencarian minimal 2 karakter.", {
        q: "Ketik minimal 2 huruf untuk mencari galeri.",
      });
    }

    const parsed = galeriQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Parameter tidak valid.", flattenZodError(parsed.error));
    }
    const { q, kategori, tahun, limit } = parsed.data;

    const galeriConditions = [];
    if (kategori) galeriConditions.push(eq(galeri.kategori, kategori));
    if (tahun !== undefined) {
      galeriConditions.push(eq(sql`EXTRACT(YEAR FROM ${galeri.takenAt})`, tahun));
    }
    if (q) galeriConditions.push(ilike(galeri.caption, `%${sanitizeLike(q)}%`));

    // Sequential (bukan Promise.all): aman untuk pool koneksi kecil
    // (Supabase free tier / serverless) dengan biaya latency minimal.
    const galeriRows = await db
      .select()
      .from(galeri)
      .where(galeriConditions.length > 0 ? and(...galeriConditions) : undefined)
      .orderBy(desc(galeri.takenAt), asc(galeri.sortOrder))
      .limit(limit);
    const ekskulRows = await db.select().from(ekskul).orderBy(asc(ekskul.nama));
    const prestasiRows = await db
      .select()
      .from(prestasi)
      .where(tahun !== undefined ? eq(prestasi.tahun, tahun) : undefined)
      .orderBy(desc(prestasi.tahun), asc(prestasi.judul));

    return ok(
      { galeri: galeriRows, ekskul: ekskulRows, prestasi: prestasiRows },
      { total: galeriRows.length },
      { headers: cacheHeaders(3600) },
    );
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat galeri. Coba lagi.");
  }
});
