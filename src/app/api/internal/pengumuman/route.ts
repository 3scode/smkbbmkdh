import { z } from "zod";
import { db } from "@/lib/db";
import { pengumuman } from "@/lib/schema";
import { guard } from "@/lib/guard";
import { fail, flattenZodError, ok } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { withHandler } from "@/lib/with-error";

export const dynamic = "force-dynamic";

const pengumumanSchema = z.object({
  judul: z.string().trim().min(5, "Judul minimal 5 karakter.").max(200),
  body: z.string().trim().min(10, "Isi minimal 10 karakter."),
  kategori: z.enum(["pengumuman", "agenda"], { message: "Kategori harus pengumuman/agenda." }),
  isPinned: z.boolean().optional().default(false),
});

export const POST = withHandler(async function POST(request: Request) {
  const g = await guard("konten:kelola");
  if (!g.ok) return g.response;
  const rl = checkRateLimit(request, "internal:pengumuman");
  if (!rl.ok) return fail("RATE_LIMITED", "Terlalu sering. Coba lagi 1 menit.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("VALIDATION_ERROR", "Format data tidak valid.");
  }
  const parsed = pengumumanSchema.safeParse(body);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Periksa kembali isian.", flattenZodError(parsed.error));
  }
  const rows = await db
    .insert(pengumuman)
    .values({ ...parsed.data })
    .returning({ id: pengumuman.id });
  return ok({ id: rows[0]?.id });
});
