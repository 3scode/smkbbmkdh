import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { berita } from "@/lib/schema";
import { guard } from "@/lib/guard";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  judul: z.string().trim().min(5).max(200).optional(),
  excerpt: z.string().trim().max(300).nullable().optional(),
  body: z.string().trim().min(20).optional(),
  kategori: z.string().trim().min(2).max(40).optional(),
  terbit: z.boolean().optional(),
});

async function ambil(id: string) {
  const rows = await db.select().from(berita).where(eq(berita.id, id)).limit(1);
  return rows[0] ?? null;
}

export const PATCH = withHandler(async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const { id } = await params;
  const row = await ambil(id);
  if (!row) return fail("NOT_FOUND", "Berita tidak ditemukan.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }
  const p = parsed.data;
  await db
    .update(berita)
    .set({
      ...(p.judul !== undefined ? { judul: p.judul } : {}),
      ...(p.excerpt !== undefined ? { excerpt: p.excerpt || null } : {}),
      ...(p.body !== undefined
        ? {
            body: p.body,
            readingMinutes: Math.max(1, Math.round(p.body.split(/\s+/).length / 200)),
          }
        : {}),
      ...(p.kategori !== undefined ? { kategori: p.kategori } : {}),
      ...(p.terbit !== undefined ? { publishedAt: p.terbit ? new Date() : null } : {}),
    })
    .where(eq(berita.id, id));
  return ok({ id });
});

export const DELETE = withHandler(async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const { id } = await params;
  const row = await ambil(id);
  if (!row) return fail("NOT_FOUND", "Berita tidak ditemukan.");
  await db.delete(berita).where(eq(berita.id, id));
  return ok({ id });
});
