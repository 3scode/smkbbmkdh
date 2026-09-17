import { randomBytes } from "node:crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { guard } from "@/lib/guard";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const beritaSchema = z.object({
  judul: z.string().trim().min(5, "Judul minimal 5 karakter.").max(200),
  excerpt: z.string().trim().max(300).optional().default(""),
  body: z.string().trim().min(20, "Isi minimal 20 karakter."),
  kategori: z.string().trim().min(2, "Kategori wajib diisi.").max(40),
  terbit: z.boolean().optional().default(false),
});

function slugify(judul: string): string {
  const dasar =
    judul
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s-]+/g, "-")
      .slice(0, 120) || "berita";
  return `${dasar}-${randomBytes(3).toString("hex")}`;
}

export const POST = withHandler(async function POST(request: Request) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const rl = checkRateLimit(request, "internal:berita");
  if (!rl.ok) return fail("RATE_LIMITED", "Terlalu sering. Coba lagi 1 menit.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = beritaSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }
  const { judul, excerpt, body: isi, kategori, terbit } = parsed.data;
  const kata = isi.split(/\s+/).length;

  const rows = await db
    .insert(berita)
    .values({
      slug: slugify(judul),
      judul,
      excerpt: excerpt || null,
      body: isi,
      kategori,
      author: g.user.nama,
      publishedAt: terbit ? new Date() : null,
      readingMinutes: Math.max(1, Math.round(kata / 200)),
    })
    .returning({ id: berita.id, slug: berita.slug });
  return ok({ id: rows[0]?.id, slug: rows[0]?.slug });
});
