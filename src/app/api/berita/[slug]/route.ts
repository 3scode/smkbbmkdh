import { and, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import sanitizeHtml from "sanitize-html";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { cacheHeaders, fail, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { slugParamSchema } from "@/lib/validations";

export const revalidate = 3600;

const ALLOWED_TAGS = [
  "h2",
  "h3",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "a",
  "img",
  "blockquote",
  "br",
];

export function sanitizeBody(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

export const GET = withHandler(async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!slugParamSchema.safeParse(slug).success) {
      return fail("NOT_FOUND", "Artikel tidak ditemukan.");
    }

    const rows = await db.select().from(berita).where(eq(berita.slug, slug)).limit(1);
    const item = rows[0];
    // Draft tidak bocor ke publik
    if (!item || !item.publishedAt) {
      return fail("NOT_FOUND", "Artikel tidak ditemukan.");
    }

    // Naikkan views; di-await agar konsisten (murah, ~5ms).
    // Kegagalan increment tidak boleh menggagalkan respons detail.
    await db
      .update(berita)
      .set({ views: sql`${berita.views} + 1` })
      .where(eq(berita.id, item.id))
      .catch(() => undefined);

    const related = await db
      .select({
        slug: berita.slug,
        judul: berita.judul,
        kategori: berita.kategori,
        coverUrl: berita.coverUrl,
        publishedAt: berita.publishedAt,
      })
      .from(berita)
      .where(
        and(
          eq(berita.kategori, item.kategori),
          ne(berita.id, item.id),
          isNotNull(berita.publishedAt),
        ),
      )
      .orderBy(desc(berita.publishedAt))
      .limit(3);

    return ok({ item: { ...item, body: sanitizeBody(item.body) }, related }, null, {
      headers: cacheHeaders(3600),
    });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat artikel. Coba lagi.");
  }
});
