import {
  and,
  count,
  desc,
  eq,
  gt,
  ilike,
  isNotNull,
  isNull,
  or,
  type SQLWrapper,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { berita, pengumuman } from "@/lib/schema";
import { cacheHeaders, fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { paginate, toOffset } from "@/lib/pagination";
import { listQuerySchema, sanitizeLike } from "@/lib/validations";

export const revalidate = 3600;

export const GET = withHandler(async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const rawQ = (url.searchParams.get("q") ?? "").trim();
    if (rawQ.length === 1) {
      return fail("VALIDATION_ERROR", "Pencarian minimal 2 karakter.", {
        q: "Ketik minimal 2 huruf untuk mencari berita.",
      });
    }

    const parsed = listQuerySchema.safeParse(Object.fromEntries(url.searchParams));
    if (!parsed.success) {
      return fail("VALIDATION_ERROR", "Parameter tidak valid.", flattenZodError(parsed.error));
    }
    const { q, kategori, page, limit } = parsed.data;

    const conditions: (SQLWrapper | undefined)[] = [isNotNull(berita.publishedAt)];
    if (kategori) conditions.push(eq(berita.kategori, kategori));
    if (q) {
      const like = `%${sanitizeLike(q)}%`;
      conditions.push(or(ilike(berita.judul, like), ilike(berita.excerpt, like)));
    }
    const where = and(...conditions);

    // Sequential (bukan Promise.all): aman untuk pool koneksi kecil
    // (Supabase free tier / serverless) dengan biaya latency minimal.
    const rows = await db
      .select()
      .from(berita)
      .where(where)
      .orderBy(desc(berita.publishedAt))
      .limit(limit)
      .offset(toOffset({ page, limit }));
    const totalRows = await db.select({ total: count() }).from(berita).where(where);
    const sidePengumuman = await db
      .select()
      .from(pengumuman)
      .where(
        and(
          eq(pengumuman.isPinned, true),
          or(isNull(pengumuman.expiresAt), gt(pengumuman.expiresAt, new Date())),
        ),
      )
      .orderBy(desc(pengumuman.publishedAt))
      .limit(5);
    const sideAgenda = await db
      .select()
      .from(pengumuman)
      .where(eq(pengumuman.kategori, "agenda"))
      .orderBy(desc(pengumuman.publishedAt))
      .limit(5);

    const total = totalRows[0]?.total ?? 0;
    return ok(
      rows,
      {
        ...paginate(total, page, limit),
        side: { pengumuman: sidePengumuman, agenda: sideAgenda },
      },
      { headers: cacheHeaders(3600) },
    );
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat berita. Coba lagi.");
  }
});
