import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { jurusan } from "@/lib/schema";
import { cacheHeaders, fail, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";
import { slugParamSchema } from "@/lib/validations";

export const revalidate = 86400;

async function alternatives() {
  return db
    .select({ slug: jurusan.slug, nama: jurusan.nama })
    .from(jurusan)
    .where(eq(jurusan.isActive, true))
    .orderBy(asc(jurusan.sortOrder))
    .limit(3);
}

export const GET = withHandler(async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    if (!slugParamSchema.safeParse(slug).success) {
      return fail("NOT_FOUND", "Jurusan tidak ditemukan.", {
        alternatives: await alternatives(),
      });
    }

    const rows = await db
      .select()
      .from(jurusan)
      .where(and(eq(jurusan.slug, slug), eq(jurusan.isActive, true)))
      .limit(1);
    const item = rows[0];
    if (!item) {
      return fail("NOT_FOUND", "Jurusan tidak ditemukan.", {
        alternatives: await alternatives(),
      });
    }

    const related = await db
      .select()
      .from(jurusan)
      .where(
        and(
          eq(jurusan.kategori, item.kategori),
          eq(jurusan.isActive, true),
          ne(jurusan.id, item.id),
        ),
      )
      .orderBy(asc(jurusan.sortOrder))
      .limit(3);

    return ok({ item, related }, null, { headers: cacheHeaders(86400) });
  } catch {
    return fail("INTERNAL_ERROR", "Gagal memuat jurusan. Coba lagi.");
  }
});
