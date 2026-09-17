import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { fasilitas } from "@/lib/schema";
import { cacheHeaders, fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { fasilitasQuerySchema } from "@/lib/validations";

export const revalidate = 86400;

export const GET = withHandler(async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = fasilitasQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return fail(
        "VALIDATION_ERROR",
        "Kategori harus salah satu: Iman, Vokasi, Penunjang.",
        flattenZodError(parsed.error),
      );
    }

    const where = parsed.data.kategori ? eq(fasilitas.kategori, parsed.data.kategori) : undefined;

    const rows = await db
      .select()
      .from(fasilitas)
      .where(where)
      .orderBy(desc(fasilitas.isFeatured), asc(fasilitas.nama));

    return ok(rows, { total: rows.length }, { headers: cacheHeaders(86400) });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat fasilitas. Coba lagi.");
  }
});
