import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { pengumuman } from "@/lib/schema";
import { guard } from "@/lib/guard";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  judul: z.string().trim().min(5).max(200).optional(),
  body: z.string().trim().min(10).optional(),
  kategori: z.enum(["pengumuman", "agenda"]).optional(),
  isPinned: z.boolean().optional(),
});

async function ambil(id: string) {
  const rows = await db.select().from(pengumuman).where(eq(pengumuman.id, id)).limit(1);
  return rows[0] ?? null;
}

export const PATCH = withHandler(async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!(await ambil(id))) return fail("NOT_FOUND", "Pengumuman tidak ditemukan.");

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
  await db.update(pengumuman).set(parsed.data).where(eq(pengumuman.id, id));
  return ok({ id });
});

export const DELETE = withHandler(async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const { id } = await params;
  if (!(await ambil(id))) return fail("NOT_FOUND", "Pengumuman tidak ditemukan.");
  await db.delete(pengumuman).where(eq(pengumuman.id, id));
  return ok({ id });
});
