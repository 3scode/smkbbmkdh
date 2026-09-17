import { and, asc, ilike, or, eq, type SQLWrapper } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { cacheHeaders, fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { katalogQuerySchema, sanitizeLike } from "@/lib/validations";

export const revalidate = 86400;

export const GET = withHandler(async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawQ = (url.searchParams.get("q") ?? "").trim();
    if (rawQ.length === 1) {
      return fail("VALIDATION_ERROR", "Pencarian minimal 2 karakter.", {
        q: "Ketik minimal 2 huruf untuk mencari jurusan.",
      });
    }

    const parsed = katalogQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Parameter tidak valid.", flattenZodError(parsed.error));
    }
    const { q, kategori, limit } = parsed.data;

    const conditions: (SQLWrapper | undefined)[] = [eq(jurusan.isActive, true)];
    if (kategori) conditions.push(eq(jurusan.kategori, kategori));
    if (q) {
      const like = `%${sanitizeLike(q)}%`;
      conditions.push(or(ilike(jurusan.nama, like), ilike(jurusan.deskripsi, like)));
    }

    const rows = await db
      .select()
      .from(jurusan)
      .where(and(...conditions))
      .orderBy(asc(jurusan.sortOrder))
      .limit(limit);

    return ok(rows, { total: rows.length }, { headers: cacheHeaders(86400) });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat jurusan. Coba lagi.");
  }
});
